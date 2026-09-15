import { MongoClient } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';

cloudinary.config({
  cloud_name: 'b2tqubbe',
  api_key: '842369475353943',
  api_secret: 'jcT8jqJL41r_jQHqop-B2NfkhEk',
  secure: true,
});

const uri = 'mongodb+srv://mahmoudshalaby:mahmoud1300@limocluster.oss54j9.mongodb.net/limo';

async function restore() {
  console.log('Fetching images from Cloudinary...');
  try {
    const res = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
    });

    console.log(`Found ${res.resources.length} images on Cloudinary:`);
    const cloudinaryImages = res.resources.map((r) => ({
      public_id: r.public_id,
      url: r.secure_url,
      created_at: r.created_at
    }));

    console.log(JSON.stringify(cloudinaryImages, null, 2));

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('limo');
    const collection = db.collection('cars');

    const cars = await collection.find({}).toArray();
    console.log(`Found ${cars.length} cars in MongoDB.`);

    // Group images by folder or name if possible
    // e.g. limo-masr/cars/
    const carImages = cloudinaryImages.filter(img => img.public_id.includes('car') || img.public_id.includes('limo-masr'));

    console.log("Matching images to cars...");
    // Update each car with corresponding Cloudinary images
    for (const car of cars) {
      // Find matching images on Cloudinary
      const matches = cloudinaryImages.filter(img => 
        img.public_id.toLowerCase().includes(car.id.toLowerCase()) || 
        img.public_id.toLowerCase().includes(car.slug.toLowerCase())
      );

      if (matches.length > 0) {
        const urls = matches.map(m => m.url);
        await collection.updateOne({ _id: car._id }, { $set: { images: urls } });
        console.log(`Updated car ${car.id} with images:`, urls);
      }
    }

    await client.close();
  } catch (err) {
    console.error('Error during restoration:', err);
  }
}

restore();
