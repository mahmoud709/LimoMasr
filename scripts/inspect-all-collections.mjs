import { getDb } from "../lib/mongodb.js";
import fs from "fs/promises";
import path from "path";

export async function checkAllData() {
  try {
    const db = await getDb();
    const collections = ["cars", "articles", "hotels", "fast-track", "flights", "hotel_apartments", "settings"];
    const report = {};

    for (const colName of collections) {
      const col = db.collection(colName);
      const docs = await col.find({}).toArray();
      report[colName] = {
        count: docs.length,
        sample: docs.slice(0, 2)
      };
    }

    console.log(JSON.stringify(report, null, 2));
  } catch (err) {
    console.error("Error inspecting DB:", err);
  }
}
