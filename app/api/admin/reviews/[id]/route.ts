import { NextResponse } from "next/server";
import { updateReview, deleteReview } from "@/lib/data";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const body = await request.json();
    await updateReview(id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;

  try {
    const { id } = await params;
    await deleteReview(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
