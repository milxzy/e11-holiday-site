import { NextRequest, NextResponse } from "next/server";

// Mock client activity data
const mockClientActivity = [
  { 
    clientName: '4AS', 
    lastVisit: '2024-12-15T10:30:00Z', 
    ornamentsCreated: 5, 
    promptsGenerated: 12, 
    mode: 'both', 
    status: 'active',
    firstVisit: '2024-12-01T09:00:00Z',
    totalSessions: 8
  },
  { 
    clientName: 'ACME', 
    lastVisit: '2024-12-14T14:15:00Z', 
    ornamentsCreated: 3, 
    promptsGenerated: 8, 
    mode: 'staff', 
    status: 'active',
    firstVisit: '2024-12-02T11:20:00Z',
    totalSessions: 5
  },
  { 
    clientName: 'Microsoft', 
    lastVisit: '2024-12-13T16:45:00Z', 
    ornamentsCreated: 0, 
    promptsGenerated: 2, 
    mode: 'upload', 
    status: 'inactive',
    firstVisit: '2024-12-13T16:45:00Z',
    totalSessions: 1
  },
  { 
    clientName: 'Google', 
    lastVisit: '2024-12-12T08:20:00Z', 
    ornamentsCreated: 7, 
    promptsGenerated: 15, 
    mode: 'both', 
    status: 'active',
    firstVisit: '2024-11-28T10:00:00Z',
    totalSessions: 12
  },
  { 
    clientName: 'Apple', 
    lastVisit: '2024-12-10T13:30:00Z', 
    ornamentsCreated: 2, 
    promptsGenerated: 6, 
    mode: 'staff', 
    status: 'active',
    firstVisit: '2024-12-05T15:10:00Z',
    totalSessions: 4
  },
  { 
    clientName: 'Harvard', 
    lastVisit: '2024-12-08T17:00:00Z', 
    ornamentsCreated: 0, 
    promptsGenerated: 1, 
    mode: 'upload', 
    status: 'inactive',
    firstVisit: '2024-12-08T17:00:00Z',
    totalSessions: 1
  },
  { 
    clientName: 'Stanford', 
    lastVisit: '2024-12-07T12:15:00Z', 
    ornamentsCreated: 4, 
    promptsGenerated: 9, 
    mode: 'both', 
    status: 'active',
    firstVisit: '2024-12-03T09:30:00Z',
    totalSessions: 6
  },
  { 
    clientName: 'RedCross', 
    lastVisit: '2024-12-05T11:45:00Z', 
    ornamentsCreated: 1, 
    promptsGenerated: 3, 
    mode: 'staff', 
    status: 'active',
    firstVisit: '2024-12-05T10:00:00Z',
    totalSessions: 2
  }
];

export async function GET(req: NextRequest) {
  try {
    // In a real app, this would fetch from a database
    const clientData = mockClientActivity;
    
    // Calculate summary statistics
    const totalClients = clientData.length;
    const activeClients = clientData.filter(c => c.status === 'active').length;
    const totalOrnaments = clientData.reduce((sum, c) => sum + c.ornamentsCreated, 0);
    const totalPrompts = clientData.reduce((sum, c) => sum + c.promptsGenerated, 0);
    
    // Sort by last visit (most recent first)
    clientData.sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());
    
    return NextResponse.json({
      clients: clientData,
      summary: {
        totalClients,
        activeClients,
        totalOrnaments,
        totalPrompts,
        conversionRate: totalClients > 0 ? ((activeClients / totalClients) * 100).toFixed(1) : '0'
      }
    });
  } catch (error) {
    console.error('Error fetching client data:', error);
    return NextResponse.json({ error: "Failed to fetch client data" }, { status: 500 });
  }
}

// Track client activity (called when clients visit their pages)
export async function POST(req: NextRequest) {
  try {
    const { clientName, action, metadata } = await req.json();
    
    if (!clientName || !action) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }
    
    // In a real app, this would save to a database
    console.log(`Client Activity: ${clientName} performed ${action}`, metadata);
    
    // For demo purposes, just return success
    return NextResponse.json({ 
      success: true, 
      message: `Tracked ${action} for ${clientName}` 
    });
  } catch (error) {
    console.error('Error tracking client activity:', error);
    return NextResponse.json({ error: "Failed to track activity" }, { status: 500 });
  }
}