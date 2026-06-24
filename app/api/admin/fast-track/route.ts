import { NextResponse } from "next/server";
import { getFastTrackPackages, saveFastTrackPackages } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getFastTrackPackages());
}

export async function PUT(request: Request) {
  const payload = await request.json();
  await saveFastTrackPackages(payload);
  return NextResponse.json({ ok: true });
}
