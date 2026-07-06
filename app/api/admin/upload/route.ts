import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");
    
    // Detect file mime-type, fallback to image/jpeg
    const mimeType = file.type || "image/jpeg";
    
    // Construct the Base64 Data URL
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    // Return the base64 URL which will be stored in MongoDB Atlas
    return NextResponse.json({ url: dataUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  // Base64 images are stored directly in MongoDB document fields,
  // so deleting the image from the document is handled during saving.
  // We return ok: true to keep dashboard image removal buttons working.
  return NextResponse.json({ ok: true });
}
