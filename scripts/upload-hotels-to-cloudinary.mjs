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

async function run() {
  console.log("--- Starting Hotel Images Cloudinary Upload ---");
  const hotelsPath = path.join(process.cwd(), "data", "hotels.json");
  const raw = await fs.readFile(hotelsPath, "utf8");
  const hotels = JSON.parse(raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw);

  const updatedHotels = [];

  for (const hotel of hotels) {
    console.log(`Uploading image for hotel: ${hotel.name} (${hotel.id})...`);
    if (hotel.image && !hotel.image.includes("res.cloudinary.com/b2tqubbe")) {
      try {
        const uploadRes = await cloudinary.uploader.upload(hotel.image, {
          folder: "limo-masr/hotels",
          public_id: hotel.id,
          overwrite: true,
        });
        console.log(`Uploaded! New Cloudinary URL: ${uploadRes.secure_url}`);
        hotel.image = uploadRes.secure_url;
      } catch (err) {
        console.error(`Failed to upload ${hotel.id} to Cloudinary:`, err.message);
      }
    } else {
      console.log(`Already Cloudinary URL: ${hotel.image}`);
    }
    updatedHotels.push(hotel);
  }

  // Save back to data/hotels.json
  await fs.writeFile(hotelsPath, JSON.stringify(updatedHotels, null, 2), "utf8");
  console.log("Saved updated Cloudinary URLs to data/hotels.json!");

  // Sync MongoDB Atlas
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db("limo");
    const collection = db.collection("hotels");
    await collection.deleteMany({});
    await collection.insertMany(updatedHotels);
    console.log("Successfully updated MongoDB Atlas 'hotels' collection!");
  } finally {
    await client.close();
  }

  console.log("--- Hotels Section Completed Successfully! ---");
}

run().catch(console.error);
