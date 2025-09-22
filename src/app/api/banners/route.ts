// File: app/api/banners/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Banner } from '@/models/Banner';
import dbConnect from '@/lib/dbConnect';
import { writeFile } from 'fs/promises';
import path from 'path';

// GET - Fetch all banners
export async function GET() {
  try {
    await dbConnect();
    
    const banners = await Banner.find({})
      .sort({ created_at: -1 });
    
    return NextResponse.json({
      success: true,
      banners: banners
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST - Create new banner
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const link_url = formData.get('link_url') as string;
    const image = formData.get('image') as File;
    
    if (!title || !image) {
      return NextResponse.json(
        { success: false, error: 'Title and image are required' },
        { status: 400 }
      );
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const originalName = image.name.replace(/\s+/g, '-');
    const filename = `banner_${timestamp}_${originalName}`;
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'banners');
    
    // Save file
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);
    
    // Create banner record
    const image_url = `/uploads/banners/${filename}`;
    const banner = new Banner({
      title,
      image_url,
      link_url: link_url || undefined
    });
    
    await banner.save();
    
    return NextResponse.json({
      success: true,
      banner: banner
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}