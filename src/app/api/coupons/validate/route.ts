// File: src/app/api/coupons/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Coupon } from '@/models/Coupon';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { code, order_amount, user_id, categories = [], product_ids = [] } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Find the coupon
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      is_active: true 
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Invalid coupon code' },
        { status: 400 }
      );
    }

    // Check if coupon is within valid date range
    const now = new Date();
    if (now < coupon.valid_from || now > coupon.valid_until) {
      return NextResponse.json(
        { success: false, error: 'Coupon has expired or is not yet valid' },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json(
        { success: false, error: 'Coupon usage limit reached' },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (coupon.min_order_amount && order_amount < coupon.min_order_amount) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Minimum order amount of ₹${coupon.min_order_amount} required` 
        },
        { status: 400 }
      );
    }

    // Check category restrictions
    if (coupon.applicable_categories && coupon.applicable_categories.length > 0) {
      const hasValidCategory = categories.some((category: string) => 
        coupon.applicable_categories?.includes(category)
      );
      
      if (!hasValidCategory) {
        return NextResponse.json(
          { success: false, error: 'Coupon not applicable to items in your cart' },
          { status: 400 }
        );
      }
    }

    // Check product restrictions
    if (coupon.applicable_products && coupon.applicable_products.length > 0) {
      const hasValidProduct = product_ids.some((productId: string) =>
        coupon.applicable_products?.includes(new mongoose.Types.ObjectId(productId))
      );
      
      if (!hasValidProduct) {
        return NextResponse.json(
          { success: false, error: 'Coupon not applicable to items in your cart' },
          { status: 400 }
        );
      }
    }

    // Calculate discount amount
    let discount_amount = 0;
    if (coupon.discount_type === 'percentage') {
      discount_amount = (order_amount * coupon.discount_value) / 100;
      
      // Apply max discount limit for percentage discounts
      if (coupon.max_discount_amount && discount_amount > coupon.max_discount_amount) {
        discount_amount = coupon.max_discount_amount;
      }
    } else {
      discount_amount = Math.min(coupon.discount_value, order_amount);
    }

    // Ensure discount doesn't exceed order amount
    discount_amount = Math.min(discount_amount, order_amount);

    return NextResponse.json({
      success: true,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: Math.round(discount_amount * 100) / 100, // Round to 2 decimal places
        final_amount: Math.round((order_amount - discount_amount) * 100) / 100,
      }
    });

  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}

// Apply coupon (increment usage count)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { coupon_id, user_id } = body;

    if (!coupon_id) {
      return NextResponse.json(
        { success: false, error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findByIdAndUpdate(
      coupon_id,
      { 
        $inc: { used_count: 1 },
        $set: { updated_at: new Date() }
      },
      { new: true }
    );

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Coupon applied successfully',
      coupon
    });

  } catch (error) {
    console.error('Error applying coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to apply coupon' },
      { status: 500 }
    );
  }
}