// File: src/app/api/admin/banners/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Banner } from '@/models/Banner';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

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

    // Validate image file
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum 5MB allowed.' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'banners');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Generate unique filename
    const fileExtension = image.name.split('.').pop();
    const filename = `${uuidv4()}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    // Convert File to Buffer and save
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Create banner data
    const bannerData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      image_url: `/uploads/banners/${filename}`,
      link_url: formData.get('link_url') as string || undefined,
      position: formData.get('position') as string,
      priority: parseInt(formData.get('priority') as string) || 0,
      is_active: formData.get('is_active') === 'true',
      start_date: formData.get('start_date') ? new Date(formData.get('start_date') as string) : undefined,
      end_date: formData.get('end_date') ? new Date(formData.get('end_date') as string) : undefined,
      target_audience: formData.get('target_audience') as string,
      device_targeting: formData.get('device_targeting') as string,
    };

    // Validate required fields
    if (!bannerData.title || !bannerData.position) {
      return NextResponse.json(
        { success: false, error: 'Title and position are required' },
        { status: 400 }
      );
    }

    // Validate dates if provided
    if (bannerData.start_date && bannerData.end_date && bannerData.end_date <= bannerData.start_date) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      );
    }

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