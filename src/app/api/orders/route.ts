// app/api/orders/route.ts
import { getServerSession } from "next-auth";
import Razorpay from "razorpay";
import { authOptions } from "../auth/[...nextauth]/option";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import mongoose from "mongoose";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items: itemsFromClient, paymentMethod, orderSummary } = body;

    if (
      !itemsFromClient ||
      !Array.isArray(itemsFromClient) ||
      itemsFromClient.length === 0
    ) {
      return NextResponse.json(
        { message: "No items in order" },
        { status: 400 }
      );
    }

    if (!["cod", "online"].includes(paymentMethod)) {
      return NextResponse.json(
        { message: "Invalid payment method" },
        { status: 400 }
      );
    }

    await dbConnect();

    // validate product IDs
    const malformed = itemsFromClient
      .map((i: any) => i.productId)
      .filter((id: string) => !mongoose.Types.ObjectId.isValid(String(id)));
    if (malformed.length) {
      return NextResponse.json(
        { message: "Malformed productId(s)", malformed },
        { status: 400 }
      );
    }

    const productIds = Array.from(
      new Set(itemsFromClient.map((it: any) => String(it.productId)))
    );
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    const productMap = new Map<string, any>();
    products.forEach((p) => productMap.set(String(p._id), p));

    const notFound = productIds.filter((pid) => !productMap.has(pid));
    if (notFound.length > 0) {
      return NextResponse.json(
        {
          message: "Invalid product(s) - not found",
          missingProductIds: notFound,
        },
        { status: 400 }
      );
    }

    // build order items
    const processedItems: {
      productId: string;
      variantId: string;
      quantity: number;
      price: number;
    }[] = [];

    let totalPaise = 0;

    for (const it of itemsFromClient) {
      let { productId, variantId, quantity = 1 } = it;
      const product = productMap.get(String(productId));
      if (!product) {
        return NextResponse.json(
          { message: `Invalid product: ${productId}` },
          { status: 400 }
        );
      }

      if (!variantId) {
        if (Array.isArray(product.variants) && product.variants.length === 1) {
          variantId = String(product.variants[0]._id);
        } else {
          return NextResponse.json(
            { message: `variantId required for product ${productId}` },
            { status: 400 }
          );
        }
      }

      const variant = (product.variants || []).find(
        (v: any) => String(v._id) === String(variantId)
      );
      if (!variant) {
        return NextResponse.json(
          { message: `Invalid variant ${variantId} for product ${productId}` },
          { status: 400 }
        );
      }

      const price = (variant.discounted_price ?? variant.price) as number;
      if (typeof price !== "number" || Number.isNaN(price)) {
        return NextResponse.json(
          { message: `Price not available for product ${productId}` },
          { status: 400 }
        );
      }

      processedItems.push({
        productId: String(productId),
        variantId: String(variantId),
        quantity,
        price,
      });

      totalPaise += Math.round(price * quantity * 100);
    }

    // add delivery fee
    const deliveryFee = orderSummary?.deliveryFee ?? 0;
    totalPaise += Math.round(deliveryFee * 100);

    if (totalPaise <= 0) {
      return NextResponse.json(
        { message: "Invalid total amount" },
        { status: 400 }
      );
    }

    let newOrder;

    if (paymentMethod === "cod") {
      // ✅ Directly create COD order without Razorpay
      newOrder = await Order.create({
        userId: session.user.id,
        items: processedItems,
        amount: totalPaise,
        paymentMethod: "cod",
        paymentStatus: "pending",
        status: "pending",
      });

      return NextResponse.json({
        ok: true,
        message: "COD order placed",
        dbOrderId: newOrder._id,
      });
    }

    // ✅ Online order → create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      // amount: totalPaise,
      amount: 100,
      currency: "INR",
      receipt: `receipt-${Date.now()}`,
      notes: { userId: String(session.user.id) },
    });

    newOrder = await Order.create({
      userId: session.user.id,
      items: processedItems,
      razorpayOrderId: razorpayOrder.id,
      amount: totalPaise,
      paymentMethod: "online",
      paymentStatus: "unpaid",
      status: "pending",
    });

    return NextResponse.json({
      ok: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: newOrder._id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
