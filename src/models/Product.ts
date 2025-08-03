// File: models/Product.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVariant {
  _id: string;
  color?: string;
  size?: string;
  shape?: string;
  stock: number;
  images: string[];
}

export interface IReview {
  _id: string;
  user_id: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  created_at: Date;
}

export interface IProduct extends Document {
  title: string;
  description: string;
  original_price: number;
  discounted_price?: number;
  is_in_stock: boolean;
  stocks: number;
  images?: string[];
  variants?: IVariant[];
  reviews?: IReview[];
  categories: string[]; // e.g., electronics, apparel
  seller_id?: mongoose.Types.ObjectId; // link to user who is seller
  min_order_quantity?: number;
}

const VariantSchema: Schema = new Schema({
  color: String,
  size: String,
  shape: String,
  stock: Number,
  images: [String],
});

const ReviewSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  created_at: { type: Date, default: Date.now },
});

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: String,
  original_price: { type: Number, required: true },
  discounted_price: Number,
  is_in_stock: { type: Boolean, default: true },
  stocks: { type: Number, default: 0 },
  images: [String],
  variants: [VariantSchema],
  reviews: [ReviewSchema],
  categories: [String],
  seller_id: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  min_order_quantity: Number,
});

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);