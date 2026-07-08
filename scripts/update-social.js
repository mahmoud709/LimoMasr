const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017/limo";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("settings");
    
    const links = {
      "facebook": "https://www.facebook.com/share/1DhiW3Sfwu/",
      "instagram": "https://www.instagram.com/limo.egypt?igsh=MXdzemQxemtib2x0eg==",
      "tiktok": "https://www.tiktok.com/@limoegypt?_r=1&_t=ZS-97ZG34ljRaS",
      "snapchat": "https://www.snapchat.com/add/limoegypt?share_id=YmWhlqVAf1I&locale=ar-EG",
      "telegram": "https://t.me/limoegyptofficial",
      "youtube": "https://www.youtube.com/@limoegypt",
      "x": "https://x.com/egyptkqf6"
    };

    const doc = await collection.findOne({ _id: "site-settings" });
    if (doc) {
      const socialLinks = { ...(doc.socialLinks || {}), ...links };
      await collection.updateOne(
        { _id: "site-settings" },
        { $set: { socialLinks } }
      );
      console.log("Social links updated successfully in MongoDB.");
    }
  } catch (error) {
    console.error("Error updating links:", error);
  } finally {
    await client.close();
  }
}

run();
