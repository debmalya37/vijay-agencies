import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Brand } from "@/models/Brand";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Cloudinary helper
async function uploadToCloudinary(buffer: Buffer, folder = "brands"): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result?.secure_url || "");
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export async function GET() {
  await dbConnect();
  const brands = await Brand.find().populate("product_ids", "title images");
  return NextResponse.json(brands);
}

export async function POST(req: Request) {
  await dbConnect();

  const form = await req.formData();

  const name = form.get("name") as string;
  const slug = form.get("slug") as string;
  const description = form.get("description") as string;
  const is_active = form.get("is_active") === "true";

  const product_ids = form.getAll("product_ids[]").map(id => id.toString());

  // Upload logo if exists
  let logo = "";
  const file = form.get("logo");
  if (file && typeof file === "object" && "arrayBuffer" in file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    logo = await uploadToCloudinary(buffer, "brands");
  }

  const brand = await Brand.create({
    name,
    slug,
    description,
    is_active,
    product_ids,
    logo,
  });

  return NextResponse.json({ success: true, brand });
}
