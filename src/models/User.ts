import bcrypt from "bcryptjs";
import mongoose, { Schema, Document, Model } from "mongoose";

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

const AddressSchema = new Schema<IAddress>(
  {
    address_line1: { type: String, required: true, trim: true },
    address_line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, index: true },
    pincode: { type: String, required: true, trim: true },
    is_default: { type: Boolean, default: false },
    label: { type: String, trim: true },
  },
  { _id: true, timestamps: false }
);

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
  purchase_history: mongoose.Types.ObjectId[];
  company_name?: string;
  gst_number?: string;
  business_type?: string;
  last_login?: Date;
  login_count?: number;
  device_info?: { device: string; os: string; browser: string }[];
  createdAt?: Date;
  updatedAt?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    phone_number: { type: String, sparse: true, trim: true },
    full_name: { type: String, trim: true },
    isverified: { type: Boolean, default: false },
    verification_method: { type: String, trim: true },
    verification_timestamps: [{ type: Date }],
    verification_status_history: [{ type: String }],
    admin_approval: { type: Boolean, default: false },
    addresses: [AddressSchema],
    cart_id: { type: Schema.Types.ObjectId, ref: "Cart", index: true },
    wishlist_id: { type: Schema.Types.ObjectId, ref: "Wishlist" },
    purchase_history: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    company_name: { type: String, trim: true },
    gst_number: { type: String, trim: true },
    business_type: { type: String, trim: true },
    last_login: { type: Date },
    login_count: { type: Number, default: 0 },
    device_info: [
      {
        device: String,
        os: String,
        browser: String,
      },
    ],
  },
  { timestamps: true, minimize: true, versionKey: false }
);

// Keep only composite or custom indexes:
UserSchema.index({ isverified: 1, admin_approval: 1 }); // ✅ keep this

UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    if (typeof this.password === "string") {
      this.password = await bcrypt.hash(this.password, 12);
    } else {
      throw new Error("Password must be a string");
    }
  }
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
