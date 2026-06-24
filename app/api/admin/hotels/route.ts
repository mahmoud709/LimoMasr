import { NextResponse } from "next/server";
import { getHotels, saveHotels } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getHotels());
}

export async function PUT(request: Request) {
  const payload = await request.json();
  await saveHotels(payload);
  return NextResponse.json({ ok: true });
}
