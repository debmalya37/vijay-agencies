// File: models/Banner.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  image_url: string;
  link_url?: string;
  created_at: Date;
}

const BannerSchema: Schema = new Schema({
  title: { 
    type: String, 
    required: true,
    maxlength: 100
  },
  image_url: { 
    type: String, 
    required: true 
  },
  link_url: { 
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Optional field
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Link URL must be a valid URL starting with http:// or https://'
    }
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

export const Banner: Model<IBanner> = mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);