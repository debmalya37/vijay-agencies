// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/option';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';

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
    const user = await User.findOne({ usermail: session.user.email }).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', ok: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: user,
      ok: true
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error', ok: false },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized', ok: false },
        { status: 401 }
      );
    }

    const updateData = await request.json();
    
    // Remove sensitive fields that shouldn't be updated through this route
    const {
      _id,
      password,
      usermail, // Don't allow email changes
      verification_timestamps,
      verification_status_history,
      cart_id,
      wishlist_id,
      purchase_history,
      ...safeUpdateData
    } = updateData;

    await dbConnect();
    
    const updatedUser = await User.findOneAndUpdate(
      { usermail: session.user.email },
      { $set: safeUpdateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found', ok: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: updatedUser,
      message: 'User updated successfully',
      ok: true
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error', ok: false },
      { status: 500 }
    );
  }
}