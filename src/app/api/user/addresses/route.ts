// app/api/user/addresses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';
import { authOptions } from '../../auth/[...nextauth]/option';
import { getServerSession } from 'next-auth/next';

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    await dbConnect();
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    return null;
  }
}

// GET /api/user/addresses - Get all addresses for user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Session in API:', session); // Debug log
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - No session or email', ok: false },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Use the email from session to find user
    const user = await User.findOne({ email: session.user.email }).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ addresses: user.addresses || [] });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user/addresses - Add new address
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Session in API:', session); // Debug log
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - No session or email', ok: false },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Use the email from session to find user
    const user = await User.findOne({ email: session.user.email }).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressData = await request.json();
    
    // Validate required fields
    if (!addressData.address_line1 || !addressData.city || !addressData.state || !addressData.pincode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // If this is set as default, remove default from other addresses
    if (addressData.is_default) {
      user.addresses.forEach((addr: any) => {
        addr.is_default = false;
      });
    }

    // Create new address with ID
    const newAddress = User.schema.path('addresses').cast({
      _id: new (require('mongoose').Types.ObjectId)(),
      address_line1: addressData.address_line1,
      address_line2: addressData.address_line2 || '',
      city: addressData.city,
      state: addressData.state,
      country: addressData.country || 'India',
      pincode: addressData.pincode,
      is_default: addressData.is_default || false,
      label: addressData.label || 'Home'
    });

    user.addresses.push(newAddress);
    await user.save();

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}