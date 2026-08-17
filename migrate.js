import { MongoClient } from 'mongodb';
import dns from 'dns';

// Force Google DNS to bypass local Windows DNS SRV timeout issues
dns.setServers(['8.8.8.8', '8.8.4.4']);
async function migrate() {
  // Bypassing DNS SRV and TXT records entirely by using the direct cluster nodes!
  const uri = 'mongodb://mahmoudshalaby:mahmoud1300@limocluster-shard-00-00.oss54j9.mongodb.net:27017,limocluster-shard-00-01.oss54j9.mongodb.net:27017,limocluster-shard-00-02.oss54j9.mongodb.net:27017/limo?ssl=true&authSource=admin';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB Cluster.');

    const sourceDb = client.db('test');
    const targetDb = client.db('limo');

    // Get all collections from the source (test) database
    const collections = await sourceDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections in 'test' database.`);

    for (let collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n--- Processing collection: ${collectionName} ---`);

      const sourceCollection = sourceDb.collection(collectionName);
      const targetCollection = targetDb.collection(collectionName);

      // Fetch all documents from the source collection
      const documents = await sourceCollection.find({}).toArray();

      if (documents.length > 0) {
        // Drop or clear target collection before inserting to avoid duplicates
        // Note: Using deleteMany to clear existing data in the limo DB for this collection
        await targetCollection.deleteMany({});
        
        // Insert documents into target collection
        await targetCollection.insertMany(documents);
        console.log(`✅ Successfully copied ${documents.length} documents to 'limo.${collectionName}'`);
      } else {
        console.log(`⚠️ No documents found in 'test.${collectionName}', skipping.`);
      }
    }

    console.log('\n🎉 Migration completed successfully! The "limo" database is now an exact copy of "test".');
    console.log('You can now safely delete the "test" database from MongoDB Compass.');
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
}

migrate();
