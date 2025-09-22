// File: src/app/api/categories/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get('include_products') === 'true';
    const productLimit = parseInt(searchParams.get('product_limit') || '20');
    const productPage = parseInt(searchParams.get('product_page') || '1');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') === 'asc' ? 1 : -1;
    const minPrice = parseFloat(searchParams.get('min_price') || '0');
    const maxPrice = parseFloat(searchParams.get('max_price') || '0');
    
    const category = await Category.findOne({ 
      slug: params.slug, 
      is_active: true 
    })
    .populate('parent_category', 'name slug')
    .populate('subcategories', 'name slug image_url is_active');
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    let result: any = {
      success: true,
      category: category.toObject()
    };

    if (includeProducts) {
      // Build product query
      const productQuery: any = {
        categories: category.name,
        is_in_stock: true
      };

      // Add price filters
      if (minPrice > 0 || maxPrice > 0) {
        productQuery.$and = [];
        
        if (minPrice > 0) {
          productQuery.$and.push({
            $or: [
              { discounted_price: { $gte: minPrice } },
              { $and: [{ discounted_price: { $exists: false } }, { original_price: { $gte: minPrice } }] }
            ]
          });
        }
        
        if (maxPrice > 0) {
          productQuery.$and.push({
            $or: [
              { discounted_price: { $lte: maxPrice } },
              { $and: [{ discounted_price: { $exists: false } }, { original_price: { $lte: maxPrice } }] }
            ]
          });
        }
      }

      // Get products with pagination
      const skip = (productPage - 1) * productLimit;
      
      const products = await Product.find(productQuery)
        .select('title description original_price discounted_price images slug reviews categories')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(productLimit)
        .populate('reviews', 'rating');

      const totalProducts = await Product.countDocuments(productQuery);
      
      // Calculate average ratings
      const productsWithRatings = products.map(product => {
        const reviews = product.reviews || [];
        const avgRating = reviews.length > 0 
          ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
          : 0;
        
        return {
          ...product.toObject(),
          average_rating: Math.round(avgRating * 10) / 10,
          review_count: reviews.length
        };
      });

      result.products = productsWithRatings;
      result.pagination = {
        current_page: productPage,
        total_pages: Math.ceil(totalProducts / productLimit),
        total_products: totalProducts,
        per_page: productLimit
      };

      // Get price range for filters
      const priceStats = await Product.aggregate([
        { $match: { categories: category.name, is_in_stock: true } },
        {
          $group: {
            _id: null,
            minPrice: { 
              $min: { 
                $ifNull: ['$discounted_price', '$original_price'] 
              }
            },
            maxPrice: { 
              $max: { 
                $ifNull: ['$discounted_price', '$original_price'] 
              }
            }
          }
        }
      ]);

      if (priceStats.length > 0) {
        result.price_range = {
          min: priceStats[0].minPrice,
          max: priceStats[0].maxPrice
        };
      }
    }

    // Update product count if different
    const actualProductCount = await Product.countDocuments({
      categories: category.name,
      is_in_stock: true
    });
    
    if (category.product_count !== actualProductCount) {
      category.product_count = actualProductCount;
      await category.save();
      result.category.product_count = actualProductCount;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}