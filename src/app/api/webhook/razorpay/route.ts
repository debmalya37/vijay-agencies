import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);
    await dbConnect();

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      console.log("Payment captured:", payment);

      // Update order
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { status: "completed", razorpayPaymentId: payment.id },
        { new: true }
      ).populate([
        { path: "items.productId", select: "title" },
        { path: "userId", select: "email" },
      ]);

      if (order) {
        const transporter = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
          },
        });

        const userEmail = (order.userId as any)?.email; // ✅ type assertion
        const productNames = order.items
          .map((it: any) => it.productId?.title)
          .join(", ");

        await transporter.sendMail({
          from: "debmalyasen37@gmail.com",
          to: userEmail,
          subject: "Order Confirmation",
          text: `Your order for ${productNames} has been successfully placed!`,
        });

        console.log(`Order ${order._id} updated to completed.`);
      }
    }

    return NextResponse.json({ message: "Successful" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
