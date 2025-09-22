// File: src/app/api/admin/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const category = await Category.findById(params.id)
      .populate('parent_category', 'name slug')
      .populate('subcategories', 'name slug is_active');
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Get products in this category
    const products = await Product.find({
      categories: category.name,
      is_in_stock: true
    }).select('title original_price discounted_price images').limit(20);

    // Update product count
    category.product_count = products.length;
    await category.save();

    return NextResponse.json({ 
      success: true, 
      category: {
        ...category.toObject(),
        products
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const existingCategory = await Category.findById(params.id);
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const image = formData.get('image') as File | null;
    
    let imageUrl = existingCategory.image_url;

    // Handle image upload if new image is provided
    if (image && image.size > 0) {
      // Validate image file
      if (!image.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: 'Invalid file type. Only images are allowed.' },
          { status: 400 }
        );
      }

      // Check file size (limit to 5MB)
      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'File size too large. Maximum 5MB allowed.' },
          { status: 400 }
        );
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'categories');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory might already exist, ignore error
      }

      // Generate unique filename
      const fileExtension = image.name.split('.').pop();
      const filename = `${uuidv4()}.${fileExtension}`;
      const filepath = join(uploadsDir, filename);

      // Convert File to Buffer and save
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Delete old image file if it exists
      if (existingCategory.image_url && existingCategory.image_url.startsWith('/uploads/categories/')) {
        const oldFilepath = join(process.cwd(), 'public', existingCategory.image_url);
        try {
          await unlink(oldFilepath);
        } catch (error) {
          console.log('Could not delete old image file:', error);
        }
      }

      imageUrl = `/uploads/categories/${filename}`;
    }

    // Update category data
    const oldName = existingCategory.name;
    const categoryData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string || undefined,
      image_url: imageUrl,
      parent_category: formData.get('parent_category') || null,
      is_active: formData.get('is_active') === 'true',
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
      meta_title: formData.get('meta_title') as string || undefined,
      meta_description: formData.get('meta_description') as string || undefined,
      updated_at: new Date(),
    };

    // Validate required fields
    if (!categoryData.name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if slug already exists (excluding current category)
    if (categoryData.slug !== existingCategory.slug) {
      const duplicateCategory = await Category.findOne({ 
        slug: categoryData.slug, 
        _id: { $ne: params.id } 
      });
      
      if (duplicateCategory) {
        return NextResponse.json(
          { success: false, error: 'Category slug already exists' },
          { status: 400 }
        );
      }
    }

    // Validate parent category if specified
    if (categoryData.parent_category) {
      const parentCategory = await Category.findById(categoryData.parent_category);
      if (!parentCategory) {
        return NextResponse.json(
          { success: false, error: 'Parent category does not exist' },
          { status: 400 }
        );
      }
    }

    const category = await Category.findByIdAndUpdate(
      params.id,
      categoryData,
      { new: true, runValidators: true }
    ).populate('parent_category', 'name slug');

    // If category name changed, update products that use this category
    if (oldName !== categoryData.name) {
      await Product.updateMany(
        { categories: oldName },
        { $set: { "categories.$": categoryData.name } }
      );
    }

    return NextResponse.json({ success: true, category });
  } catch (error:any) {
    console.error('Error updating category:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Category slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const category = await Category.findById(params.id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has subcategories
    if (category.subcategories && category.subcategories.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category with subcategories. Please delete or move subcategories first.' },
        { status: 400 }
      );
    }

    // Check if category has products
    const productCount = await Product.countDocuments({
      categories: category.name
    });

    if (productCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category with ${productCount} products. Please move or delete products first.` 
        },
        { status: 400 }
      );
    }

    // Delete image file if it exists in uploads folder
    if (category.image_url && category.image_url.startsWith('/uploads/categories/')) {
      const filepath = join(process.cwd(), 'public', category.image_url);
      try {
        await unlink(filepath);
      } catch (error) {
        console.log('Could not delete image file:', error);
      }
    }

    await Category.findByIdAndDelete(params.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}