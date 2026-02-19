// File: models/Banner.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBanner extends Document {
  title?: string;
  description?: string; // New
  button_text?: string; // New
  image_url: string;
  link_url?: string;
  bg_color?: string; // New: To match the background color of the slide
  image_position: 'left' | 'right'; // New: Control layout
  created_at: Date;
}

const BannerSchema: Schema = new Schema({
  title: { 
    type: String, 
    required: false,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: false,
    maxlength: 200
  },
  button_text: { 
    type: String, 
    default: 'Shop Now'
  },
  bg_color: { 
    type: String, 
    default: '#EF4F5F' // Default to the dark green in your screenshot
  },
  image_url: { 
    type: String, 
    required: true 
  },
  image_position: {
    type: String,
    enum: ['left', 'right'],
    default: 'right'
  },
  link_url: { 
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true;
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