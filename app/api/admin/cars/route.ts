import { NextResponse } from "next/server";
import { getCars, addCar, batchAddCars, batchDeleteCars, reorderCars } from "@/lib/data";
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
  
  if (Array.isArray(payload)) {
    await batchAddCars(payload);
    return NextResponse.json({ ok: true, count: payload.length });
  } else {
    await addCar(payload);
    return NextResponse.json({ ok: true, id: payload.id });
  }
}

export async function PUT(request: Request) {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;
  const payload = await request.json();
  if (Array.isArray(payload.items)) {
    await reorderCars(payload.items);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;
  const payload = await request.json();
  if (Array.isArray(payload.ids)) {
    await batchDeleteCars(payload.ids);
  }
  return NextResponse.json({ ok: true });
}
