// File: models/Category.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_category?: mongoose.Types.ObjectId;
  subcategories: mongoose.Types.ObjectId[];
  is_active: boolean;
  sort_order: number;
  meta_title?: string;
  meta_description?: string;
  product_count: number;
  created_at: Date;
  updated_at: Date;
}

const CategorySchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  },
  description: { 
    type: String,
    maxlength: 1000
  },
  image_url: String,
  parent_category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category',
    default: null
  },
  subcategories: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Category' 
  }],
  is_active: { 
    type: Boolean, 
    default: true 
  },
  sort_order: { 
    type: Number, 
    default: 0 
  },
  meta_title: { 
    type: String,
    maxlength: 200
  },
  meta_description: { 
    type: String,
    maxlength: 500
  },
  product_count: { 
    type: Number, 
    default: 0,
    min: 0
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Generate slug from name if not provided
CategorySchema.pre('save', function(next) {
  const category = this as unknown as ICategory; // Explicitly cast `this` to `unknown` first, then to `ICategory`
  
  if (category.isModified('name') && !category.slug) {
    category.slug = category.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }
  
  category.updated_at = new Date();
  next();
});

// Prevent circular references in parent-child relationships
CategorySchema.pre('save', async function(next) {
  if (this.parent_category) {
    // Check if the parent category exists
    const parent = await (this.constructor as mongoose.Model<ICategory>).findById(this.parent_category);
    if (!parent) {
      return next(new Error('Parent category does not exist'));
    }
    
    // Prevent self-reference
    if (this.parent_category.toString() === this._id?.toString()) {
      return next(new Error('Category cannot be its own parent'));
    }
    
    // Check for circular references (prevent A -> B -> A)
    let currentParent = parent;
    const visitedIds = new Set([this._id?.toString()]);
    
    while (currentParent && currentParent.parent_category) {
      if (visitedIds.has(currentParent.parent_category.toString())) {
        return next(new Error('Circular reference detected in category hierarchy'));
      }
      visitedIds.add(currentParent.parent_category.toString());
      const foundParent = await this.model('Category').findById(currentParent.parent_category);
      if (!foundParent) {
        break;
      }
      currentParent = foundParent as mongoose.Document<unknown, {}, ICategory> & ICategory & { __v: number };
    }
  }
  
  next();
});

// Update parent's subcategories when a category is saved
CategorySchema.post('save', async function() {
  if (this.parent_category) {
    await this.model('Category').findByIdAndUpdate(
      this.parent_category,
      { 
        $addToSet: { subcategories: this._id },
        $set: { updated_at: new Date() }
      }
    );
  }
});

// Remove from parent's subcategories when category is deleted
CategorySchema.pre('findOneAndDelete', async function() {
  const category = await this.model.findOne(this.getQuery());
  if (category && category.parent_category) {
    await this.model.findByIdAndUpdate(
      category.parent_category,
      { 
        $pull: { subcategories: category._id },
        $set: { updated_at: new Date() }
      }
    );
  }
});

// Create indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent_category: 1 });
CategorySchema.index({ is_active: 1 });
CategorySchema.index({ sort_order: 1 });

export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);