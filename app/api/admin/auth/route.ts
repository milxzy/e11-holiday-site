import { NextRequest, NextResponse } from "next/server";

const validAdminUsers = [
  { username: "admin", password: "holiday2025!" },
  { username: "milx", password: "1" }
];

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    // Check against environment variables first (legacy support)
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check environment variables
    if (adminUsername && adminPassword && username === adminUsername && password === adminPassword) {
      return NextResponse.json({ 
        success: true, 
        token: "admin-authenticated",
        message: "Authentication successful",
        user: username
      });
    }

    // Check hardcoded admin users
    const validUser = validAdminUsers.find(user => 
      user.username === username && user.password === password
    );

    if (validUser) {
      return NextResponse.json({ 
        success: true, 
        token: "admin-authenticated",
        message: "Authentication successful",
        user: validUser.username
      });
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Authentication error" }, { status: 500 });
  }
}