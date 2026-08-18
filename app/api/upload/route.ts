import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
    }

    const mimeType = file.type || "image/jpeg";
    
    // Only allow images and PDFs
    if (!mimeType.startsWith("image/") && mimeType !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file type. Only images and PDFs are allowed." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload directly to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(buffer, mimeType, "limo-masr/bookings");

    return NextResponse.json({ url: cloudinaryUrl });
  } catch (error: any) {
    console.error("Public Upload to Cloudinary error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
