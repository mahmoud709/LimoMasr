import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("articles");
    const jsonPath = path.join(process.cwd(), "data", "articles.json");
    const jsonContent = await fs.readFile(jsonPath, "utf-8");
    const data = JSON.parse(jsonContent);

    const preparedData = data.map((article: any) => ({
      ...article,
      published: article.published !== false
    }));

    await collection.deleteMany({});
    await collection.insertMany(preparedData);

    return NextResponse.json({ ok: true, count: preparedData.length, message: "تم الحفظ بنجاح" });
  } catch (error: any) {
    console.error("Error seeding articles into DB:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
