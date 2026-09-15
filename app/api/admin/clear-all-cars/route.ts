import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { requireAdminAuth } from "@/lib/admin-auth";
import fs from "fs/promises";
import path from "path";

export async function DELETE() {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;

  try {
    const db = await getDb();
    const collection = db.collection("cars");

    // 1. Clean up Cloudinary images for all cars
    const cars = await collection.find({}).toArray();
    for (const car of cars) {
      const anyCar = car as any;
      if (anyCar.image) await deleteFromCloudinary(anyCar.image).catch(() => {});
      if (Array.isArray(anyCar.images)) {
        for (const img of anyCar.images) {
          await deleteFromCloudinary(img).catch(() => {});
        }
      }
    }

    // 2. Wipe cars collection from MongoDB Atlas
    await collection.deleteMany({});

    // 3. Clear local cars.json backup
    const filePath = path.join(process.cwd(), "data", "cars.json");
    await fs.writeFile(filePath, "[]", "utf8").catch(() => {});

    return NextResponse.json({ success: true, message: "تم مسح جميع السيارات نهائياً من قاعدة البيانات" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
