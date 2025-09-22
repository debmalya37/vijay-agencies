// app/api/user/addresses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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

// PUT /api/user/addresses/[id] - Update specific address
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressId = params.id;
    const addressData = await request.json();
    
    // Validate required fields
    if (!addressData.address_line1 || !addressData.city || !addressData.state || !addressData.pincode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the address to update
    const addressIndex = user.addresses.findIndex((addr: any) => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // If this is set as default, remove default from other addresses
    if (addressData.is_default) {
      user.addresses.forEach((addr: any) => {
        addr.is_default = false;
      });
    }

    // Update the address
    user.addresses[addressIndex] = {
      _id: new mongoose.Types.ObjectId(addressId).toString(),
      address_line1: addressData.address_line1,
      address_line2: addressData.address_line2 || '',
      city: addressData.city,
      state: addressData.state,
      country: addressData.country || 'India',
      pincode: addressData.pincode,
      is_default: addressData.is_default || false,
      label: addressData.label || 'Home'
    };

    await user.save();

    return NextResponse.json(user.addresses[addressIndex]);
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/user/addresses/[id] - Delete specific address
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressId = params.id;
    
    // Find the address to delete
    const addressIndex = user.addresses.findIndex((addr: any) => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Remove the address
    user.addresses.splice(addressIndex, 1);
    await user.save();

    return NextResponse.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}