import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import dns from 'dns';

// Force Google DNS to bypass local ISP / Windows DNS SRV timeout issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

export async function GET() {
  let client;
  try {
    const uri = process.env.MONGODB_URI || "mongodb+srv://mahmoudshalaby:mahmoud1300@limocluster.oss54j9.mongodb.net/limo";
    // We instantiate the client *after* setting the DNS servers
    client = new MongoClient(uri);
    await client.connect();
    
    const sourceDb = client.db('test');
    const targetDb = client.db('limo');

    // Get all collections from the source (test) database
    const collections = await sourceDb.listCollections().toArray();
    const results = [];

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const sourceCollection = sourceDb.collection(collectionName);
      const targetCollection = targetDb.collection(collectionName);

      // Fetch all documents from the source collection
      const documents = await sourceCollection.find({}).toArray();

      if (documents.length > 0) {
        // Drop or clear target collection before inserting to avoid duplicates
        await targetCollection.deleteMany({});
        
        // Insert documents into target collection
        await targetCollection.insertMany(documents);
        
        results.push(`Successfully copied ${documents.length} documents to 'limo.${collectionName}'`);
      } else {
        results.push(`No documents found in 'test.${collectionName}', skipped.`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully! The "limo" database is now an exact copy of "test".',
      details: results
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
