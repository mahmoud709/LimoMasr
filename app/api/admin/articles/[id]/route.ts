import { NextResponse } from "next/server";
import { updateArticle, deleteArticle } from "@/lib/data";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await request.json();
  await updateArticle(id, updates);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteArticle(id);
  return NextResponse.json({ ok: true });
}
