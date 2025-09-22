import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    await dbConnect();
    const featuredProducts = await Product.find({ is_featured: true }).limit(10);
    return NextResponse.json(featuredProducts);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json({ message: "Error fetching featured products" }, { status: 500 });
  }
}
