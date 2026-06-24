import { NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getSiteSettings());
}

export async function PUT(request: Request) {
  const payload = await request.json();
  await saveSiteSettings(payload);
  return NextResponse.json({ ok: true });
}
