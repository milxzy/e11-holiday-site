import { NextRequest, NextResponse } from "next/server";

// Mock custom prompts data - in a real app this would be stored in a database
let customPrompts = [
  {
    id: '1',
    clientName: '4AS',
    customPrompt: 'A professional Christmas ornament featuring modern advertising agency aesthetics with clean lines, corporate colors, and creative flair. The ornament should embody innovation and creativity.',
    isActive: true,
    lastModified: '2024-12-10T10:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '2',
    clientName: 'Google',
    customPrompt: 'A tech-inspired Christmas ornament with Google brand colors (blue, red, yellow, green) and innovative design elements. Should feel modern, playful, and technological.',
    isActive: true,
    lastModified: '2024-12-08T15:30:00Z',
    createdBy: 'admin'
  }
];

// Get all custom prompts
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const clientName = url.searchParams.get('client');
    
    if (clientName) {
      // Get prompt for specific client
      const clientPrompt = customPrompts.find(p => 
        p.clientName.toLowerCase() === clientName.toLowerCase() && p.isActive
      );
      
      return NextResponse.json({ 
        prompt: clientPrompt || null 
      });
    }
    
    // Get all prompts
    return NextResponse.json({ 
      prompts: customPrompts.sort((a, b) => 
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      )
    });
  } catch (error) {
    console.error('Error fetching custom prompts:', error);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }
}

// Create or update custom prompt
export async function POST(req: NextRequest) {
  try {
    const { clientName, customPrompt, isActive = true } = await req.json();
    
    if (!clientName || !customPrompt) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }
    
    // Check if prompt already exists for this client
    const existingIndex = customPrompts.findIndex(p => 
      p.clientName.toLowerCase() === clientName.toLowerCase()
    );
    
    const promptData = {
      id: existingIndex >= 0 ? customPrompts[existingIndex].id : Date.now().toString(),
      clientName,
      customPrompt,
      isActive,
      lastModified: new Date().toISOString(),
      createdBy: 'admin'
    };
    
    if (existingIndex >= 0) {
      // Update existing prompt
      customPrompts[existingIndex] = promptData;
    } else {
      // Add new prompt
      customPrompts.push(promptData);
    }
    
    console.log(`Custom prompt ${existingIndex >= 0 ? 'updated' : 'created'} for ${clientName}`);
    
    return NextResponse.json({ 
      success: true, 
      prompt: promptData,
      message: `Custom prompt ${existingIndex >= 0 ? 'updated' : 'created'} for ${clientName}`
    });
  } catch (error) {
    console.error('Error saving custom prompt:', error);
    return NextResponse.json({ error: "Failed to save prompt" }, { status: 500 });
  }
}

// Delete custom prompt
export async function DELETE(req: NextRequest) {
  try {
    const { clientName } = await req.json();
    
    if (!clientName) {
      return NextResponse.json({ error: "Missing client name" }, { status: 400 });
    }
    
    const initialLength = customPrompts.length;
    customPrompts = customPrompts.filter(p => 
      p.clientName.toLowerCase() !== clientName.toLowerCase()
    );
    
    if (customPrompts.length === initialLength) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }
    
    console.log(`Custom prompt deleted for ${clientName}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Custom prompt deleted for ${clientName}` 
    });
  } catch (error) {
    console.error('Error deleting custom prompt:', error);
    return NextResponse.json({ error: "Failed to delete prompt" }, { status: 500 });
  }
}