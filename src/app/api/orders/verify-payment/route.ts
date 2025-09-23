// app/api/orders/verify-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

type Body = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  // optional: frontend may pass the DB order id (newOrder._id) or the razorpay order id
  orderId?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: Body = await req.json();

    const {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      orderId,
    } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { ok: false, message: "Missing required Razorpay parameters" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET missing in env");
      return NextResponse.json(
        { ok: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // compute expected signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const signatureIsValid = expectedSignature === razorpaySignature;

    await dbConnect();

    // Attempt to find order by razorpayOrderId first, then fallback to DB id if provided
    let order = null;
    if (razorpayOrderId) {
      order = await Order.findOne({ razorpayOrderId: razorpayOrderId });
    }

    if (!order && orderId && mongoose.Types.ObjectId.isValid(orderId)) {
      order = await Order.findById(orderId);
    }

    if (!order) {
      return NextResponse.json(
        { ok: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (!signatureIsValid) {
      // mark order failed (optional) and return
      order.status = "failed";
      order.razorpayPaymentId = razorpayPaymentId; // store for reference
      await order.save().catch((err) => console.warn("Failed to update order after invalid signature:", err));

      return NextResponse.json(
        { ok: false, message: "Invalid signature — payment could not be verified" },
        { status: 400 }
      );
    }

    // signature valid -> update order as confirmed
    order.status = "confirmed";
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    // Optionally: perform other post-payment tasks here (email, inventory reduce, analytics)

    return NextResponse.json({ ok: true, message: "Payment verified", orderId: order._id }, { status: 200 });
  } catch (err) {
    console.error("verify-payment error:", err);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
