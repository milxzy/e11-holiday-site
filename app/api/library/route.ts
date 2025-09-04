import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const generatedDir = path.join(process.cwd(), "public", "generated");
    
    // Ensure directory exists
    try {
      await fs.access(generatedDir);
    } catch {
      await fs.mkdir(generatedDir, { recursive: true });
      return NextResponse.json({ images: [] });
    }

    const files = await fs.readdir(generatedDir);
    const imageFiles = files.filter(file => 
      file.toLowerCase().endsWith('.png') || 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg')
    );

    // Get file stats to sort by creation time
    const imagesWithStats = await Promise.all(
      imageFiles.map(async (file) => {
        const filePath = path.join(generatedDir, file);
        const stats = await fs.stat(filePath);
        const [client, timestamp] = file.replace('.png', '').split('-');
        
        return {
          filename: file,
          url: `/generated/${file}`,
          client: client || 'unknown',
          createdAt: stats.birthtime,
          timestamp: parseInt(timestamp) || 0
        };
      })
    );

    // Sort by creation time, newest first
    imagesWithStats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ images: imagesWithStats });
  } catch (error) {
    console.error('Error fetching image library:', error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}