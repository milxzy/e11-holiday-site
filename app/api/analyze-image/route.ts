// next.js api route types for request/response handling
import { NextRequest, NextResponse } from "next/server";
// file system operations for saving uploaded images
import fs from "fs/promises";
// path utilities for file system navigation
import path from "path";

// api endpoint to handle image uploads and save them for ornament inspiration
export async function POST(req: NextRequest) {
  try {
    // extract uploaded image file from form data
    const formData = await req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Please upload JPG, PNG, or WebP images." }, { status: 400 });
    }

    // limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Please upload images smaller than 10MB." }, { status: 400 });
    }

    // convert file to buffer for file system storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // generate unique filename with timestamp to avoid conflicts
    const filename = `upload-${Date.now()}.${file.name.split('.').pop()}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadsDir, filename);
    
    // create uploads directory if it doesn't exist
    await fs.mkdir(uploadsDir, { recursive: true });
    
    // write image buffer to file system
    await fs.writeFile(filePath, buffer);
    
    console.log("Image saved for inspiration:", filename);

    // send back file path for ai processing and placeholder description
    return NextResponse.json({ 
      imagePath: `/uploads/${filename}`,
      description: "person from uploaded photo"
    });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json({ 
      error: `Image upload failed: ${error.message || 'Unknown error'}` 
    }, { status: 500 });
  }
}