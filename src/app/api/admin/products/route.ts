// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
// import { requireAdmin } from '@/lib/auth';
import { Product } from '@/models/Product';


export async function GET(req: NextRequest) {
  await dbConnect();
  // await requireAdmin(req);
  const products = await Product.find();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  // await requireAdmin(req);
  const data = await req.json();
  const p = await Product.create(data);
  return NextResponse.json(p, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  await dbConnect();
  // await requireAdmin(req);
  const { id, update } = await req.json();
  const updated = await Product.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json(updated);
}
