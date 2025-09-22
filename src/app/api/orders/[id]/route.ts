// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import mongoose from "mongoose";

/**
 * GET /api/orders/:id
 * - accepts either DB order _id (24-char hex) OR razorpayOrderId (e.g. order_RKZ...)
 * - ensures the order belongs to the currently authenticated user
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawId = params.id;
    await dbConnect();

    let order = null;

    if (mongoose.Types.ObjectId.isValid(rawId)) {
      // treat as MongoDB _id
      order = await Order.findOne({ _id: rawId, userId: session.user.id });
    } else {
      // treat as razorpayOrderId
      order = await Order.findOne({ razorpayOrderId: rawId, userId: session.user.id });
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/orders/:id
 * - updates order (status, razorpayPaymentId, etc.)
 * - allows updating by either DB _id or razorpayOrderId
 * - (optionally) you may want to restrict to admins here
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawId = params.id;
    const updateData = await request.json();

    await dbConnect();

    // find by objectId or razorpayOrderId
    let order = null;
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      order = await Order.findById(rawId);
    } else {
      order = await Order.findOne({ razorpayOrderId: rawId });
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // OPTIONAL: check ownership or admin rights.
    // Example: allow owner or admin (if you store role in session token)
    // if (String(order.userId) !== String(session.user.id) && session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    // Update allowed fields only
    const allowedFields: Array<keyof typeof updateData> = ["status", "razorpayPaymentId"];
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(updateData, key)) {
        // @ts-ignore
        order[key] = updateData[key];
      }
    }

    await order.save();

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
