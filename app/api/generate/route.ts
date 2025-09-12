// next.js api route types for handling requests and responses
import { NextRequest, NextResponse } from "next/server";
// openai sdk for ai vision analysis
import OpenAI from "openai";
// google gemini sdk for ai image generation
import { GoogleGenerativeAI } from "@google/generative-ai";
// file system operations for reading uploaded images and saving results
import fs from "fs/promises";
// path utilities for file system navigation
import path from "path";
// database functions for user tracking and generation limits
import { 
  createUser, 
  createGeneration, 
  canCompanyGenerate, 
  getCompanyGenerationCount,
  getCompanyLimits 
} from "../../../lib/database";

// main api endpoint for generating custom greeting card images using ai
export async function POST(req: NextRequest) {
  try {
    // verify openai api key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not found");
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const requestData = await req.json();
    const { mode, client, userName, userEmail } = requestData;
    
    // ensure required parameters are provided
    if (!client || !mode || !userName || !userEmail) {
      return NextResponse.json({ error: "Missing required parameters: client, mode, userName, and userEmail are required" }, { status: 400 });
    }

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json({ error: "Invalid email address format" }, { status: 400 });
    }

    // check company generation limits
    if (!canCompanyGenerate(client)) {
      const limits = getCompanyLimits();
      const currentCount = getCompanyGenerationCount(client);
      const limit = limits[client.toLowerCase()] || 10;
      
      return NextResponse.json({ 
        error: `Generation limit reached. ${client} has used ${currentCount}/${limit} generations.`,
        limitReached: true,
        currentCount,
        limit
      }, { status: 429 });
    }

    // extract all possible parameters at the top level for accessibility
    const { staff, cardStyle, personDescription, accessory, pose, background, magicalEffect, imagePath, selectedHoliday, emailOptIn, greetingText } = requestData;

    let prompt = "";

    // attempt to fetch client-specific custom prompts from admin settings
    try {
      const customPromptRes = await fetch(`${req.nextUrl.origin}/api/admin/prompts?client=${client}`);
      if (customPromptRes.ok) {
        const customPromptData = await customPromptRes.json();
        if (customPromptData.prompt) {
          // apply custom prompt template with user selections
          const customBase = customPromptData.prompt.customPrompt;
          
          if (mode === 'staff') {
            if (!staff || !cardStyle) {
              return NextResponse.json({ error: "Missing staff or card style" }, { status: 400 });
            }
            
            prompt = `${customBase} The greeting card should be in ${cardStyle} style and feature ${staff} celebrating ${selectedHoliday}. Create a greeting card layout that is warm, inviting, and suitable for sharing with colleagues and friends. Include elegant ${selectedHoliday} themes, festive colors, and high-quality artistic details.`;
          } else if (mode === 'upload') {
            if (!personDescription || !cardStyle || !accessory || !pose || !background || !magicalEffect) {
              return NextResponse.json({ error: "Missing customization parameters" }, { status: 400 });
            }
            
            prompt = `${customBase} The greeting card should be in ${cardStyle} style featuring: ${personDescription}. The person is wearing ${accessory} and is ${pose}. The scene is set in ${background} with ${magicalEffect} around them celebrating ${selectedHoliday}. Make it warm, joyful, and celebratory with ${selectedHoliday} spirit. Make it perfect for sharing with peers.`;
          }
        }
      }
    } catch (error) {
      console.log('No custom prompt found, using default');
    }

    // use default prompt templates when no custom prompt is available
    if (!prompt) {
      if (mode === 'staff') {
        if (!staff || !cardStyle) {
          return NextResponse.json({ error: "Missing staff or card style" }, { status: 400 });
        }
        
        prompt = `A beautiful ${selectedHoliday} greeting card in ${cardStyle} style, professionally designed for ${client}. The card should feature ${staff} with elegant ${selectedHoliday} themes, festive colors, and high-quality artistic details. Create a greeting card layout that is warm, inviting, and suitable for sharing with colleagues and friends.`;
      } else if (mode === 'upload') {
        if (!personDescription || !cardStyle || !accessory || !pose || !background || !magicalEffect) {
          return NextResponse.json({ error: "Missing customization parameters" }, { status: 400 });
        }
        
        // check if we have an uploaded image path for inspiration
        if (imagePath) {
          prompt = `Create a beautiful ${selectedHoliday} greeting card in ${cardStyle} style inspired by the person in this reference photo. The card scene should show them wearing ${accessory} and ${pose}, set in ${background} with ${magicalEffect} around them celebrating ${selectedHoliday}. Transform the person from the reference image into a greeting card design that is warm, inviting, and suitable for sharing. Use elegant ${selectedHoliday} themes, festive colors, and professional quality. Make it magical and joyful with ${selectedHoliday} spirit.`;
        } else {
          prompt = `A beautiful ${selectedHoliday} greeting card in ${cardStyle} style featuring: ${personDescription}. The person is wearing ${accessory} and is ${pose}. The scene is set in ${background} with ${magicalEffect} around them celebrating ${selectedHoliday}. The card should have elegant ${selectedHoliday} themes, festive colors, vibrant details, and professional quality suitable for sharing. Make it warm, joyful, and celebratory with ${selectedHoliday} spirit.`;
        }
      } else {
        return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
      }
    }

    if (greetingText && typeof greetingText === 'string' && greetingText.trim()) {
      const safeText = greetingText.trim().replace(/"/g, '\\"');
      prompt += ` Include the text "${safeText}" on the card.`;
    }

    console.log("Generating image with prompt:", prompt);
    
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    let result;
    let enhancedPrompt = prompt;
    let imageBuffer;
    let mimeType;
    
    try {
      // determine if user uploaded an image for personalized inspiration
      
      if (mode === 'upload' && imagePath) {
        // load saved user image from file system
        const imageFilePath = path.join(process.cwd(), "public", imagePath);
        imageBuffer = await fs.readFile(imageFilePath);
        // determine correct mime type for the uploaded image
        mimeType = imagePath.includes('.png') ? 'image/png' : 
                   imagePath.includes('.jpg') || imagePath.includes('.jpeg') ? 'image/jpeg' : 
                   imagePath.includes('.webp') ? 'image/webp' :
                   'image/png';

        // skip vision analysis - let Gemini handle the image directly
        console.log("Skipping vision analysis, using image directly with Gemini");
      }

      // check if gemini api key is available
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
      }

      // use gpt-4 to enhance the prompt for gemini image generation
      console.log("Original prompt:", prompt);
      
      const promptEnhancement = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert at creating detailed, artistic prompts for Gemini image generation. Your job is to take a user's greeting card request and transform it into a highly detailed, professional prompt that will produce the best possible greeting card design. Focus on artistic style, composition, colors, and layout suitable for sharing."
          },
          {
            role: "user", 
            content: `Please enhance this greeting card generation prompt for Gemini to produce the highest quality card design:

"${prompt}"

Make the enhanced prompt more artistic, detailed, and specific about:
- Greeting card layout with clear message space
- Warm, inviting, and shareable design
- Professional holiday card composition
- Vibrant festive colors with seasonal palette
- High resolution artwork, crisp clean design
- Family-friendly and professional aesthetic
- Holiday-themed decorative elements
- Engaging visual composition perfect for sharing
- Clear focal point with balanced layout
- Celebratory and joyful atmosphere

CRITICAL: Add these exact terms to ensure greeting card result: "greeting card design, holiday card, festive layout, message space, shareable design, professional card"

Use detailed descriptive language optimized for Gemini image generation. Return only the enhanced prompt, nothing else.`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      enhancedPrompt = promptEnhancement.choices[0]?.message?.content || prompt;
      console.log("Enhanced prompt:", enhancedPrompt);

      // initialize gemini client
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image-preview" });
      
      // determine if we should use image-to-image or text-to-image
      const useImageToImage = mode === 'upload' && imagePath;
      
      if (useImageToImage) {
        // use gemini image-to-image for uploaded photos
        console.log("Using Gemini image-to-image generation");
        
        // convert image buffer to base64 for gemini
        const base64Image = imageBuffer!.toString('base64');
        
        // retry logic for rate limiting and server errors
        let response;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
          try {
            response = await model.generateContent([
              enhancedPrompt,
              {
                inlineData: {
                  data: base64Image,
                  mimeType: mimeType!
                }
              }
            ]);
            break; // success, exit retry loop
          } catch (error: any) {
            attempts++;
            const isRetryableError = error.message?.includes('429') || 
                                   error.message?.includes('500') || 
                                   error.message?.includes('Internal error');
            
            if (isRetryableError && attempts < maxAttempts) {
              const waitTime = Math.pow(2, attempts) * 1000; // exponential backoff: 2s, 4s, 8s
              console.log(`Retryable error (attempt ${attempts}/${maxAttempts}), waiting ${waitTime}ms...`);
              console.log(`Error details: ${error.message}`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
            throw error; // re-throw if not retryable or max attempts reached
          }
        }
        
        // extract the generated image from response
        const candidate = response.response.candidates?.[0];
        if (!candidate?.content?.parts) {
          throw new Error("No image generated by Gemini");
        }
        
        let generatedImageData: string | null = null;
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            generatedImageData = part.inlineData.data;
            break;
          }
        }
        
        if (!generatedImageData) {
          throw new Error("No image data found in Gemini response");
        }
        
        result = {
          data: [{
            b64_json: generatedImageData,
            revised_prompt: enhancedPrompt
          }]
        };
        
      } else {
        // use gemini text-to-image generation
        console.log("Using Gemini text-to-image generation");
        
        // retry logic for rate limiting and server errors
        let response;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
          try {
            response = await model.generateContent([enhancedPrompt]);
            break; // success, exit retry loop
          } catch (error: any) {
            attempts++;
            const isRetryableError = error.message?.includes('429') || 
                                   error.message?.includes('500') || 
                                   error.message?.includes('Internal error');
            
            if (isRetryableError && attempts < maxAttempts) {
              const waitTime = Math.pow(2, attempts) * 1000; // exponential backoff: 2s, 4s, 8s
              console.log(`Retryable error (attempt ${attempts}/${maxAttempts}), waiting ${waitTime}ms...`);
              console.log(`Error details: ${error.message}`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
            throw error; // re-throw if not retryable or max attempts reached
          }
        }
        
        // extract the generated image from response
        const candidate = response.response.candidates?.[0];
        if (!candidate?.content?.parts) {
          throw new Error("No image generated by Gemini");
        }
        
        let generatedImageData: string | null = null;
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            generatedImageData = part.inlineData.data;
            break;
          }
        }
        
        if (!generatedImageData) {
          throw new Error("No image data found in Gemini response");
        }
        
        result = {
          data: [{
            b64_json: generatedImageData,
            revised_prompt: enhancedPrompt
          }]
        };
      }
    } catch (geminiError: any) {
      console.error("Gemini generation failed:", geminiError.message);
      throw geminiError;
    }

    const imageBase64 = result.data?.[0]?.b64_json;
    if (!imageBase64) {
      console.error("No image data in response:", result);
      return NextResponse.json({ error: "No image generated by Gemini" }, { status: 500 });
    }

    // store generated greeting card image to public directory
    const buffer = Buffer.from(imageBase64, "base64");
    const filename = `greeting-card-${client.toLowerCase()}-${Date.now()}.png`;
    const filePath = path.join(process.cwd(), "public", "generated", filename);
    
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);
    
    console.log("Image saved successfully:", filename);

    // create/update user and track this generation
    try {
      const user = await createUser(userName.trim(), userEmail.trim(), client.toLowerCase());
      await createGeneration(
        user.id,
        client.toLowerCase(),
        mode,
        `/generated/${filename}`,
        result.data?.[0]?.revised_prompt || enhancedPrompt || prompt,
        {
          name: userName.trim(),
          email: userEmail.trim(),
          selectedHoliday: selectedHoliday || 'Christmas',
          emailOptIn: emailOptIn || false,
          greetingText: greetingText || ''
        }
      );
      console.log("Generation tracked for user:", user.id);
    } catch (dbError) {
      console.error("Error tracking generation:", dbError);
      // Don't fail the request if tracking fails
    }

    // create shareable URL for the greeting card
    const shareUrl = `${req.nextUrl.origin}/share/${filename.replace('.png', '')}`;
    
    return NextResponse.json({ 
      url: `/generated/${filename}`,
      enhancedPrompt: result.data?.[0]?.revised_prompt || enhancedPrompt || prompt,
      shareUrl: shareUrl
    });
  } catch (error: any) {
    console.error("Detailed error:", {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type
    });
    
    // provide detailed error responses based on gemini api errors
    if (error.message?.includes('API_KEY')) {
      return NextResponse.json({ error: "Invalid Gemini API key" }, { status: 500 });
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 500 });
    } else if (error.message?.includes('safety')) {
      return NextResponse.json({ error: "Content blocked by safety filters. Please try a different prompt." }, { status: 500 });
    } else if (error.message?.includes('500') || error.message?.includes('Internal error')) {
      return NextResponse.json({ 
        error: "Gemini service is temporarily unavailable. This appears to be a server issue on Google's side. Please try again in a few minutes.",
        retryable: true
      }, { status: 503 });
    } else {
      return NextResponse.json({ 
        error: `Gemini API error: ${error.message || 'Unknown error'}` 
      }, { status: 500 });
    }
  }
}
