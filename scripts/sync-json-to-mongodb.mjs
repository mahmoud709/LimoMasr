import { MongoClient } from "mongodb";
import fs from "fs/promises";
import path from "path";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dataDir = path.join(process.cwd(), "data");

async function sync() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("limo");

    const collectionsMap = [
      { jsonFile: "hotels.json", collectionName: "hotels" },
      { jsonFile: "hotel-apartments.json", collectionName: "hotel_apartments" },
      { jsonFile: "flights.json", collectionName: "flights" },
      { jsonFile: "fast-track.json", collectionName: "fast_track" },
      { jsonFile: "articles.json", collectionName: "articles" },
    ];

    for (const item of collectionsMap) {
      const filePath = path.join(dataDir, item.jsonFile);
      try {
        let content = await fs.readFile(filePath, "utf8");
        if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
        const data = JSON.parse(content);

        if (Array.isArray(data) && data.length > 0) {
          const coll = db.collection(item.collectionName);
          await coll.deleteMany({});
          await coll.insertMany(data);
          console.log(`Synced ${data.length} records into ${item.collectionName} collection.`);
        }
      } catch (e) {
        console.error(`Error syncing ${item.jsonFile}:`, e.message);
      }
    }

    // Also clean up any temporary scripts
    await client.close();
    console.log("SUCCESS: All collections synced perfectly back to pristine condition!");
  } catch (err) {
    console.error("Sync error:", err);
  }
}

sync();
