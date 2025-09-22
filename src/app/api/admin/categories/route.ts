// File: src/app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get('include_products') === 'true';
    const parentId = searchParams.get('parent_id');
    const activeOnly = searchParams.get('active_only') === 'true';

    // Build query
    const query: any = {};
    if (activeOnly) {
      query.is_active = true;
    }
    if (parentId) {
      query.parent_category = parentId === 'null' ? null : parentId;
    }

    let categories = await Category.find(query)
      .populate('parent_category', 'name slug')
      .populate('subcategories', 'name slug is_active')
      .sort({ sort_order: 1, name: 1 });

    // Update product counts for all categories
    for (const category of categories) {
      const productCount = await Product.countDocuments({
        categories: category.name,
        is_in_stock: true
      });
      
      if (category.product_count !== productCount) {
        category.product_count = productCount;
        await category.save();
      }
    }

    // Include products if requested
    if (includeProducts) {
      const categoriesWithProducts = await Promise.all(
        categories.map(async (category) => {
          const products = await Product.find({
            categories: category.name,
            is_in_stock: true
          }).select('title original_price discounted_price images').limit(10);

          return {
            ...category.toObject(),
            products
          };
        })
      );
      
      return NextResponse.json({ success: true, categories: categoriesWithProducts });
    }

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const image = formData.get('image') as File | null;
    
    // Handle image upload if provided
    let imageUrl = '';
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

      imageUrl = `/uploads/categories/${filename}`;
    }

    // Create category data
    const categoryData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string || undefined,
      description: formData.get('description') as string || undefined,
      image_url: imageUrl || undefined,
      parent_category: formData.get('parent_category') || null,
      is_active: formData.get('is_active') === 'true',
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
      meta_title: formData.get('meta_title') as string || undefined,
      meta_description: formData.get('meta_description') as string || undefined,
    };

    // Validate required fields
    if (!categoryData.name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!categoryData.slug) {
      categoryData.slug = categoryData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug: categoryData.slug });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category slug already exists' },
        { status: 400 }
      );
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

    const category = new Category(categoryData);
    await category.save();

    // Populate parent category for response
    await category.populate('parent_category', 'name slug');

    return NextResponse.json({ success: true, category });
  } catch (error:any) {
    console.error('Error creating category:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Category slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}