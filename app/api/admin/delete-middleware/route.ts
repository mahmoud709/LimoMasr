import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function GET() {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;

  try {
    const middlewarePath = path.join(process.cwd(), "middleware.ts");
    await fs.unlink(middlewarePath);
    return NextResponse.json({ ok: true, message: "Deleted middleware.ts" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
