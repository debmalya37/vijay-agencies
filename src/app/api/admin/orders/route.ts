// src/app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import nodemailer from "nodemailer";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { IUser } from "@/models/User";
import { IProduct } from "@/models/Product";
// ----------------------------
// ✅ Allowed Order Statuses
// ----------------------------
const ALLOWED_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
  "failed",
];

// ----------------------------
// ✅ Initialize Transporter Once (for better perf)
// ----------------------------
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

// ----------------------------
// ✅ Email Utility with Fail-safe Logging
// ----------------------------
async function sendEmail(to: string, subject: string, html: string) {
  try {
    const transporter = getTransporter();
    const result = await transporter.sendMail({
      from: `"Vijay Agencies" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("📧 Email sent:", result.response);
    return true;
  } catch (error: any) {
    console.error("❌ Email sending failed:", error?.message);
    return false;
  }
}

// ----------------------------
// ✅ GET /api/admin/orders
// ----------------------------
export async function GET() {
  try {
    // Connect to DB — cached connection ensures no re-init issues
    await dbConnect();

    await User.init(); // ensure indexes
    await Product.init(); // ensure indexes
    await Order.init(); // ensure indexes

    // ⚡ Optimized query
    const orders = await Order.find({})
      .populate("userId", "username email -_id")
      .populate("items.productId", "title -_id")
      .sort({ createdAt: -1 })
      .lean() // skip doc hydration for speed
      .exec(); // ensures consistent Promise behavior

    // ✅ Handle empty list explicitly
    if (!orders || orders.length === 0) {
      return NextResponse.json({ message: "No orders found", orders: [] }, { status: 200 });
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (err: any) {
    console.error("❌ Admin GET orders error:", err.message || err);
    return NextResponse.json(
      { message: "Failed to fetch orders", error: err.message },
      { status: 500 }
    );
  }
}

// ----------------------------
// ✅ PATCH /api/admin/orders
// body: { id: string, status: string }
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("📦 Admin PATCH /api/admin/orders body:", body);

    const { id, status } = body || {};

    if (!id || typeof id !== "string") {
      return NextResponse.json({ message: "Missing order id" }, { status: 400 });
    }

    if (!status || typeof status !== "string") {
      return NextResponse.json({ message: "Missing status" }, { status: 400 });
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value", allowed: ALLOWED_STATUSES },
        { status: 400 }
      );
    }

    let updated: any = null;

    // ✅ Try update by Mongo ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Order.findByIdAndUpdate(id, { status }, { new: true })
        .populate("userId", "username email")
        .populate("items.productId", "title")
        .lean();
    }

    // ✅ If not found by _id, try using razorpayOrderId
    if (!updated) {
      updated = await Order.findOneAndUpdate(
        { razorpayOrderId: id },
        { status },
        { new: true }
      )
        .populate("userId", "username email")
        .populate("items.productId", "title")
        .lean()
        .exec();
    }

    // ✅ If still not found
    if (!updated) {
      return NextResponse.json(
        { message: "Order not found (by _id or razorpayOrderId)" },
        { status: 404 }
      );
    }

    // ✅ Send email notification to user
    const userEmail = updated.userId?.email;
    const username = updated.userId?.username || "User";

    if (userEmail) {
      const subject = `Your Order #${updated.razorpayOrderId} status updated`;
      const html = `
        <h2>Hello ${username},</h2>
        <p>Your order with ID <b>${updated.razorpayOrderId}</b> has been updated to status: <b>${updated.status}</b>.</p>
        <p>Thank you for shopping with us!</p>
      `;

      console.log(`📨 Trying to send email to ${userEmail}...`);

      const emailSent = await sendEmail(userEmail, subject, html);

      if (!emailSent) {
        console.warn("⚠️ Email sending failed (check Vercel logs).");
        return NextResponse.json(
          {
            message: "Order updated but email failed (check server logs)",
            order: updated,
          },
          { status: 200 }
        );
      }
    }

    console.log("✅ Order updated successfully:", updated._id);
    return NextResponse.json(
      { message: "Order updated", order: updated },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ Admin PATCH orders error:", err.message || err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}
