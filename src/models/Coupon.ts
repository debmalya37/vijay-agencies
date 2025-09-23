// File: models/Coupon.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number; // For percentage discounts
  usage_limit?: number;
  used_count: number;
  valid_from: Date;
  valid_until: Date;
  is_active: boolean;
  applicable_categories?: string[];
  applicable_products?: mongoose.Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

const CouponSchema: Schema = new Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 20
  },
  title: { 
    type: String, 
    required: true,
    maxlength: 100
  },
  description: { 
    type: String,
    maxlength: 500
  },
  discount_type: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  discount_value: { 
    type: Number, 
    required: true,
    min: 0
  },
  min_order_amount: { 
    type: Number,
    min: 0,
    default: 0
  },
  max_discount_amount: { 
    type: Number,
    min: 0
  },
  usage_limit: { 
    type: Number,
    min: 1
  },
  used_count: { 
    type: Number, 
    default: 0,
    min: 0
  },
  valid_from: { 
    type: Date, 
    required: true 
  },
  valid_until: { 
    type: Date, 
    required: true 
  },
  is_active: { 
    type: Boolean, 
    default: true 
  },
  applicable_categories: [String],
  applicable_products: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Add validation
CouponSchema.pre<ICoupon>('save', function(this: ICoupon, next) {
  if (this.valid_until <= this.valid_from) {
    next(new Error('Valid until date must be after valid from date'));
  }
  
  if (this.discount_type === 'percentage' && this.discount_value > 100) {
    next(new Error('Percentage discount cannot be more than 100%'));
  }
  
  this.updated_at = new Date();
  next();
});

export const Coupon: Model<ICoupon> = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);