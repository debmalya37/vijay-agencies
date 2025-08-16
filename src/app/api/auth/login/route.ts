// src/app/api/users/login/route.ts
// ==============================
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import  dbConnect  from '@/lib/dbConnect';
import { User } from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  await dbConnect();
  const { usermail, password } = await req.json();
  const user = await User.findOne({ usermail }) as { _id: string, password: string } | null;
  if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  const valid = await bcrypt.compare(password, (user as any).password);
  if (!valid) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  const token = generateToken(user!._id.toString());
  return NextResponse.json({ token }, { status: 200 });
}
