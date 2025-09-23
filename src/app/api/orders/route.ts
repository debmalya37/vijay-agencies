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
    const itemsFromClient: Array<{
      productId: string;
      variantId?: string | null;
      quantity?: number;
    }> = body.items;

    if (!itemsFromClient || !Array.isArray(itemsFromClient) || itemsFromClient.length === 0) {
      return NextResponse.json({ message: "No items in order" }, { status: 400 });
    }

    await dbConnect();

    // Basic objectId format validation
    const malformed = itemsFromClient
      .map((i) => i.productId)
      .filter((id) => !mongoose.Types.ObjectId.isValid(String(id)));
    if (malformed.length) {
      return NextResponse.json({ message: "Malformed productId(s)", malformed }, { status: 400 });
    }

    // Fetch all products used in this order
    const productIds = Array.from(new Set(itemsFromClient.map((it) => String(it.productId))));
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    const productMap = new Map<string, any>();
    products.forEach((p) => productMap.set(String(p._id), p));

    // detect missing products
    const notFound = productIds.filter((pid) => !productMap.has(pid));
    if (notFound.length > 0) {
      return NextResponse.json({ message: "Invalid product(s) - not found", missingProductIds: notFound }, { status: 400 });
    }

    const processedItems: {
      productId: string;
      variantId: string; // ensure we always provide a string (Order schema requires it)
      quantity: number;
      price: number; // rupees
    }[] = [];

    let totalPaise = 0;

    for (const it of itemsFromClient) {
      let { productId, variantId, quantity = 1 } = it;
      const product = productMap.get(String(productId));
      if (!product) {
        // defensive - shouldn't happen due to earlier check
        return NextResponse.json({ message: `Invalid product: ${productId}` }, { status: 400 });
      }

      // If client didn't send variantId:
      if (!variantId) {
        // If product has exactly one variant, auto-select it
        if (Array.isArray(product.variants) && product.variants.length === 1) {
          variantId = String(product.variants[0]._id);
        } else if (!product.variants || product.variants.length === 0) {
          // product has no variants (unlikely in your schema), but support fallback
          return NextResponse.json({ message: `Product ${productId} has no variants and variantId is required` }, { status: 400 });
        } else {
          // product has multiple variants -> client must provide variantId
          return NextResponse.json({ message: `variantId required for product ${productId}` }, { status: 400 });
        }
      }

      // Find the variant inside the product (now variantId is guaranteed to be present)
      const variant = (product.variants || []).find((v: any) => String(v._id) === String(variantId));
      if (!variant) {
        return NextResponse.json({ message: `Invalid variant ${variantId} for product ${productId}` }, { status: 400 });
      }

      const price = (variant.discounted_price ?? variant.price) as number;
      if (typeof price !== "number" || Number.isNaN(price)) {
        return NextResponse.json({ message: `Price not available for product ${productId}` }, { status: 400 });
      }

      processedItems.push({
        productId: String(productId),
        variantId: String(variantId),
        quantity,
        price,
      });

      totalPaise += Math.round(price * quantity * 100); // convert to paise
    }

    // add delivery fee
const deliveryFee = body.orderSummary?.deliveryFee ?? 0;
totalPaise += Math.round(deliveryFee * 100);

    if (totalPaise <= 0) {
      return NextResponse.json({ message: "Invalid total amount" }, { status: 400 });
    }

    // Create Razorpay order for total cart amount
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPaise,
      currency: "INR",
      receipt: `receipt-${Date.now()}`,
      notes: { userId: String(session.user.id) },
    });

    // Save order in DB (price stored as rupees in item.price field per model)
    const newOrder = await Order.create({
      userId: session.user.id,
      items: processedItems.map((pi) => ({
        productId: pi.productId,
        variantId: pi.variantId,
        quantity: pi.quantity,
        price: pi.price,
      })),
      razorpayOrderId: razorpayOrder.id,
      amount: totalPaise,
      status: "pending",
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: newOrder._id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
