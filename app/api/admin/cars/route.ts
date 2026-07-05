import { NextResponse } from "next/server";
import { getCars, addCar } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getCars());
}

export async function POST(request: Request) {
  const payload = await request.json();
  await addCar(payload);
  return NextResponse.json({ ok: true, id: payload.id });
}
