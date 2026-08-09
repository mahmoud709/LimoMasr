import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";

    // Upload directly to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(buffer, mimeType, "limo-masr/bookings");

    return NextResponse.json({ url: cloudinaryUrl });
  } catch (error: any) {
    console.error("Public Upload to Cloudinary error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
