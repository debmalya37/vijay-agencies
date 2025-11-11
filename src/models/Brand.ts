// models/Brand.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBrand extends Document {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  is_active: boolean;
  product_ids: mongoose.Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

const BrandSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, maxlength: 500 },
  logo: String,
  is_active: { type: Boolean, default: true },
  product_ids: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Auto slug + timestamp
BrandSchema.pre("save", function (next) {
  const brand = this as unknown as IBrand;
  if (brand.isModified("name") && !brand.slug) {
    brand.slug = brand.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  }
  brand.updated_at = new Date();
  next();
});

export const Brand: Model<IBrand> =
  mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema);
