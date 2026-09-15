import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const collectionNames = ["cars", "articles", "hotels", "fast-track", "flights", "hotel_apartments", "settings"];
    const status: Record<string, any> = {};

    for (const name of collectionNames) {
      const col = db.collection(name);
      const count = await col.countDocuments();
      const docs = await col.find({}).limit(5).toArray();
      status[name] = { count, docs };
    }

    return NextResponse.json({ success: true, dbName: db.databaseName, status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
