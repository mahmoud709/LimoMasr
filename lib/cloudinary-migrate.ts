import { getDb } from "./mongodb";
import { uploadToCloudinary } from "./cloudinary";
import fs from "fs/promises";
import path from "path";

/**
 * Upload a single image (Base64, local file path, or remote URL) to Cloudinary if it's not already hosted on Cloudinary
 */
export async function processAndUploadImage(imgUrl: string, folder = "limo-masr"): Promise<string> {
  if (!imgUrl || typeof imgUrl !== "string") return imgUrl;
  
  // Already hosted on Cloudinary
  if (imgUrl.includes("cloudinary.com")) return imgUrl;

  try {
    // 1. Base64 Data URL
    if (imgUrl.startsWith("data:image/")) {
      const parts = imgUrl.split(";base64,");
      const mimeType = parts[0].replace("data:", "");
      const buffer = Buffer.from(parts[1], "base64");
      const cloudinaryUrl = await uploadToCloudinary(buffer, mimeType, folder);
      console.log(`Migrated base64 image to Cloudinary: ${cloudinaryUrl}`);
      return cloudinaryUrl;
    }

    // 2. HTTP Remote URL (non-Cloudinary)
    if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
      const cloudinaryUrl = await uploadToCloudinary(imgUrl, "image/jpeg", folder);
      console.log(`Migrated remote image to Cloudinary: ${cloudinaryUrl}`);
      return cloudinaryUrl;
    }

    // 3. Local public file path (e.g. "/images/car.jpg" or "/uploads/xyz.jpg")
    let relativePath = imgUrl;
    if (relativePath.startsWith("/")) {
      relativePath = relativePath.slice(1);
    }

    const localFilePath = path.join(process.cwd(), "public", relativePath);
    const fileExists = await fs.stat(localFilePath).then(() => true).catch(() => false);

    if (fileExists) {
      const buffer = await fs.readFile(localFilePath);
      const ext = path.extname(localFilePath).toLowerCase();
      const mimeType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
      const cloudinaryUrl = await uploadToCloudinary(buffer, mimeType, folder);
      console.log(`Migrated local public image (${relativePath}) to Cloudinary: ${cloudinaryUrl}`);
      return cloudinaryUrl;
    }
  } catch (err) {
    console.error(`Failed to migrate image (${imgUrl.slice(0, 50)}...) to Cloudinary:`, err);
  }

  return imgUrl;
}

export interface MigrationSummary {
  carsMigrated: number;
  articlesMigrated: number;
  hotelsMigrated: number;
  fastTrackMigrated: number;
  settingsMigrated: number;
  totalImagesUploaded: number;
  details: string[];
}

/**
 * Scan all collections in MongoDB and migrate all image URLs to Cloudinary
 */
export async function migrateAllImagesToCloudinary(): Promise<MigrationSummary> {
  const db = await getDb();
  let totalImagesUploaded = 0;
  const details: string[] = [];

  // 1. Migrate Cars
  let carsMigrated = 0;
  const carsCollection = db.collection("cars");
  const cars = await carsCollection.find({}).toArray();

  for (const car of cars) {
    let updated = false;
    const anyCar = car as any;

    if (anyCar.image && typeof anyCar.image === "string" && !anyCar.image.includes("cloudinary.com")) {
      const newUrl = await processAndUploadImage(anyCar.image, "limo-masr/cars");
      if (newUrl !== anyCar.image) {
        anyCar.image = newUrl;
        updated = true;
        totalImagesUploaded++;
      }
    }

    if (Array.isArray(car.images) && car.images.length > 0) {
      const newImages = [];
      for (const img of car.images) {
        if (!img.includes("cloudinary.com")) {
          const newUrl = await processAndUploadImage(img, "limo-masr/cars");
          if (newUrl !== img) {
            updated = true;
            totalImagesUploaded++;
          }
          newImages.push(newUrl);
        } else {
          newImages.push(img);
        }
      }
      car.images = newImages;
    }

    if (updated) {
      await carsCollection.updateOne({ _id: car._id }, { $set: { image: anyCar.image, images: car.images } });
      carsMigrated++;
      details.push(`سيارة: ${car.name || car.id}`);
    }
  }

  // 2. Migrate Articles
  let articlesMigrated = 0;
  const articlesCollection = db.collection("articles");
  const articles = await articlesCollection.find({}).toArray();

  for (const article of articles) {
    if (article.image && !article.image.includes("cloudinary.com")) {
      const newUrl = await processAndUploadImage(article.image, "limo-masr/articles");
      if (newUrl !== article.image) {
        await articlesCollection.updateOne({ _id: article._id }, { $set: { image: newUrl } });
        articlesMigrated++;
        totalImagesUploaded++;
        details.push(`مقال: ${article.title || article.slug}`);
      }
    }
  }

  // 3. Migrate Hotels
  let hotelsMigrated = 0;
  const hotelsCollection = db.collection("hotels");
  const hotels = await hotelsCollection.find({}).toArray();

  for (const hotel of hotels) {
    if (hotel.image && !hotel.image.includes("cloudinary.com")) {
      const newUrl = await processAndUploadImage(hotel.image, "limo-masr/hotels");
      if (newUrl !== hotel.image) {
        await hotelsCollection.updateOne({ _id: hotel._id }, { $set: { image: newUrl } });
        hotelsMigrated++;
        totalImagesUploaded++;
        details.push(`فندق: ${hotel.name || hotel.id}`);
      }
    }
  }

  // 4. Migrate Fast Track Packages
  let fastTrackMigrated = 0;
  const fastTrackCollection = db.collection("fast-track");
  const ftPackages = await fastTrackCollection.find({}).toArray();

  for (const pkg of ftPackages) {
    if (pkg.image && !pkg.image.includes("cloudinary.com")) {
      const newUrl = await processAndUploadImage(pkg.image, "limo-masr/fast-track");
      if (newUrl !== pkg.image) {
        await fastTrackCollection.updateOne({ _id: pkg._id }, { $set: { image: newUrl } });
        fastTrackMigrated++;
        totalImagesUploaded++;
        details.push(`باقة فاست تراك: ${pkg.title || pkg.id}`);
      }
    }
  }

  // 5. Migrate Site Settings (Hero image)
  let settingsMigrated = 0;
  const settingsCollection = db.collection("settings");
  const settingsDoc = await settingsCollection.findOne({ _id: "site-settings" as any });

  if (settingsDoc && settingsDoc.heroImage && !settingsDoc.heroImage.includes("cloudinary.com")) {
    const newUrl = await processAndUploadImage(settingsDoc.heroImage, "limo-masr/site");
    if (newUrl !== settingsDoc.heroImage) {
      await settingsCollection.updateOne({ _id: "site-settings" as any }, { $set: { heroImage: newUrl } });
      settingsMigrated++;
      totalImagesUploaded++;
      details.push("صورة الهيرو الرئيسية بالموقع");
    }
  }

  return {
    carsMigrated,
    articlesMigrated,
    hotelsMigrated,
    fastTrackMigrated,
    settingsMigrated,
    totalImagesUploaded,
    details
  };
}
