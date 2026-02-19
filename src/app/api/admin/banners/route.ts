// File: src/app/api/admin/banners/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Banner } from '@/models/Banner';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// 🔹 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Helper function to upload buffer to Cloudinary
async function uploadToCloudinary(buffer: Buffer, folder = 'banners'): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result?.secure_url || '');
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export async function GET() {
  try {
    await dbConnect();
    const banners = await Banner.find().sort({ priority: -1, created_at: -1 });
    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ success: false, error: 'Image file is required' }, { status: 400 });
    }

    // ... (Image validation code remains the same)

    // ✅ Convert to Buffer & Upload (code remains the same)
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageUrl = await uploadToCloudinary(buffer, 'banners');

    // ✅ Create banner data with NEW fields
    const bannerData = {
      title: formData.get('title') as string || '',
      description: formData.get('description') as string || '',
      button_text: formData.get('button_text') as string || 'Shop Now',
      bg_color: formData.get('bg_color') as string || '#EF4F5F',
      image_position: formData.get('image_position') as string || 'right',
      image_url: imageUrl,
      link_url: formData.get('link_url') as string || undefined,
    };

    const banner = new Banner(bannerData);
    await banner.save();

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ success: false, error: 'Failed to create banner' }, { status: 500 });
  }
}
