// File: models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAddress {
  _id: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  is_default: boolean;
  label?: string;
}

export interface IUser extends Document {
  usermail: string;
  username: string;
  password?: string; 
  phone_number: string;
  full_name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  isverified: boolean;
  verification_method: string;
  verification_timestamps: Date[];
  verification_status_history: string[];
  admin_approval: boolean;
  addresses: IAddress[];
  pincode: string;
  cart_id: mongoose.Types.ObjectId;
  wishlist_id: mongoose.Types.ObjectId;
  purchase_history: mongoose.Types.ObjectId[];
  // Additional for B2B marketplace
  company_name?: string;
  gst_number?: string;
  business_type?: string; // e.g., manufacturer, distributor, retailer
}

const AddressSchema: Schema = new Schema({
  address_line1: { type: String, required: true },
  address_line2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  is_default: { type: Boolean, default: false },
  label: String,
});

const UserSchema: Schema = new Schema({
  usermail: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: String,   
  phone_number: String,
  full_name: String,
  age: Number,
  gender: String,
  isverified: { type: Boolean, default: false },
  verification_method: String,
  verification_timestamps: [Date],
  verification_status_history: [String],
  admin_approval: { type: Boolean, default: false },
  addresses: [AddressSchema],
  pincode: String,
  cart_id: { type: Schema.Types.ObjectId, ref: 'Cart' },
  wishlist_id: { type: Schema.Types.ObjectId, ref: 'Wishlist' },
  purchase_history: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
  company_name: String,
  gst_number: String,
  business_type: String,
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);