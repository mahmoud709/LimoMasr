import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.name.replace(/[^a-zA-Z0-9.\-]/g, ""); // sanitize
    const finalFilename = `${uniqueSuffix}-${filename}`;
    
    // Ensure upload dir exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filepath = path.join(uploadDir, finalFilename);
    await fs.writeFile(filepath, buffer);

    // Return the public URL
    return NextResponse.json({ url: `/uploads/${finalFilename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string" || !url.startsWith("/uploads/")) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const filename = url.replace("/uploads/", "");
    const filepath = path.join(process.cwd(), "public", "uploads", filename);
    
    await fs.unlink(filepath);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
