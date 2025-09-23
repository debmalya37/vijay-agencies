// File: src/app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Category, ICategory } from '@/models/Category';
import { Product, IProduct } from '@/models/Product';

// Extended API type for category response
// import { ICategory } from "@/models/Category";

// Define what you want to return in API response
export interface CategoryResponse {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent_category?: {
    _id: string;
    name: string;
    slug: string;
  } | null;
  createdAt?: Date;
  updatedAt?: Date;
  product_count?: number; // Added product_count property
}

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

    // Fetch categories
    const categoriesDocs = await Category.find(query)
      .populate('parent_category', 'name slug')
      .populate('subcategories', 'name slug image_url')
      .sort({ sort_order: 1, name: 1 })
      .limit(limit);

    // Convert to plain objects for API response
    let categories: CategoryResponse[] = categoriesDocs.map((cat) => {
      const obj = cat.toObject() as any;
      return {
        ...obj,
        _id: obj._id.toString(),
      };
    });

    // Update product counts (and sync DB if needed)
    await Promise.all(
      categoriesDocs.map(async (catDoc, i) => {
        const productCount = await Product.countDocuments({
          categories: catDoc.name,
          is_in_stock: true,
        });

        if (catDoc.product_count !== productCount) {
          catDoc.product_count = productCount;
          await catDoc.save();
        }

        categories[i].product_count = productCount;
      })
    );

    // Include sample products if requested
    if (includeProducts) {
      categories = await Promise.all(
        categories.map(async (category) => {
          const products = await Product.find({
            categories: category.name,
            is_in_stock: true,
          })
            .select('title base_price discounted_price images slug')
            .sort({ created_at: -1 })
            .limit(8)
            .lean();

          return {
            ...category,
            products,
          };
        })
      );
    }

    // Build hierarchical structure if requested
    if (hierarchical) {
      const buildHierarchy = (cats: CategoryResponse[], parentId: string | null = null): CategoryResponse[] => {
        return cats
          .filter((cat) => {
            const catParentId = (cat.parent_category as any)?._id?.toString() || null;
            return catParentId === parentId;
          })
          .map((cat) => ({
            ...cat,
            children: buildHierarchy(cats, cat._id.toString()),
          }));
      };

      const hierarchicalCategories = buildHierarchy(categories);

      return NextResponse.json({
        success: true,
        categories: hierarchicalCategories,
      });
    }

    // Default: return flat list
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
