import { NextResponse } from "next/server";
import { getArticles, addArticle } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getArticles());
}

export async function POST(request: Request) {
  const payload = await request.json();
  await addArticle(payload);
  return NextResponse.json({ ok: true, id: payload.id });
}
