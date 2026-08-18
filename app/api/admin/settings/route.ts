import { NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/data";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function GET() {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;
  return NextResponse.json(await getSiteSettings());
}

export async function PUT(request: Request) {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;
  const payload = await request.json();
  await saveSiteSettings(payload);
  return NextResponse.json({ ok: true });
}
