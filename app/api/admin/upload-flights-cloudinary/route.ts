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
    const flightsPath = path.join(process.cwd(), "data", "flights.json");
    const raw = await fs.readFile(flightsPath, "utf8");
    const flights = JSON.parse(raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw);

    const updatedFlights = [];

    for (const flight of flights) {
      if (flight.image && !flight.image.includes("res.cloudinary.com/b2tqubbe")) {
        try {
          const uploadRes = await cloudinary.uploader.upload(flight.image, {
            folder: "limo-masr/flights",
            public_id: flight.id,
            overwrite: true,
          });
          flight.image = uploadRes.secure_url;
        } catch (err: any) {
          console.error(`Failed to upload ${flight.id} to Cloudinary:`, err.message);
        }
      }
      updatedFlights.push(flight);
    }

    // Save back to data/flights.json
    await fs.writeFile(flightsPath, JSON.stringify(updatedFlights, null, 2), "utf8");

    // Sync MongoDB
    const client = new MongoClient(mongoUri);
    try {
      await client.connect();
      const db = client.db("limo");
      const collection = db.collection("flights");
      await collection.deleteMany({});
      await collection.insertMany(updatedFlights);
    } finally {
      await client.close();
    }

    return NextResponse.json({
      success: true,
      message: "Flight images uploaded to Cloudinary & synced to database!",
      flights: updatedFlights.map(f => ({ id: f.id, fromCity: f.fromCity, toCity: f.toCity, image: f.image }))
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
