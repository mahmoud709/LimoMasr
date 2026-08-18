import { NextResponse } from "next/server";
import { updateFastTrackPackage, deleteFastTrackPackage } from "@/lib/data";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;
  const payload = await request.json();
  const { id } = await params;
  await updateFastTrackPackage(id, payload);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;
  const { id } = await params;
  await deleteFastTrackPackage(id);
  return NextResponse.json({ ok: true });
}
