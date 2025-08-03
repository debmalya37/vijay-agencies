// src/app/api/wishlist/route.ts
// ==============================
import { NextResponse } from 'next/server';
import  dbConnect  from '@/lib/dbConnect';
import { Wishlist } from '@/models/Wishlist';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  await dbConnect();
  const { id } = await verifyToken(req as any);
  const list = await Wishlist.findOne({ user_id: id });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  await dbConnect();
  const { id } = await verifyToken(req as any);
  const { product_id } = await req.json();
  const list = await Wishlist.findOneAndUpdate(
    { user_id: id },
    { $addToSet: { product_ids: product_id } },
    { upsert: true, new: true }
  );
  return NextResponse.json(list);
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { id } = await verifyToken(req as any);
  const { product_id } = await req.json();
  const list = await Wishlist.findOneAndUpdate(
    { user_id: id },
    { $pull: { product_ids: product_id } },
    { new: true }
  );
  return NextResponse.json(list);
}
