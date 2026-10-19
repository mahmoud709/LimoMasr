import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

const uploads = new Map<string, number[]>();
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const recent = (uploads.get(ip) || []).filter(time => now - time < 60000);
  if (recent.length >= 3) return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
  recent.push(now); uploads.set(ip, recent);
  for (const [key, times] of uploads) if (times.every(time => now - time >= 60000)) uploads.delete(key);
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
    if (!["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"].includes(mimeType)) {
      return NextResponse.json({ error: "Invalid file type. Only images and PDFs are allowed." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload directly to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(buffer, mimeType, "limo-masr/bookings");

    return NextResponse.json({ url: cloudinaryUrl });
  } catch {
    console.error("Public upload failed.");
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
