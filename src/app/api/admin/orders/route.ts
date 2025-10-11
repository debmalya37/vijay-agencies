// src/app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import { Order } from '@/models/Order';
import nodemailer from 'nodemailer';

const ALLOWED_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'failed'];

// Create nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Utility function to send email
async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: `"Vijay Agencies" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

// GET /api/admin/orders
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const orders = await Order.find()
      .populate('userId', 'username email')
      .populate('items.productId', 'title')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error('Admin GET orders error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/orders
// body: { id: string, status: string }
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log('Admin PATCH /api/admin/orders body:', body);

    const { id, status } = body || {};

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ message: 'Missing order id' }, { status: 400 });
    }

    if (!status || typeof status !== 'string') {
      return NextResponse.json({ message: 'Missing status' }, { status: 400 });
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ message: 'Invalid status value', allowed: ALLOWED_STATUSES }, { status: 400 });
    }

    let updated: any = null;

    // Try update by Mongo ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      )
        .populate('userId', 'username email')
        .populate('items.productId', 'title')
        .lean();
    }

    // If not found by _id, try using razorpayOrderId
    if (!updated) {
      updated = await Order.findOneAndUpdate(
        { razorpayOrderId: id },
        { status },
        { new: true }
      )
        .populate('userId', 'username email')
        .populate('items.productId', 'title')
        .lean();
    }

    // If still not found, return 404
    if (!updated) {
      return NextResponse.json({ message: 'Order not found (by _id or razorpayOrderId)' }, { status: 404 });
    }

    // ✅ Send email notification to user
    const userEmail = updated.userId?.email;
    const username = updated.userId?.username || 'User';

    if (userEmail) {
      const subject = `Your Order #${updated.razorpayOrderId} status updated`;
      const html = `
        <h2>Hello ${username},</h2>
        <p>Your order with ID <b>${updated.razorpayOrderId}</b> has been updated to status: <b>${updated.status}</b>.</p>
        <p>Thank you for shopping with us!</p>
      `;
      // send email asynchronously
      sendEmail(userEmail, subject, html);
    }

    return NextResponse.json({ message: 'Order updated', order: updated }, { status: 200 });
  } catch (err) {
    console.error('Admin PATCH orders error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
