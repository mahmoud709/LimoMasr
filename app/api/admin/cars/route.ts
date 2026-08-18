import { NextResponse } from "next/server";
import { getCars, addCar } from "@/lib/data";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function GET() {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;
  return NextResponse.json(await getCars());
}

export async function POST(request: Request) {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;
  const payload = await request.json();
  await addCar(payload);
  return NextResponse.json({ ok: true, id: payload.id });
}
