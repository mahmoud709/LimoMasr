/* eslint-disable @typescript-eslint/no-require-imports -- Explicit read-only staging checks. */
const { MongoClient } = require("mongodb");
const { loadEnvConfig } = require("@next/env");
function authority(uri) { return uri.replace(/^mongodb(?:\+srv)?:\/\//, "").split("/")[0].split("@").at(-1).toLowerCase(); }
async function main() {
  loadEnvConfig(process.cwd(), false);
  const uri = process.env.STAGING_MONGODB_URI;
  if (!uri || !/^mongodb(?:\+srv)?:\/\//.test(uri)) throw Error("STAGING_MONGODB_URI is not configured. No connection attempted.");
  if (process.env.MONGODB_URI && authority(uri) === authority(process.env.MONGODB_URI)) throw Error("Staging validation refuses the configured application cluster. Use a separate staging cluster.");
  const client = new MongoClient(uri, { maxPoolSize: 1, serverSelectionTimeoutMS: 10000, waitQueueTimeoutMS: 10000 });
  try {
    await client.connect(); const db = client.db("limo"); await db.command({ ping: 1 });
    const collections = await db.listCollections({}, { nameOnly: true }).toArray();
    const existing = new Set(collections.map(item => item.name));
    const required = ["cars", "hotels", "hotel_apartments", "flights", "fast-track", "bookings", "customers", "settings"];
    console.log(JSON.stringify({ connected: true, database: "limo", readOnly: true, collectionsPresent: required.filter(name => existing.has(name)), collectionsMissing: required.filter(name => !existing.has(name)), persistenceTested: false }, null, 2));
  } finally { await client.close(); }
}
main().catch(() => { console.error("Staging validation failed or is not configured. No writes performed; credential details suppressed."); process.exitCode = 1; });
