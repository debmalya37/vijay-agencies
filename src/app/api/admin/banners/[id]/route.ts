// File: src/app/api/admin/banners/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Banner } from '@/models/Banner';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const banner = await Banner.findById(params.id);
    
    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banner' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const existingBanner = await Banner.findById(params.id);
    if (!existingBanner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const image = formData.get('image') as File | null;
    
    let imageUrl = existingBanner.image_url;

    // Handle image upload if new image is provided
    if (image && image.size > 0) {
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

      // Delete old image file if it exists
      if (existingBanner.image_url.startsWith('/uploads/banners/')) {
        const oldFilepath = join(process.cwd(), 'public', existingBanner.image_url);
        try {
          await unlink(oldFilepath);
        } catch (error) {
          // File might not exist, ignore error
          console.log('Could not delete old image file:', error);
        }
      }

      imageUrl = `/uploads/banners/${filename}`;
    }

    // Update banner data
    const bannerData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      image_url: imageUrl,
      link_url: formData.get('link_url') as string || undefined,
      position: formData.get('position') as string,
      priority: parseInt(formData.get('priority') as string) || 0,
      is_active: formData.get('is_active') === 'true',
      start_date: formData.get('start_date') ? new Date(formData.get('start_date') as string) : undefined,
      end_date: formData.get('end_date') ? new Date(formData.get('end_date') as string) : undefined,
      target_audience: formData.get('target_audience') as string,
      device_targeting: formData.get('device_targeting') as string,
      updated_at: new Date(),
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

    const banner = await Banner.findByIdAndUpdate(
      params.id,
      bannerData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const banner = await Banner.findById(params.id);
    
    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      );
    }

    // Delete image file if it exists in uploads folder
    if (banner.image_url.startsWith('/uploads/banners/')) {
      const filepath = join(process.cwd(), 'public', banner.image_url);
      try {
        await unlink(filepath);
      } catch (error) {
        // File might not exist, ignore error
        console.log('Could not delete image file:', error);
      }
    }

    await Banner.findByIdAndDelete(params.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Banner deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}