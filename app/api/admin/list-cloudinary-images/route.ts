import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "b2tqubbe",
  api_key: process.env.CLOUDINARY_API_KEY || "842369475353943",
  api_secret: process.env.CLOUDINARY_API_SECRET || "jcT8jqJL41r_jQHqop-B2NfkhEk",
  secure: true,
});

export async function GET() {
  try {
    const res = await cloudinary.api.resources({ type: "upload", max_results: 200 });
    return NextResponse.json({
      success: true,
      count: res.resources.length,
      resources: res.resources.map((r: any) => ({ public_id: r.public_id, url: r.secure_url }))
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
