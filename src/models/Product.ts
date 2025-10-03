import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVariant {
  _id: string;
  label: string; // e.g. "2kg", "5kg", "10L"
  unit: "kg" | "g" | "l" | "ml" | "ps"; // standard unit types
  value: number; // numeric value (e.g., 2, 5, 10)
  price: number; // regular price
  discounted_price?: number; // discounted price if available
  stock: number;
  images?: string[];
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
  slug: string;
  description: string;
  base_price: number; // optional "from price"
  discounted_price?: number; // global discounted price (if not per variant)
  variants: IVariant[];
  is_in_stock: boolean;
  images?: string[];
  reviews?: IReview[];
  categories: string[];
  category_ids: mongoose.Types.ObjectId[];
  tags: string[];
  seller_id?: mongoose.Types.ObjectId;
  min_order_quantity?: number;
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

const VariantSchema: Schema = new Schema({
  label: { type: String, required: true },
  unit: { type: String, enum: ["kg", "g", "l", "ml", "ps"], required: true },
  value: { type: Number, required: true },
  price: { type: Number, required: true, min: 0 },
  discounted_price: { type: Number, min: 0 }, // NEW
  stock: { type: Number, default: 0, min: 0 },
  images: [String],
});

const ReviewSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, maxlength: 2000 },
  base_price: { type: Number, min: 0 },
  discounted_price: { type: Number, min: 0 }, // NEW
  variants: { type: [VariantSchema], required: true },
  is_in_stock: { type: Boolean, default: true },
  images: [String],
  reviews: [ReviewSchema],
  categories: [{ type: String, required: true }],
  category_ids: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  tags: [String],
  seller_id: { type: Schema.Types.ObjectId, ref: "User" },
  min_order_quantity: { type: Number, default: 1, min: 1 },
  meta_title: { type: String, maxlength: 200 },
  meta_description: { type: String, maxlength: 500 },
  is_featured: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Slug + updated_at middleware
ProductSchema.pre("save", function (next) {
  const product = this as unknown as IProduct;
  if (product.isModified("title") && !product.slug) {
    product.slug = product.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  product.updated_at = new Date();
  next();
});

// Indexes
ProductSchema.index({ categories: 1 });
ProductSchema.index({ category_ids: 1 });
ProductSchema.index({ is_in_stock: 1 });
ProductSchema.index({ is_featured: 1 });
ProductSchema.index({ created_at: -1 });
ProductSchema.index({ title: "text", description: "text" });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
