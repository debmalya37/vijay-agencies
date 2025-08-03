// File: models/Cart.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  product_id: mongoose.Types.ObjectId;
  quantity: number;
  variant_id?: mongoose.Types.ObjectId;
}

export interface ICart extends Document {
  user_id: mongoose.Types.ObjectId;
  items: ICartItem[];
  created_at: Date;
  updated_at: Date;
}

const CartItemSchema: Schema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  variant_id: { type: Schema.Types.ObjectId, ref: 'Variant' },
});

const CartSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [CartItemSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
