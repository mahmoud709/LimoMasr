import { NextResponse } from "next/server";
import { getReviews, addReview } from "@/lib/data";
import type { Review } from "@/lib/types";
// Removed uuid dependency to avoid missing package errors

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const reviews = await getReviews(!all);
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.text || !body.rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review: Review = {
      id: Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9),
      name: body.name,
      rating: Number(body.rating),
      text: body.text,
      date: new Date().toISOString(),
      source: "website",
      approved: false, // Reviews require approval by default
    };

    await addReview(review);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 });
  }
}
