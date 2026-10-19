import { MongoClient } from "mongodb";

async function check() {
  const uri = process.env.MONGODB_URI || requiredMongoUri();
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("limo_masr");
  const cars = await db.collection("cars").find({}).toArray();
  console.log("CARS COUNT IN MONGO DB ATLAS:", cars.length);
  cars.forEach(c => {
    console.log("ID:", c.id, "Name:", c.categoryName, "Images:", c.images, "Image:", c.image);
  });
  await client.close();
}

check();

function requiredMongoUri() {
  const value = process.env.MONGODB_URI;
  if (!value) throw new Error("MONGODB_URI is required; credentials must not be stored in source.");
  return value;
}
