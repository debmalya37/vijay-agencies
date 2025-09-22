// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

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

// GET /api/user/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return user profile without sensitive data
    const profile = {
      _id: user._id,
      full_name: user.full_name || '',
      email: user.email,
      phone_number: user.phone_number || '',
      company_name: user.company_name || '',
      gst_number: user.gst_number || '',
      business_type: user.business_type || '',
      username: user.username,
      isverified: user.isverified,
      addresses: user.addresses || []
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await request.json();
    
    // Update allowed fields
    if (updateData.full_name !== undefined) user.full_name = updateData.full_name;
    if (updateData.phone_number !== undefined) user.phone_number = updateData.phone_number;
    if (updateData.company_name !== undefined) user.company_name = updateData.company_name;
    if (updateData.gst_number !== undefined) user.gst_number = updateData.gst_number;
    if (updateData.business_type !== undefined) user.business_type = updateData.business_type;

    await user.save();

    // Return updated profile without sensitive data
    const profile = {
      _id: user._id,
      full_name: user.full_name || '',
      email: user.email,
      phone_number: user.phone_number || '',
      company_name: user.company_name || '',
      gst_number: user.gst_number || '',
      business_type: user.business_type || '',
      username: user.username,
      isverified: user.isverified
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}