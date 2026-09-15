import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getDb } from "@/lib/mongodb";
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
    // 1. Fetch images from Cloudinary
    const cloudinaryRes = await cloudinary.api.resources({
      type: "upload",
      max_results: 500,
    });

    const resources = cloudinaryRes.resources || [];
    const allCloudinaryUrls = resources.map((r: any) => ({
      public_id: r.public_id,
      url: r.secure_url,
      created_at: r.created_at,
    }));

    // Sort newest first
    allCloudinaryUrls.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // 2. Fetch cars from MongoDB
    const db = await getDb();
    const carsCollection = db.collection("cars");
    const cars = await carsCollection.find({}).toArray();

    const restoredCars = [];
    const updates = [];

    // Filter images that belong to cars folder or general uploads
    const carImages = allCloudinaryUrls.filter((img: any) => 
      img.public_id.includes("car") || img.public_id.includes("limo-masr") || img.public_id.includes("cars")
    );

    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      // Search for images matching car.id, car.slug, or car name/index
      let matchedImages = carImages.filter((img: any) =>
        img.public_id.toLowerCase().includes(car.id.toLowerCase()) ||
        img.public_id.toLowerCase().includes(car.slug.toLowerCase())
      );

      // If no exact match, assign available cloudinary image URLs
      if (matchedImages.length === 0 && carImages[i]) {
        matchedImages = [carImages[i]];
      }

      const imageUrls = matchedImages.length > 0 
        ? matchedImages.map((m: any) => m.url)
        : (allCloudinaryUrls[i] ? [allCloudinaryUrls[i].url] : (car.images || []).filter((img: string) => !img.includes("unsplash.com")));

      if (imageUrls && imageUrls.length > 0) {
        await carsCollection.updateOne({ _id: car._id }, { $set: { images: imageUrls } });
        car.images = imageUrls;
        updates.push({ carId: car.id, images: imageUrls });
      }

      const { _id, ...cleanCar } = car;
      restoredCars.push(cleanCar);
    }

    // 3. Update data/cars.json so fallback also contains the Cloudinary URLs
    if (restoredCars.length > 0) {
      const carsJsonPath = path.join(process.cwd(), "data", "cars.json");
      await fs.writeFile(carsJsonPath, JSON.stringify(restoredCars, null, 2), "utf8");
    }

    return NextResponse.json({
      success: true,
      cloudinaryImagesCount: resources.length,
      carsUpdated: updates.length,
      cloudinaryImages: allCloudinaryUrls,
      cars: restoredCars,
    });
  } catch (error: any) {
    console.error("Restore error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
