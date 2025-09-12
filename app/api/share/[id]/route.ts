import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { getGenerationByImagePath } from "../../../../lib/database";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    
    // construct the image path
    const imagePath = path.join(process.cwd(), "public", "generated", `${id}.png`);
    
    // check if the file exists
    try {
      await fs.access(imagePath);
    } catch {
      return NextResponse.json({ error: "Greeting card not found" }, { status: 404 });
    }
    
    // get generation data with overlay information
    const imageUrl = `/generated/${id}.png`;
    const generation = await getGenerationByImagePath(imageUrl);
    
    // return metadata about the greeting card including overlay data
    return NextResponse.json({
      imageUrl: imageUrl,
      title: "Check out this holiday greeting card!",
      description: "A personalized holiday greeting card created with AI",
      overlayData: generation?.userDetails?.overlayData || null
    });
    
  } catch (error) {
    console.error("Error sharing greeting card:", error);
    return NextResponse.json({ error: "Failed to load greeting card" }, { status: 500 });
  }
}