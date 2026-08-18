import { NextResponse } from "next/server";
import { migrateAllImagesToCloudinary } from "@/lib/cloudinary-migrate";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function POST() {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;

  try {
    const summary = await migrateAllImagesToCloudinary();
    return NextResponse.json({ ok: true, summary });
  } catch (error: any) {
    console.error("Cloudinary migration failed:", error);
    return NextResponse.json({ error: error.message || "Migration failed" }, { status: 500 });
  }
}
