// src/app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import { Invoice } from '@/models/Invoice';

// GET all orders (invoices)
export async function GET(req: NextRequest) {
  await dbConnect();
  const orders = await Invoice.find().populate('user_id');
  return NextResponse.json(orders);
}

// PATCH order status
export async function PATCH(req: NextRequest) {
  await dbConnect();

  const { id, status } = await req.json();

  // If id is not a valid ObjectId, skip DB update (demo order)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Demo order, no-op' }, { status: 200 });
  }

  const updated = await Invoice.findByIdAndUpdate(id, { status }, { new: true });
  if (!updated) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}
