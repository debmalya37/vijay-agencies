// src/app/api/cart/route.ts
// ==============================
import { NextResponse } from 'next/server';
import  dbConnect  from '@/lib/dbConnect';
import { Cart } from '@/models/Cart';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  await dbConnect();
  const { id } = await verifyToken(req as any);
  const cart = await Cart.findOne({ user_id: id });
  return NextResponse.json(cart);
}

export async function POST(req: Request) {
  await dbConnect();
  const { id } = await verifyToken(req as any);
  const { product_id, quantity, variant_id } = await req.json();
  const cart = await Cart.findOneAndUpdate(
    { user_id: id },
    { $push: { items: { product_id, quantity, variant_id } } },
    { upsert: true, new: true }
  );
  return NextResponse.json(cart);
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { id } = await verifyToken(req as any);
  const { itemId } = await req.json();
  const cart = await Cart.findOneAndUpdate(
    { user_id: id },
    { $pull: { items: { _id: itemId } } },
    { new: true }
  );
  return NextResponse.json(cart);
}