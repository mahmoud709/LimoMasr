const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017/limo";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const doc = await db.collection("settings").findOne({ _id: "site-settings" });
    console.log("heroImage:", doc.heroImage);
    console.log("heroImages:", doc.heroImages);
  } finally {
    await client.close();
  }
}
run();
