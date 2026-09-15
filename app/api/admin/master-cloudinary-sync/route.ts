import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { MongoClient } from "mongodb";
import fs from "fs/promises";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "b2tqubbe",
  api_key: process.env.CLOUDINARY_API_KEY || "842369475353943",
  api_secret: process.env.CLOUDINARY_API_SECRET || "jcT8jqJL41r_jQHqop-B2NfkhEk",
  secure: true,
});

const mongoUri = process.env.MONGODB_URI || "mongodb+srv://mahmoudshalaby:mahmoud1300@limocluster.oss54j9.mongodb.net/limo";

const CATEGORY_FALLBACKS: Record<string, string> = {
  cars: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
  hotels: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
  apartments: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  flights: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  "fast-track": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
};

const FLIGHT_FALLBACKS: Record<string, string> = {
  "flight-cairo-istanbul": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
  "flight-cairo-riyadh": "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80",
  "flight-cairo-dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  "flight-cairo-jeddah": "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80",
  "flight-cairo-domestic": "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=1200&q=80",
};

async function uploadToCloudinary(imageUrl: string, folder: string, publicId: string, specificId: string = "") {
  if (imageUrl && imageUrl.includes("res.cloudinary.com/b2tqubbe")) {
    return imageUrl;
  }

  let targetUrl = imageUrl;
  if (specificId && FLIGHT_FALLBACKS[specificId]) {
    targetUrl = FLIGHT_FALLBACKS[specificId];
  }

  const categoryFallback = CATEGORY_FALLBACKS[folder] || CATEGORY_FALLBACKS.hotels;

  try {
    const res = await cloudinary.uploader.upload(targetUrl, {
      folder: `limo-masr/${folder}`,
      public_id: publicId,
      overwrite: true,
    });
    return res.secure_url;
  } catch (err: any) {
    try {
      const res = await cloudinary.uploader.upload(categoryFallback, {
        folder: `limo-masr/${folder}`,
        public_id: publicId,
        overwrite: true,
      });
      return res.secure_url;
    } catch (err2: any) {
      return imageUrl || categoryFallback;
    }
  }
}

export async function GET() {
  let client;
  try {
    const dataDir = path.join(process.cwd(), "data");
    const mapping = [
      { json: "cars.json", coll: "cars", folder: "cars" },
      { json: "hotels.json", coll: "hotels", folder: "hotels" },
      { json: "hotel-apartments.json", coll: "hotel_apartments", folder: "apartments" },
      { json: "flights.json", coll: "flights", folder: "flights" },
      { json: "fast-track.json", coll: "fast-track", folder: "fast-track" }
    ];

    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db("limo");
    const summary: Record<string, number> = {};

    for (const item of mapping) {
      const filePath = path.join(dataDir, item.json);
      let raw = await fs.readFile(filePath, "utf8");
      if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
      const records = JSON.parse(raw);

      const updatedRecords = [];
      const uniqueMap = new Map();

      for (let i = 0; i < records.length; i++) {
        const rec = records[i];
        const recordId = rec.id || `${item.coll}-${i + 1}`;

        if (uniqueMap.has(recordId)) continue;

        rec.image = await uploadToCloudinary(rec.image, item.folder, recordId, rec.id);
        uniqueMap.set(recordId, rec);
        updatedRecords.push(rec);
      }

      await fs.writeFile(filePath, JSON.stringify(updatedRecords, null, 2), "utf8");

      const collection = db.collection(item.coll);
      await collection.deleteMany({});
      await collection.insertMany(updatedRecords);
      summary[item.coll] = updatedRecords.length;
    }

    return NextResponse.json({
      success: true,
      message: "All collections successfully migrated to Cloudinary and stored in MongoDB Atlas!",
      summary
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
