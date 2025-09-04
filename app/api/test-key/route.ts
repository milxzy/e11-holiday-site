import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: "No API key found", 
        hasKey: false 
      }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Test with a simple completion request (cheaper than image generation)
    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Updated to current model
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5
    });

    return NextResponse.json({ 
      success: true, 
      hasKey: true,
      keyPrefix: process.env.OPENAI_API_KEY.substring(0, 20) + "..."
    });
  } catch (error: any) {
    console.error("API Key test error:", error);
    return NextResponse.json({ 
      error: error.message || "Unknown error",
      status: error.status || "no status",
      hasKey: !!process.env.OPENAI_API_KEY,
      keyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 20) + "..." : "none"
    }, { status: 500 });
  }
}