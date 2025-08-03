// File: models/Invoice.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvoice extends Document {
  user_id: mongoose.Types.ObjectId;
  product_ids: mongoose.Types.ObjectId[];
  product_details: object[];
  total_amount: number;
  payment_method: string;
  discount_applied: number;
  coupon_code?: string;
  address_id: mongoose.Types.ObjectId;
  user_details: object;
  created_at: Date;
  updated_at: Date;
  status: string;
  tax_amount?: number;
  shipping_charges?: number;
}

const InvoiceSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product_ids: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  product_details: [Schema.Types.Mixed],
  total_amount: Number,
  payment_method: String,
  discount_applied: Number,
  coupon_code: String,
  address_id: { type: Schema.Types.ObjectId, ref: 'Address' },
  user_details: Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  status: String,
  tax_amount: Number,
  shipping_charges: Number,
});

export const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);