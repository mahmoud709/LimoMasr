import { v2 as cloudinary } from "cloudinary";
import { MongoClient } from "mongodb";
import fs from "fs/promises";
import path from "path";

cloudinary.config({
  cloud_name: "b2tqubbe",
  api_key: "842369475353943",
  api_secret: "jcT8jqJL41r_jQHqop-B2NfkhEk",
  secure: true,
});

const mongoUri = "mongodb+srv://mahmoudshalaby:mahmoud1300@limocluster.oss54j9.mongodb.net/limo";

// Premium high-res fallback images for each category in case external URL fails
const CATEGORY_FALLBACKS = {
  cars: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
  hotels: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
  "hotel-apartments": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  flights: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  "fast-track": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
};

// Specific flight destination fallback images
const FLIGHT_FALLBACKS = {
  "flight-cairo-istanbul": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80", // Galata / Hagia Sophia
  "flight-cairo-riyadh": "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80", // Riyadh
  "flight-cairo-dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80", // Dubai
  "flight-cairo-jeddah": "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80", // Jeddah / Madinah
  "flight-cairo-domestic": "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=1200&q=80", // Red Sea
};

async function uploadToCloudinary(imageUrl, folder, publicId, categoryFallback, specificId = "") {
  if (imageUrl && imageUrl.includes("res.cloudinary.com/b2tqubbe")) {
    return imageUrl;
  }

  let targetUrl = imageUrl;
  if (specificId && FLIGHT_FALLBACKS[specificId]) {
    targetUrl = FLIGHT_FALLBACKS[specificId];
  }

  try {
    const res = await cloudinary.uploader.upload(targetUrl, {
      folder: `limo-masr/${folder}`,
      public_id: publicId,
      overwrite: true,
    });
    console.log(`[Cloudinary Success] ${publicId} -> ${res.secure_url}`);
    return res.secure_url;
  } catch (err) {
    console.error(`[Upload Error] ${publicId} (${targetUrl}): ${err.message}. Trying category fallback...`);
    try {
      const res = await cloudinary.uploader.upload(categoryFallback, {
        folder: `limo-masr/${folder}`,
        public_id: publicId,
        overwrite: true,
      });
      console.log(`[Cloudinary Fallback Success] ${publicId} -> ${res.secure_url}`);
      return res.secure_url;
    } catch (err2) {
      console.error(`[Cloudinary Critical Error] ${publicId}:`, err2.message);
      return imageUrl || categoryFallback;
    }
  }
}

async function run() {
  console.log("================================================");
  console.log("  STARTING MASTER CLOUDINARY & MONGODB MIGRATION  ");
  console.log("================================================");

  const dataDir = path.join(process.cwd(), "data");
  const mapping = [
    { json: "cars.json", coll: "cars", folder: "cars" },
    { json: "hotels.json", coll: "hotels", folder: "hotels" },
    { json: "hotel-apartments.json", coll: "hotel_apartments", folder: "apartments" },
    { json: "flights.json", coll: "flights", folder: "flights" },
    { json: "fast-track.json", coll: "fast-track", folder: "fast-track" }
  ];

  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db("limo");

  for (const item of mapping) {
    console.log(`\nProcessing ${item.json}...`);
    const filePath = path.join(dataDir, item.json);
    let raw = await fs.readFile(filePath, "utf8");
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    const records = JSON.parse(raw);

    const updatedRecords = [];
    const uniqueMap = new Map();

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      const recordId = rec.id || `${item.coll}-${i + 1}`;

      // Skip duplicate IDs
      if (uniqueMap.has(recordId)) continue;

      const fallbackUrl = CATEGORY_FALLBACKS[item.folder] || CATEGORY_FALLBACKS.hotels;
      const cloudinaryUrl = await uploadToCloudinary(rec.image, item.folder, recordId, fallbackUrl, rec.id);

      rec.image = cloudinaryUrl;
      uniqueMap.set(recordId, rec);
      updatedRecords.push(rec);
    }

    // Save updated Cloudinary URLs to JSON file
    await fs.writeFile(filePath, JSON.stringify(updatedRecords, null, 2), "utf8");

    // Sync to MongoDB Atlas Collection cleanly
    const collection = db.collection(item.coll);
    await collection.deleteMany({});
    await collection.insertMany(updatedRecords);
    console.log(`Synced ${updatedRecords.length} unique Cloudinary records to MongoDB collection '${item.coll}'`);
  }

  await client.close();
  console.log("\n================================================");
  console.log("  ALL COLLECTIONS SUCCESSFULLY MIGRATED TO CLOUDINARY & MONGODB ATLAS  ");
  console.log("================================================");
}

run().catch(console.error);
