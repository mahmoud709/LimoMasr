import { requireAdminAuth } from "@/lib/admin-auth";
import { readRequestJson } from "@/lib/request-json";
import { NextResponse } from "next/server";
import { getReviews, addReview } from "@/lib/data";
import type { Review } from "@/lib/types";
// Removed uuid dependency to avoid missing package errors

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    if (all) { const unauthorized = await requireAdminAuth(); if (unauthorized) return unauthorized; }
    const reviews = await getReviews(!all);
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// In-memory rate limiting store
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60 * 1000; // 1 minute

export async function POST(request: Request) {
  try {
    // Basic IP-based rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip);

    if (lastRequest && now - lastRequest < RATE_LIMIT_MS) {
      return NextResponse.json({ error: "الرجاء الانتظار قليلاً قبل إضافة تقييم آخر" }, { status: 429 });
    }

    // Cleanup old entries randomly to prevent memory leak
    if (Math.random() < 0.1) {
      for (const [key, timestamp] of rateLimitMap.entries()) {
        if (now - timestamp > RATE_LIMIT_MS) {
          rateLimitMap.delete(key);
        }
      }
    }

    rateLimitMap.set(ip, now);

    const body = await readRequestJson(request).catch(() => null) as Record<string, unknown> | null;

    if (!body || typeof body.name !== "string" || !body.name.trim() || body.name.length > 150 || typeof body.text !== "string" || !body.text.trim() || body.text.length > 5000 || !Number.isInteger(Number(body.rating)) || Number(body.rating) < 1 || Number(body.rating) > 5) {
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
