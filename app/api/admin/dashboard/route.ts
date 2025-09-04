import { NextRequest, NextResponse } from "next/server";
import { 
  getAllStats, 
  getAllGenerations, 
  getAllUsers,
  getCompanyLimits 
} from "../../../../lib/database";

export async function GET(req: NextRequest) {
  try {
    // In a real app, you'd verify the admin token here
    const authHeader = req.headers.get('authorization');
    if (!authHeader || authHeader !== 'Bearer admin-authenticated') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyStats = getAllStats();
    const allGenerations = getAllGenerations();
    const allUsers = getAllUsers();
    const companyLimits = getCompanyLimits();

    // Calculate overall statistics
    const totalGenerations = allGenerations.length;
    const totalUsers = allUsers.length;
    const companiesWithActivity = companyStats.filter(c => c.totalGenerations > 0).length;
    
    // Recent activity (last 10 generations)
    const recentActivity = allGenerations.slice(0, 10);
    
    // Company breakdown
    const companyBreakdown = companyStats.map(stat => ({
      ...stat,
      utilizationRate: stat.limit > 0 ? (stat.totalGenerations / stat.limit * 100).toFixed(1) : '0'
    })).sort((a, b) => b.totalGenerations - a.totalGenerations);

    return NextResponse.json({
      overview: {
        totalGenerations,
        totalUsers,
        companiesWithActivity,
        totalCompanies: Object.keys(companyLimits).length
      },
      companyBreakdown,
      recentActivity,
      allGenerations: allGenerations.slice(0, 50), // Limit for performance
      allUsers: allUsers.slice(0, 100) // Limit for performance
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}