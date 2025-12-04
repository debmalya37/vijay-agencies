import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (q.length < 2) {
      return NextResponse.json({ success: true, products: [] });
    }

    const products = await Product.find(
      {
        title: { $regex: q, $options: "i" }, // title-based suggestion
        is_in_stock: true,
      },
      {
        title: 1,
        slug: 1,
        images: 1,
      }
    )
      .limit(8)
      .lean();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, message: "Search failed" },
      { status: 500 }
    );
  }
}
