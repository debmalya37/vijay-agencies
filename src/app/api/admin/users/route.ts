// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
// import { requireAdmin } from '@/lib/auth';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  await dbConnect();
//   await requireAdmin(req);
  const users = await User.find();
  return NextResponse.json(users);
}

export async function PATCH(req: NextRequest) {
  await dbConnect();
//   await requireAdmin(req);
  const { id, update } = await req.json();
  const u = await User.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json(u);
}
