import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "b2tqubbe",
  api_key: "842369475353943",
  api_secret: "jcT8jqJL41r_jQHqop-B2NfkhEk",
  secure: true,
});

async function run() {
  try {
    const res = await cloudinary.api.resources({ type: "upload", max_results: 500 });
    console.log(`Found ${res.resources.length} images in Cloudinary:`);
    res.resources.forEach((r, i) => {
      console.log(`${i + 1}. public_id: ${r.public_id} -> ${r.secure_url}`);
    });
  } catch (err) {
    console.error("Cloudinary error:", err.message);
  }
}

run();
