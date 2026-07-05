import { NextResponse } from "next/server";
import { updateHotel, deleteHotel } from "@/lib/data";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await request.json();
  const { id } = await params;
  await updateHotel(id, payload);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteHotel(id);
  return NextResponse.json({ ok: true });
}
