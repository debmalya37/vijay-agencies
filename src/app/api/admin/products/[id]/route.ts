// src/app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    await dbConnect();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /api/admin/products/[id] error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
