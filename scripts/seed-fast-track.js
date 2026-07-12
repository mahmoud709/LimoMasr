const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri = "mongodb://127.0.0.1:27017/limo";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("fast-track");
    
    // Read the json
    const jsonPath = path.join(__dirname, "../data/fast-track.json");
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    
    // Clear and insert
    await collection.deleteMany({});
    await collection.insertMany(data);
    
    console.log("Successfully seeded fast-track packages into MongoDB!");
  } catch (error) {
    console.error("Failed to seed packages:", error);
  } finally {
    await client.close();
  }
}

run();
