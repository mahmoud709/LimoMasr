import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

const envContent = fs.readFileSync(envPath, 'utf8');
const mongoUriMatch = envContent.match(/MONGODB_URI=(.*)/);
if (!mongoUriMatch) {
  console.error('No MONGODB_URI found in .env');
  process.exit(1);
}

const MONGODB_URI = mongoUriMatch[1].trim();

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db();
    
    const settingsCollection = db.collection('settings');
    
    const result = await settingsCollection.updateOne(
      { _id: 'site-settings' },
      {
        $set: {
          'whatsappCarNumber': '201068033333',
          'whatsappServiceNumber': '201068044444',
          'socialLinks.instagram': 'https://www.instagram.com/limoegypt',
          'socialLinks.telegram': 'https://t.me/limoegypt_official',
          'socialLinks.x': 'https://x.com/limoegypt1',
          'socialLinks.linkedin': 'https://www.linkedin.com/in/ليمو-مصر-limoegypt-327a5841b?utm_source=share_via&utm_content=profile&utm_medium=member_android'
        }
      },
      { upsert: true }
    );
    
    console.log(`Matched: ${result.matchedCount}, Updated: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
