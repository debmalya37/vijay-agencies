// File: src/app/api/categories/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const hierarchical = searchParams.get("hierarchical") === "true";
    const includeProducts = searchParams.get("include_products") === "true";
    const parentId = searchParams.get("parent_id");

    /* ---------------- QUERY ---------------- */
    const query: any = { is_active: true };

    if (parentId !== null && parentId !== undefined) {
      query.parent_category = parentId === "null" ? null : parentId;
    }

    /* ---------------- FETCH CATEGORIES (LEAN = FAST) ---------------- */
    const categories = await Category.find(query)
      .select("name slug parent_category image_url sort_order product_count")
      .sort({ sort_order: 1, name: 1 })
      .lean();

    /* ---------------- OPTIONAL: AGGREGATED PRODUCT COUNTS ---------------- */
    // ⚡ ONE query instead of N queries
    const counts = await Product.aggregate([
      { $match: { is_in_stock: true } },
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map<string, number>();
    counts.forEach(c => countMap.set(c._id, c.count));

    const enriched = categories.map(cat => ({
      ...cat,
      _id: cat._id.toString(),
      product_count: countMap.get(cat.name) || 0,
    }));

    /* ---------------- OPTIONAL: SAMPLE PRODUCTS (1 QUERY PER ALL CATS) ---------------- */
    let categoryProductsMap = new Map<string, any[]>();

    if (includeProducts) {
      const allNames = enriched.map(c => c.name);

      const sampleProducts = await Product.aggregate([
        { $match: { is_in_stock: true, categories: { $in: allNames } } },
        { $sort: { created_at: -1 } },
        {
          $project: {
            title: 1,
            slug: 1,
            base_price: 1,
            discounted_price: 1,
            images: 1,
            categories: 1,
          },
        },
      ]);

      // group by category name
      sampleProducts.forEach(p => {
        p.categories.forEach((c: string) => {
          if (!categoryProductsMap.has(c)) categoryProductsMap.set(c, []);
          if (categoryProductsMap.get(c)!.length < 8) {
            categoryProductsMap.get(c)!.push(p);
          }
        });
      });
    }

    /* ---------------- HIERARCHY BUILD (O(n)) ---------------- */
    if (hierarchical) {
      const map = new Map<string, any[]>();

      enriched.forEach(cat => {
        const pid = cat.parent_category?.toString() || "root";
        if (!map.has(pid)) map.set(pid, []);
        map.get(pid)!.push(cat);
      });

      const build = (pid: string | null): any[] => {
        const key = pid || "root";
        return (map.get(key) || []).map(cat => ({
          ...cat,
          products: includeProducts ? categoryProductsMap.get(cat.name) || [] : undefined,
          children: build(cat._id.toString()),
        }));
      };

      return NextResponse.json({
        success: true,
        categories: build(null),
      });
    }

    /* ---------------- FLAT RESPONSE ---------------- */
    const flat = enriched.map(cat => ({
      ...cat,
      products: includeProducts ? categoryProductsMap.get(cat.name) || [] : undefined,
    }));

    return NextResponse.json({
      success: true,
      categories: flat,
    });

  } catch (error) {
    console.error("Category API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
