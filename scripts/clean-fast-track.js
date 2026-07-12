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
    
    // Clear all
    await collection.deleteMany({});
    
    // Read the json
    const jsonPath = path.join(__dirname, "../data/fast-track.json");
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    
    // Insert once
    await collection.insertMany(data);
    
    console.log("Database cleaned and seeded successfully!");
  } catch (error) {
    console.error("Error cleaning database:", error);
  } finally {
    await client.close();
  }
}

run();
