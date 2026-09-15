import { MongoClient } from "mongodb";

async function check() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://mahmoud709:M123456789m@cluster0.o5hpx.mongodb.net/limo_masr?retryWrites=true&w=majority";
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
