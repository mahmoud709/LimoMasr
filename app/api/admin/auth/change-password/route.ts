import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-auth";
export async function POST() {
  const unauthorized = await requireAdminAuth();
  if (unauthorized) return unauthorized;
  // Vercel's deployment filesystem is not a durable password store.
  return NextResponse.json({ error: "Password changes require an approved durable credential store." }, { status: 503 });
}
