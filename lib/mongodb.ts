import { MongoClient, type Db } from "mongodb";
type MongoCache = { promise?: Promise<MongoClient> };
const globalMongo = globalThis as typeof globalThis & { _limoMongo?: MongoCache };
const cache: MongoCache = process.env.NODE_ENV === "development" ? (globalMongo._limoMongo ??= {}) : {};
/** Database connections start on demand, never during route module evaluation. */
export function getMongoClient(): Promise<MongoClient> {
  if (cache.promise) return cache.promise;
  const uri = process.env.MONGODB_URI || (process.env.NODE_ENV === "development" ? "mongodb://localhost:27017/limo-masr" : "");
  if (!uri) return Promise.reject(new Error("MONGODB_URI is not set."));
  const client = new MongoClient(uri, { minPoolSize: 0, maxPoolSize: 10, maxIdleTimeMS: 60000, serverSelectionTimeoutMS: 10000, waitQueueTimeoutMS: 10000 });
  cache.promise = client.connect().catch(async error => {
    cache.promise = undefined;
    await client.close().catch(() => undefined);
    throw error;
  });
  return cache.promise;
}
export async function getDb(): Promise<Db> {
  return (await getMongoClient()).db("limo");
}
