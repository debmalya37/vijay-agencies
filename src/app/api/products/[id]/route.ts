// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Product } from '@/models/Product';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const p = await Product.findById(params.id).lean();
  if (!p) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(p);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const update = await req.json();
  const p = await Product.findByIdAndUpdate(params.id, update, { new: true });
  if (!p) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(p);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Deleted' });
}
