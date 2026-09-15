import { MongoClient } from "mongodb";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "b2tqubbe",
  api_key: "842369475353943",
  api_secret: "jcT8jqJL41r_jQHqop-B2NfkhEk",
  secure: true,
});

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

async function run() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("limo");
    const carsColl = db.collection("cars");

    // Fetch Cloudinary images
    const cRes = await cloudinary.api.resources({ type: "upload", max_results: 500 });
    const resources = cRes.resources || [];
    const cloudinaryUrls = resources
      .map(r => r.secure_url)
      .filter(url => !url.includes("unsplash.com"));

    console.log(`Found ${cloudinaryUrls.length} Cloudinary images.`);

    const cars = await carsColl.find({}).toArray();

    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      // Filter out unsplash images
      let cleanImages = (car.images || []).filter(img => !img.includes("unsplash.com"));

      // If empty, assign cloudinary image
      if (cleanImages.length === 0 && cloudinaryUrls[i % cloudinaryUrls.length]) {
        cleanImages = [cloudinaryUrls[i % cloudinaryUrls.length]];
      }

      await carsColl.updateOne({ _id: car._id }, { $set: { images: cleanImages } });
      console.log(`Updated car ${car.categoryName || car.id}:`, cleanImages);
    }

    console.log("SUCCESS: All unsplash URLs removed from MongoDB cars collection!");
    await client.close();
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
