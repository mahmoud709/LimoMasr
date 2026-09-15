import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      max_results: 100,
    });
    return NextResponse.json({ success: true, resources: result.resources });
  } catch (error: any) {
    console.error("Error fetching Cloudinary resources:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
