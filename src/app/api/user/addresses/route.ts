import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import { authOptions } from "../../auth/[...nextauth]/option";
import { getServerSession } from "next-auth/next";

interface AddressInput {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country?: string;
  pincode: string;
  is_default?: boolean;
  label?: string;
}

// 🔹 Helper: get user either via JWT or NextAuth session
async function getAuthenticatedUser(request: NextRequest) {
  // NextAuth session
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    await dbConnect();
    return await User.findOne({ email: session.user.email }).select("-password");
  }

  // JWT fallback
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    await dbConnect();
    return await User.findById(decoded.userId).select("-password");
  } catch {
    return null;
  }
}

// 🔹 GET /api/user/addresses
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return NextResponse.json({ addresses: user.addresses || [] }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching addresses:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// 🔹 POST /api/user/addresses
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: AddressInput = await request.json();
    const {
      address_line1,
      address_line2 = "",
      city,
      state,
      country = "India",
      pincode,
      is_default = false,
      label = "Home",
    } = body;

    // Validate required fields
    if (!address_line1 || !city || !state || !country || !pincode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Unset previous default if needed
    if (is_default) {
      user.addresses.forEach((a) => (a.is_default = false));
    }

    // ✅ Push plain object; cast to 'any' to satisfy TypeScript
    user.addresses.push({
      address_line1,
      address_line2,
      city,
      state,
      country,
      pincode,
      is_default,
      label,
    } as any);

    await user.save();

    return NextResponse.json({ success: true, addresses: user.addresses }, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding address:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
