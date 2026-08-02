const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri = "mongodb://127.0.0.1:27017/limo";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("articles");
    
    // Read the json
    const jsonPath = path.join(__dirname, "../data/articles.json");
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    
    // Ensure all articles in seed have published: true
    const preparedData = data.map(article => ({
      ...article,
      published: article.published !== false
    }));
    
    // Clear and insert into MongoDB database
    await collection.deleteMany({});
    await collection.insertMany(preparedData);
    
    console.log(`Successfully seeded ${preparedData.length} articles directly into MongoDB database!`);
  } catch (error) {
    console.error("Failed to seed articles into MongoDB:", error);
  } finally {
    await client.close();
  }
}

run();
