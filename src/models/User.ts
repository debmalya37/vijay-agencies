// File: models/User.ts
import bcrypt from "bcryptjs";
import mongoose, { Schema, Document, Model } from "mongoose";

// -----------------------------
// Address Interface & Schema
// -----------------------------
export interface IAddress extends Document {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  is_default: boolean;
  label?: string;
}

const AddressSchema: Schema<IAddress> = new Schema(
  {
    address_line1: { type: String, required: true },
    address_line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    is_default: { type: Boolean, default: false },
    label: { type: String },
  },
  { _id: true } // let MongoDB handle _id for addresses
);

// -----------------------------
// User Interface & Schema
// -----------------------------
export interface IUser extends Document {
  email: string;
  username: string;
  password?: string;
  role: "user" | "admin";
  phone_number?: string;
  full_name?: string;
  isverified: boolean;
  verification_method?: string;
  verification_timestamps?: Date[];
  verification_status_history?: string[];
  admin_approval: boolean;
  addresses: IAddress[];
  cart_id?: mongoose.Types.ObjectId;
  wishlist_id?: mongoose.Types.ObjectId;
  purchase_history: mongoose.Types.ObjectId[]; // refs Order
  company_name?: string;
  gst_number?: string;
  business_type?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone_number: { type: String },
    full_name: { type: String },
    isverified: { type: Boolean, default: false },
    verification_method: { type: String },
    verification_timestamps: [{ type: Date }],
    verification_status_history: [{ type: String }],
    admin_approval: { type: Boolean, default: false },
    addresses: [AddressSchema],
    cart_id: { type: Schema.Types.ObjectId, ref: "Cart" },
    wishlist_id: { type: Schema.Types.ObjectId, ref: "Wishlist" },
    purchase_history: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    company_name: { type: String },
    gst_number: { type: String },
    business_type: { type: String },
  },
  { timestamps: true }
);

// -----------------------------
// Password Hashing Middleware
// -----------------------------
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    if (typeof this.password === "string") {
      this.password = await bcrypt.hash(this.password, 10);
    } else {
      throw new Error("Password must be a string");
    }
  }
  next();
});

// -----------------------------
// Instance Method for Password Check
// -----------------------------
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// -----------------------------
// Export
// -----------------------------
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
