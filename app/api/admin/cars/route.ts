import { NextResponse } from "next/server";
import { getCars, saveCars } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getCars());
}

export async function PUT(request: Request) {
  const payload = await request.json();
  await saveCars(payload);
  return NextResponse.json({ ok: true });
}
