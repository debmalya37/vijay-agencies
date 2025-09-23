// File: app/api/banners/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Banner } from '@/models/Banner';
import dbConnect from '@/lib/dbConnect';
import { unlink } from 'fs/promises';
import path from 'path';

// DELETE - Delete banner by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const bannerId = params.id;
    
    // Find the banner first to get image path
    const banner = await Banner.findById(bannerId);
    
    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      );
    }
    
    // Delete the image file if it exists
    try {
      if (banner.image_url && banner.image_url.startsWith('/uploads/banners/')) {
        const imagePath = path.join(process.cwd(), 'public', banner.image_url);
        await unlink(imagePath);
      }
    } catch (fileError) {
      console.log('Could not delete image file:', fileError);
      // Continue with database deletion even if file deletion fails
    }
    
    // Delete the banner from database
    await Banner.findByIdAndDelete(bannerId);
    
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