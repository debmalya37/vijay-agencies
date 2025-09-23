// File: src/app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const hierarchical = searchParams.get('hierarchical') === 'true';
    const includeProducts = searchParams.get('include_products') === 'true';
    const limit = parseInt(searchParams.get('limit') || '0');
    const parentId = searchParams.get('parent_id');
    
    // Build query - only active categories
    const query: any = { is_active: true };
    
    if (parentId) {
      query.parent_category = parentId === 'null' ? null : parentId;
    }

    let categories = await Category.find(query)
      .populate('parent_category', 'name slug')
      .populate('subcategories', 'name slug image_url')
      .sort({ sort_order: 1, name: 1 })
      .limit(limit);

    // Update product counts
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

    // Include sample products if requested
    let transformedCategories = categories;
    if (includeProducts) {
      const categoriesWithProducts = await Promise.all(
        categories.map(async (category) => {
          const products = await Product.find({
            categories: category.name,
            is_in_stock: true
          })
          .select('title original_price discounted_price images slug')
          .sort({ created_at: -1 })
          .limit(8);

          return {
            ...category.toObject(),
            products
          };
        })
      );
      
      transformedCategories = categoriesWithProducts;
    }

    // Build hierarchical structure if requested
    if (hierarchical) {
      const buildHierarchy = (cats: any[], parentId: string | null = null): any[] => {
        return cats
          .filter(cat => {
            const catParentId = cat.parent_category?._id?.toString() || null;
            return catParentId === parentId;
          })
          .map(cat => ({
            ...cat,
            children: buildHierarchy(cats, cat._id.toString())
          }));
      };

      const hierarchicalCategories = buildHierarchy(categories.map(cat => cat.toObject ? cat.toObject() : cat));
      
      return NextResponse.json({ 
        success: true, 
        categories: hierarchicalCategories 
      });
    }

    return NextResponse.json({ success: true, categories: hierarchical ? categories : transformedCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}