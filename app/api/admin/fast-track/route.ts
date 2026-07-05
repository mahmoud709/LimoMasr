import { NextResponse } from "next/server";
import { getFastTrackPackages, addFastTrackPackage } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getFastTrackPackages());
}

export async function POST(request: Request) {
  const payload = await request.json();
  await addFastTrackPackage(payload);
  return NextResponse.json({ ok: true, id: payload.id });
}
