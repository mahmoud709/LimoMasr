import { NextResponse } from "next/server";
import { getArticles, updateArticle, deleteArticle } from "@/lib/data";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await request.json();
  await updateArticle(id, updates);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const articles = await getArticles();
    const article = articles.find(a => a.id === id);
    if (article && article.image) {
      await deleteFromCloudinary(article.image);
    }
  } catch (err) {
    console.error("Error cleaning Cloudinary image for deleted article:", err);
  }

  await deleteArticle(id);
  return NextResponse.json({ ok: true });
}
