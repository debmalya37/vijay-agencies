// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const params = req.nextUrl.searchParams;
    const brandSlug = params.get("brand");
    const categoryParam = params.get("category");
    const search = params.get("search");

    const query: any = {};

    /* ================= BRAND FILTER ================= */
if (brandSlug) {


  const directCount = await Product.countDocuments({
    brand_slug: brandSlug
  });

  if (directCount > 0) {
    query.brand_slug = brandSlug;
  } else {

    //  FALLBACK to old relation logic
    const { Brand } = await import("@/models/Brand");

    const brandDoc = await Brand.findOne({ slug: brandSlug })
      .select("product_ids")
      .lean();

    if (brandDoc?.product_ids?.length) {
      query._id = { $in: brandDoc.product_ids };
    } else {
      return NextResponse.json([]);
    }
  }
}


    /* ================= CATEGORY FILTER ================= */
    if (categoryParam && categoryParam !== "All") {

      const decoded = decodeURIComponent(categoryParam);

      // Try find by slug OR name
      const categoryDoc =
        await Category.findOne({ slug: decoded }).lean() ||
        await Category.findOne({ name: decoded }).lean();

      if (categoryDoc) {

        // 🔥 ULTRA FAST: one query to get parent + children
        const relatedCategories = await Category.find({
          $or: [
            { _id: categoryDoc._id },
            { parent_category: categoryDoc._id }
          ]
        }).select("name").lean();

        const names = relatedCategories.map(c => c.name);

        // Match any of them
        query.categories = { $in: names };

      } else {
        // fallback direct match if category not in DB
        query.categories = decoded;
      }
    }

    /* ================= TEXT SEARCH ================= */
    if (search) {
      query.$text = { $search: search };
    }

    /* ================= FETCH PRODUCTS ================= */
    const products = await Product.find(query)
      .select(`
        title
        slug
        base_price
        original_price
        discounted_price
        images
        categories
        is_in_stock
        stocks
        min_order_quantity
        reviews
        created_at
      `)
      .lean();

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });

  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/* ================= CREATE PRODUCT ================= */
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const product = await Product.create(data);
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
