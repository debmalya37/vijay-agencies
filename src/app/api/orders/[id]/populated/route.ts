// app/api/orders/[id]/populated/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/option";
import mongoose from "mongoose";

/**
 * GET /api/orders/:id/populated
 * Returns order with populated product and user details for invoice generation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawId = params.id;
    await dbConnect();

    let order = null;

    // Find by MongoDB _id or razorpayOrderId
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      order = await Order.findOne({ _id: rawId, userId: session.user.id })
        .populate("userId")
        .populate("items.productId");
    } else {
      order = await Order.findOne({
        razorpayOrderId: rawId,
        userId: session.user.id,
      })
        .populate("userId")
        .populate("items.productId");
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching populated order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}