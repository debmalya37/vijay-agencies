// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(buffer: Buffer, folder = "products"): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result?.secure_url || "");
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

function isFileLike(v: unknown): v is { arrayBuffer: () => Promise<ArrayBuffer>; name?: string } {
  return !!v && typeof v === "object" && typeof (v as any).arrayBuffer === "function";
}

// ---------------- GET ----------------
export async function GET() {
  await dbConnect();
  try {
    const products = await Product.find().lean();
    return NextResponse.json(products);
  } catch (err) {
    console.error("GET /api/admin/products error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ---------------- POST ----------------
export async function POST(request: Request) {
  try {
    await dbConnect();
    const formData = await request.formData();

    const title = String(formData.get("title") ?? "");
    const slug = String(formData.get("slug") ?? "");
    const description = String(formData.get("description") ?? "");
    const base_price = Number(formData.get("base_price") ?? 0);
    const discounted_price = formData.get("discounted_price")
      ? Number(formData.get("discounted_price"))
      : undefined;
    const is_in_stock =
      formData.get("is_in_stock") === "true" || formData.get("is_in_stock") === "on";
    const is_featured =
      formData.get("is_featured") === "true" || formData.get("is_featured") === "on";
    const min_order_quantity = Number(formData.get("min_order_quantity") ?? 1);
    const seller_id = formData.get("seller_id")
      ? new mongoose.Types.ObjectId(String(formData.get("seller_id")))
      : undefined;
    const meta_title = formData.get("meta_title") ? String(formData.get("meta_title")) : undefined;
    const meta_description = formData.get("meta_description")
      ? String(formData.get("meta_description"))
      : undefined;

    // categories & tags
    const categories = formData.getAll("categories[]").map(v => String(v)).filter(Boolean);
    const category_ids = formData
      .getAll("category_ids[]")
      .map(v => new mongoose.Types.ObjectId(String(v)))
      .filter(Boolean);
    const tags = formData.getAll("tags[]").map(v => String(v)).filter(Boolean);

    // Product images
    const imagesEntries = formData.getAll("images[]");
    const images: string[] = [];
    for (const entry of imagesEntries) {
      if (isFileLike(entry)) {
        const buffer = Buffer.from(await entry.arrayBuffer());
        const url = await uploadToCloudinary(buffer, "products");
        images.push(url);
      } else {
        const s = String(entry).trim();
        if (s) images.push(s);
      }
    }

    // Variants
    const variantsRaw = formData.get("variants") as string | null;
    let variants: any[] = [];
    if (variantsRaw) {
      try {
        variants = JSON.parse(variantsRaw);
      } catch (e) {
        console.warn("Invalid variants JSON", e);
        variants = [];
      }
    }

    for (let i = 0; i < variants.length; i++) {
      const uploadedVariantImages: string[] = [];
      const files = formData.getAll(`variantImages-${i}`);
      for (const f of files) {
        if (isFileLike(f)) {
          const buffer = Buffer.from(await f.arrayBuffer());
          const url = await uploadToCloudinary(buffer, `products/variants`);
          uploadedVariantImages.push(url);
        } else {
          const s = String(f).trim();
          if (s) uploadedVariantImages.push(s);
        }
      }
      variants[i] = {
        label: variants[i].label,
        unit: variants[i].unit,
        value: Number(variants[i].value),
        price: Number(variants[i].price),
        discounted_price: variants[i].discounted_price
          ? Number(variants[i].discounted_price)
          : undefined,
        stock: Number(variants[i].stock ?? 0),
        images: [...(variants[i].images || []).filter(Boolean), ...uploadedVariantImages],
      };
    }

    const productData: any = {
      title,
      slug:
        slug ||
        title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim(),
      description,
      base_price,
      discounted_price,
      variants,
      is_in_stock,
      images,
      categories,
      category_ids,
      tags,
      seller_id,
      min_order_quantity,
      meta_title,
      meta_description,
      is_featured,
    };

    const created = await Product.create(productData);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/products error:", err);
    return NextResponse.json({ error: "Failed to create product", details: String(err) }, { status: 500 });
  }
}

// ---------------- PATCH ----------------
export async function PATCH(req: NextRequest) {
  await dbConnect();
  const { id, update } = await req.json();
  const updated = await Product.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json(updated);
}
