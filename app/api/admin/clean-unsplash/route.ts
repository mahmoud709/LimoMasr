import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "b2tqubbe",
  api_key: process.env.CLOUDINARY_API_KEY || "842369475353943",
  api_secret: process.env.CLOUDINARY_API_SECRET || "jcT8jqJL41r_jQHqop-B2NfkhEk",
  secure: true,
});

export async function GET() {
  try {
    // 1. Fetch Cloudinary images
    const cloudinaryRes = await cloudinary.api.resources({ type: "upload", max_results: 500 });
    const resources = cloudinaryRes.resources || [];
    const cUrls = resources.map((r: any) => r.secure_url).filter((url: string) => !url.includes("unsplash.com"));

    if (cUrls.length === 0) {
      return NextResponse.json({ error: "No Cloudinary images found" }, { status: 400 });
    }

    // 2. Clean MongoDB collections
    const db = await getDb();
    const collections = ["cars", "hotels", "hotel_apartments", "flights", "fast_track", "articles"];
    let dbUpdatedCount = 0;

    for (const collName of collections) {
      const coll = db.collection(collName);
      const items = await coll.find({}).toArray();

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let modified = false;
        let images = item.images;
        let image = item.image;

        if (Array.isArray(images)) {
          const cleanImgs = images.filter((img: string) => typeof img === "string" && !img.includes("unsplash.com"));
          if (cleanImgs.length !== images.length || cleanImgs.length === 0) {
            images = [cUrls[i % cUrls.length]];
            modified = true;
          }
        }

        if (typeof image === "string" && image.includes("unsplash.com")) {
          image = cUrls[i % cUrls.length];
          modified = true;
        }

        if (modified) {
          const updateObj: any = {};
          if (images !== undefined) updateObj.images = images;
          if (image !== undefined) updateObj.image = image;
          await coll.updateOne({ _id: item._id }, { $set: updateObj });
          dbUpdatedCount++;
        }
      }
    }

    // 3. Clean JSON files in data/
    const dataDir = path.join(process.cwd(), "data");
    const jsonFiles = ["cars.json", "hotels.json", "hotel-apartments.json", "flights.json", "fast-track.json", "articles.json"];
    let jsonUpdatedCount = 0;

    for (const fileName of jsonFiles) {
      const filePath = path.join(dataDir, fileName);
      try {
        const content = await fs.readFile(filePath, "utf8");
        if (!content || !content.trim()) continue;

        let json = JSON.parse(content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content);
        let modified = false;
        let idx = 0;

        const processItem = (obj: any) => {
          if (typeof obj !== "object" || obj === null) return;
          for (const k of Object.keys(obj)) {
            if (typeof obj[k] === "string" && obj[k].includes("unsplash.com")) {
              obj[k] = cUrls[idx % cUrls.length];
              idx++;
              modified = true;
            } else if (Array.isArray(obj[k])) {
              obj[k] = obj[k].map((val: any) => {
                if (typeof val === "string" && val.includes("unsplash.com")) {
                  const rep = cUrls[idx % cUrls.length];
                  idx++;
                  modified = true;
                  return rep;
                }
                return val;
              });
            } else if (typeof obj[k] === "object") {
              processItem(obj[k]);
            }
          }
        };

        if (Array.isArray(json)) json.forEach(processItem);
        else processItem(json);

        if (modified) {
          await fs.writeFile(filePath, JSON.stringify(json, null, 2), "utf8");
          jsonUpdatedCount++;
        }
      } catch (err: any) {
        console.error(`Error processing JSON ${fileName}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      cloudinaryCount: cUrls.length,
      dbUpdatedCount,
      jsonUpdatedCount
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
