import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import mongoose from "mongoose";
import { User } from "@/models/User"; // adjust path

// OPTIONAL: import related models
import { Cart } from "@/models/Cart";
import { Wishlist } from "@/models/Wishlist";
import { Order } from "@/models/Order";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    const userId = user._id;

    //  DELETE RELATED DATA (IMPORTANT FOR GDPR / PLAY POLICY)

    // await Cart.deleteOne({ _id: user.cart_id });
    // await Wishlist.deleteOne({ _id: user.wishlist_id });
    await Order.deleteMany({ userId });

    // If purchase history must be retained legally → anonymize instead

    // 🔥 DELETE USER
    await User.deleteOne({ _id: userId });

    return NextResponse.json({
      ok: true,
      message: "Account deleted successfully",
    });

  } catch (error) {
    console.error("Delete Account Error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}