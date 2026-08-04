import { NextResponse } from "next/server";
import { getHotelApartments, addHotelApartment } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getHotelApartments());
}

export async function POST(request: Request) {
  const payload = await request.json();
  await addHotelApartment(payload);
  return NextResponse.json({ ok: true, id: payload.id });
}
