import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { User, IUser } from "@/models/User";
import { generateToken } from "@/lib/auth";
import rateLimit from "@/lib/rateLimit";

// ✅ Consistent response helper
function jsonResponse(success: boolean, message: string, data: any = null, status = 200) {
  return NextResponse.json({ success, message, data }, { status });
}

export async function POST(req: Request) {
  try {
    // ✅ Rate limiting to prevent brute-force
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const allowed = await rateLimit(ip, 5, 60);
    if (!allowed) {
      return jsonResponse(false, "Too many login attempts. Try again later.", null, 429);
    }

    await dbConnect();

    const { email, password } = await req.json();

    // ✅ Input validation
    if (!email || !password) {
      return jsonResponse(false, "Email and password are required", null, 400);
    }

    // ✅ Fetch user and explicitly include password
    const user = await User.findOne({ email }).select("+password").lean<IUser & { _id: string } | null>();

    if (!user || !user.password) {
      return jsonResponse(false, "Invalid credentials", null, 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return jsonResponse(false, "Invalid credentials", null, 401);
    }

    // ✅ Generate JWT token
    const token = generateToken(user._id.toString());

    // ✅ Return minimal, safe user data
    const userResponse = {
      id: user._id,
      name: user.full_name || user.username,
      email: user.email,
      role: user.role,
    };

    return jsonResponse(true, "Login successful", { token, user: userResponse }, 200);
  } catch (err: any) {
    console.error("❌ Login API Error:", err.message || err);
    return jsonResponse(false, "Internal server error", null, 500);
  }
}
