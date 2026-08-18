import { NextResponse } from "next/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;

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
    const cloudinaryUrl = await uploadToCloudinary(buffer, mimeType, "limo-masr");

    // Return the permanent Cloudinary HTTPS URL to store in MongoDB
    return NextResponse.json({ url: cloudinaryUrl });
  } catch (error: any) {
    console.error("Upload to Cloudinary error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauth = await requireAdminAuth();
  if (unauth) return unauth;

  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
    }

    // Remove image from Cloudinary cloud storage
    const success = await deleteFromCloudinary(url);

    return NextResponse.json({ ok: true, deletedFromCloudinary: success });
  } catch (error: any) {
    console.error("Delete from Cloudinary error:", error);
    return NextResponse.json({ error: error.message || "Deletion failed" }, { status: 500 });
  }
}
