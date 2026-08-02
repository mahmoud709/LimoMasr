import { NextResponse } from "next/server";
import { getCars, updateCar, deleteCar } from "@/lib/data";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await request.json();
  const { id } = await params;
  await updateCar(id, payload);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Find car to clean up Cloudinary images before deletion
  try {
    const cars = await getCars();
    const car = cars.find(c => c.id === id);
    if (car) {
      if (car.image) await deleteFromCloudinary(car.image);
      if (Array.isArray(car.images)) {
        for (const imgUrl of car.images) {
          await deleteFromCloudinary(imgUrl);
        }
      }
    }
  } catch (err) {
    console.error("Error cleaning Cloudinary images for deleted car:", err);
  }

  await deleteCar(id);
  return NextResponse.json({ ok: true });
}
