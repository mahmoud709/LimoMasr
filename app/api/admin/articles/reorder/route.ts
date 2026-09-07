import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-auth";
import { updateArticle } from "@/lib/data";

export async function POST(request: Request) {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;

  const { orderedIds } = await request.json() as { orderedIds: string[] };

  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: "orderedIds must be an array" }, { status: 400 });
  }

  // Update each article's sortOrder based on its new position
  await Promise.all(
    orderedIds.map((id, index) => updateArticle(id, { sortOrder: index }))
  );

  return NextResponse.json({ ok: true });
}
