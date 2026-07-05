import { NextResponse } from "next/server";
import { updateCar, deleteCar } from "@/lib/data";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await request.json();
  const { id } = await params;
  await updateCar(id, payload);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteCar(id);
  return NextResponse.json({ ok: true });
}
