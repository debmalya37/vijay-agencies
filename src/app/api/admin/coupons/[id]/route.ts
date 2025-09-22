// File: src/app/api/admin/coupons/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Coupon } from '@/models/Coupon';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const coupon = await Coupon.findById(params.id);
    
    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupon' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const { code, title, discount_type, discount_value, valid_from, valid_until } = body;

    // Validate required fields
    if (!code || !title || !discount_type || discount_value === undefined || !valid_from || !valid_until) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if coupon exists
    const existingCoupon = await Coupon.findById(params.id);
    if (!existingCoupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Check if code is being changed and if new code already exists
    if (code.toUpperCase() !== existingCoupon.code) {
      const duplicateCoupon = await Coupon.findOne({ 
        code: code.toUpperCase(), 
        _id: { $ne: params.id } 
      });
      
      if (duplicateCoupon) {
        return NextResponse.json(
          { success: false, error: 'Coupon code already exists' },
          { status: 400 }
        );
      }
    }

    // Validate dates
    const fromDate = new Date(valid_from);
    const untilDate = new Date(valid_until);
    
    if (untilDate <= fromDate) {
      return NextResponse.json(
        { success: false, error: 'Valid until date must be after valid from date' },
        { status: 400 }
      );
    }

    // Validate discount value
    if (discount_type === 'percentage' && discount_value > 100) {
      return NextResponse.json(
        { success: false, error: 'Percentage discount cannot be more than 100%' },
        { status: 400 }
      );
    }

    if (discount_value <= 0) {
      return NextResponse.json(
        { success: false, error: 'Discount value must be greater than 0' },
        { status: 400 }
      );
    }

    const updateData = {
      ...body,
      code: code.toUpperCase(),
      valid_from: fromDate,
      valid_until: untilDate,
      updated_at: new Date(),
    };

    const coupon = await Coupon.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const coupon = await Coupon.findByIdAndDelete(params.id);
    
    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Coupon deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}