// src/app/api/invoices/route.ts
// ==============================
import { NextResponse } from 'next/server';
import  dbConnect  from '@/lib/dbConnect';
import { Invoice } from '@/models/Invoice';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  await dbConnect();
  const { id } = await verifyToken(req as any);
  const data = await req.json(); // includes product details, address, payment
  const inv = await Invoice.create({ user_id: id, ...data });
  return NextResponse.json(inv, { status: 201 });
}

export async function GET(req: Request) {
  await dbConnect();
  const { id } = await verifyToken(req as any);
  const orders = await Invoice.find({ user_id: id });
  return NextResponse.json(orders);
}
