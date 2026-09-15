import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://mahmoudshalaby:mahmoud1300@limocluster.oss54j9.mongodb.net/';

async function inspectAllDbs() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to cluster!");
    const adminDb = client.db().admin();
    const dbsList = await adminDb.listDatabases();
    console.log("Databases found:", dbsList.databases.map(d => d.name));

    for (const dbInfo of dbsList.databases) {
      const dbName = dbInfo.name;
      if (["admin", "local"].includes(dbName)) continue;
      
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      console.log(`\n--- Database: ${dbName} ---`);
      for (const colInfo of collections) {
        const col = db.collection(colInfo.name);
        const count = await col.countDocuments();
        console.log(`Collection ${colInfo.name}: ${count} documents`);
        if (count > 0) {
          const sample = await col.find({}).limit(3).toArray();
          console.log(`Sample from ${dbName}.${colInfo.name}:`, JSON.stringify(sample, null, 2));
        }
      }
    }
  } catch (err) {
    console.error("Error inspecting DBs:", err);
  } finally {
    await client.close();
  }
}

inspectAllDbs();
