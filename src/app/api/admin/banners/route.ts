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
      return NextResponse.json(
        { success: false, error: 'Image file is required' },
        { status: 400 }
      );
    }

    // ✅ Validate image type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // ✅ Validate file size (max 5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum 5MB allowed.' },
        { status: 400 }
      );
    }

    // ✅ Convert to Buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(buffer, 'banners');

    // ✅ Create banner data
    const bannerData = {
      image_url: imageUrl, // Cloudinary secure URL
      link_url: formData.get('link_url') as string || undefined,
    };

    // // ✅ Validate required fields
    // if (!bannerData.title || !bannerData.position) {
    //   return NextResponse.json(
    //     { success: false, error: 'Title and position are required' },
    //     { status: 400 }
    //   );
    // }

    // // ✅ Validate date range
    // if (
    //   bannerData.start_date &&
    //   bannerData.end_date &&
    //   bannerData.end_date <= bannerData.start_date
    // ) {
    //   return NextResponse.json(
    //     { success: false, error: 'End date must be after start date' },
    //     { status: 400 }
    //   );
    // }

    const banner = new Banner(bannerData);
    await banner.save();

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}
