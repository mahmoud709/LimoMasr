import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const db = await getDb();
    const dataDir = path.join(process.cwd(), "data");

    const mapping = [
      { json: "cars.json", coll: "cars" },
      { json: "hotels.json", coll: "hotels" },
      { json: "hotel-apartments.json", coll: "hotel_apartments" },
      { json: "flights.json", coll: "flights" },
      { json: "fast-track.json", coll: "fast_track" },
      { json: "articles.json", coll: "articles" }
    ];

    const results: Record<string, number> = {};

    for (const item of mapping) {
      const filePath = path.join(dataDir, item.json);
      try {
        let content = await fs.readFile(filePath, "utf8");
        if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
        if (!content || !content.trim()) continue;

        const data = JSON.parse(content);
        if (Array.isArray(data) && data.length > 0) {
          const collection = db.collection(item.coll);
          await collection.deleteMany({});
          await collection.insertMany(data);
          results[item.coll] = data.length;
        }
      } catch (err: any) {
        console.error(`Error restoring ${item.json}:`, err.message);
      }
    }

    return NextResponse.json({
      success: true,
      restoredCollections: results
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
