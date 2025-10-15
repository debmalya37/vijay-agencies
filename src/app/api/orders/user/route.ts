import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { Product } from "@/models/Product";


export async function GET() {
  try {

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    
        await User.init(); // ensure indexes
        await Product.init(); // ensure indexes
        await Order.init(); // ensure indexes

    const orders = await Order.find({ userId: session.user.id })
    .populate({
        path: "items.productId",
        select: "name images slug",
        options: {
            strictPopulate: false
        },
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({orders}, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went Error' }, { status: 500 });
  }
}