// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { Brand } from "@/models/Brand";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const brandSlug = searchParams.get("brand");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const query: any = {};

    // ✅ Brand filter (brandSlug → brand -> product_ids)
    if (brandSlug) {
      const brand = await Brand.findOne({ slug: brandSlug });
      if (brand) {
        query._id = { $in: brand.product_ids };
      } else {
        return NextResponse.json([]); // no brand found
      }
    }

    // ✅ Category filter (if using product.categories array)
    if (category && category !== "All") {
      query.categories = category;
    }

    // ✅ Search filter
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query).lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

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
