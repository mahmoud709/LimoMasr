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

export async function GET() {
  try {
    const hotelsPath = path.join(process.cwd(), "data", "hotels.json");
    const raw = await fs.readFile(hotelsPath, "utf8");
    const hotels = JSON.parse(raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw);

    const updatedHotels = [];

    for (const hotel of hotels) {
      if (hotel.image && !hotel.image.includes("res.cloudinary.com/b2tqubbe")) {
        try {
          const uploadRes = await cloudinary.uploader.upload(hotel.image, {
            folder: "limo-masr/hotels",
            public_id: hotel.id,
            overwrite: true,
          });
          hotel.image = uploadRes.secure_url;
        } catch (err: any) {
          console.error(`Failed to upload ${hotel.id} to Cloudinary:`, err.message);
        }
      }
      updatedHotels.push(hotel);
    }

    // Save back to data/hotels.json
    await fs.writeFile(hotelsPath, JSON.stringify(updatedHotels, null, 2), "utf8");

    // Sync MongoDB
    const client = new MongoClient(mongoUri);
    try {
      await client.connect();
      const db = client.db("limo");
      const collection = db.collection("hotels");
      await collection.deleteMany({});
      await collection.insertMany(updatedHotels);
    } finally {
      await client.close();
    }

    return NextResponse.json({
      success: true,
      message: "Hotel images uploaded to Cloudinary & synced to database!",
      hotels: updatedHotels.map(h => ({ id: h.id, name: h.name, image: h.image }))
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
