import { MongoClient } from "mongodb";
import fs from "fs/promises";
import path from "path";
import fileURLToPath from "url";

const uri = "mongodb+srv://mahmoudshalaby:mahmoud1300@limocluster.oss54j9.mongodb.net/limo";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
    const db = client.db("limo");
    const dataDir = path.join(process.cwd(), "data");

    const mapping = [
      { json: "cars.json", coll: "cars" },
      { json: "hotels.json", coll: "hotels" },
      { json: "hotel-apartments.json", coll: "hotel_apartments" },
      { json: "flights.json", coll: "flights" },
      { json: "fast-track.json", coll: "fast-track" },
      { json: "articles.json", coll: "articles" }
    ];

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
          console.log(`Successfully synced ${data.length} records to collection '${item.coll}'`);
        }
      } catch (err) {
        console.error(`Error syncing ${item.json}:`, err.message);
      }
    }
    console.log("All collections synced successfully!");
  } finally {
    await client.close();
  }
}

run();
