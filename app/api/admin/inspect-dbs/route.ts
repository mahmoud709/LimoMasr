import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://mahmoudshalaby:mahmoud1300@limocluster.oss54j9.mongodb.net/limo";

export async function GET() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const adminDb = client.db().admin();
    const dbsList = await adminDb.listDatabases();

    const result: Record<string, any> = {};

    for (const dbInfo of dbsList.databases) {
      const dbName = dbInfo.name;
      if (["admin", "local"].includes(dbName)) continue;

      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      result[dbName] = {};

      for (const colInfo of collections) {
        const col = db.collection(colInfo.name);
        const docs = await col.find({}).toArray();
        result[dbName][colInfo.name] = {
          count: docs.length,
          documents: docs,
        };
      }
    }

    return NextResponse.json({ success: true, databases: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
