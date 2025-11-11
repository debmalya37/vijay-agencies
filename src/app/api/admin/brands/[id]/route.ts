import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Brand } from "@/models/Brand";

export async function PUT(req: NextRequest, { params }: any) {
  await dbConnect();
  const form = await req.formData();

  const update: any = {
    name: form.get("name"),
    slug: form.get("slug"),
    description: form.get("description"),
    is_active: form.get("is_active") === "true",
    product_ids: form.getAll("product_ids[]").map(p => p.toString()),
  };

  // If logo changed
  const file = form.get("logo");
  if (file && typeof file === "object" && "arrayBuffer" in file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { v2: cloudinary } = await import("cloudinary");
    const url = await new Promise<string>((resolve) => {
      cloudinary.uploader.upload_stream({ folder: "brands" }, (err, res) => resolve(res?.secure_url || ""));
    });
    update.logo = url;
  }

  const brand = await Brand.findByIdAndUpdate(params.id, update, { new: true });
  return NextResponse.json({ success: true, brand });
}

export async function DELETE(req: NextRequest, { params }: any) {
  await dbConnect();
  await Brand.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
