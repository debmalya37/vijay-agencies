import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const productId = params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return new Response(JSON.stringify({ error: "Invalid product ID" }), { status: 400 });
    }

    const product = await Product.findById(productId).select("reviews");
    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ reviews: product.reviews }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const productId = params.id;
    const body = await req.json();
    const { rating, comment } = body;

    const session = await getServerSession(authOptions);
        
        if (!session || !session.user?.email) {
          return NextResponse.json(
            { error: 'Unauthorized', ok: false },
            { status: 401 }
          );
        }

    const user_id = session.user.id;


    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(user_id)) {
      return new Response(JSON.stringify({ error: "Invalid IDs" }), { status: 400 });
    }

    if (!rating || rating < 1 || rating > 5 || !comment?.trim()) {
      return new Response(JSON.stringify({ error: "Invalid review data" }), { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    const review = {
      user_id: new mongoose.Types.ObjectId(user_id),
      rating,
      comment,
      created_at: new Date(),
    };

    product.reviews = product.reviews || [];
    product.reviews.push(review as any);
    await product.save();

    return new Response(JSON.stringify({ review }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to add review" }), { status: 500 });
  }
}
