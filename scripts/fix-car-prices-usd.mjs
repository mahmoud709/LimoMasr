import { MongoClient } from "mongodb";

async function normalizePrices() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://mahmoud709:M123456789m@cluster0.o5hpx.mongodb.net/limo_masr?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("limo_masr");
  const cars = await db.collection("cars").find({}).toArray();

  const rate = 51.38;
  console.log("Normalizing car prices to USD base currency...");

  for (const car of cars) {
    if (car.price > 500) {
      const usdPrice = Math.round(car.price / rate);
      console.log(`Converting ${car.categoryName} from EGP ${car.price} -> USD ${usdPrice}`);
      await db.collection("cars").updateOne(
        { _id: car._id },
        { $set: { price: usdPrice } }
      );
    }
  }

  console.log("Prices normalized successfully!");
  await client.close();
}

normalizePrices();
