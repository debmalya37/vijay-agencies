// src/lib/auth.ts
// ==============================
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export function generateToken(id: string) {
  return jwt.sign({ id }, SECRET, { expiresIn: '7d' });
}

export async function verifyToken(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) throw new Error('Unauthorized');
  const token = auth.split(' ')[1];
  return jwt.verify(token, SECRET) as { id: string };
}