import { NextResponse } from "next/server";
import { getHotels, addHotel } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getHotels());
}

export async function POST(request: Request) {
  const payload = await request.json();
  await addHotel(payload);
  return NextResponse.json({ ok: true, id: payload.id });
}
