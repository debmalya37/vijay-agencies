// File: src/app/api/admin/coupons/route.ts
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import { Coupon } from '@/models/Coupon';

export async function GET() {
  try {
    await dbConnect();
    const coupons = await Coupon.find().sort({ created_at: -1 });
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate required fields
    const { code, title, discount_type, discount_value, valid_from, valid_until } = body;
    
    if (!code || !title || !discount_type || discount_value === undefined || !valid_from || !valid_until) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon code already exists' },
        { status: 400 }
      );
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

    const couponData = {
      ...body,
      code: code.toUpperCase(),
      valid_from: fromDate,
      valid_until: untilDate,
    };

    const coupon = new Coupon(couponData);
    await coupon.save();

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}