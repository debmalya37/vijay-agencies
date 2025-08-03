// File: models/Wishlist.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWishlist extends Document {
  user_id: mongoose.Types.ObjectId;
  product_ids: mongoose.Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

const WishlistSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product_ids: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Wishlist: Model<IWishlist> = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);
