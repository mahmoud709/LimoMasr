import { NextResponse } from "next/server";
import { getFlights, addFlight } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getFlights());
}

export async function POST(request: Request) {
  const payload = await request.json();
  await addFlight(payload);
  return NextResponse.json({ ok: true, id: payload.id });
}
