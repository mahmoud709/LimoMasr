import { MongoClient } from 'mongodb';

// =========================================================================
// ⚠️ قم بتعديل هذا الرابط برابط قاعدة البيانات الخاصة بالسيرفر (Production)
const REMOTE_URI = "mongodb+srv://mahmoudshalaby:mahmoud1300@limocluster.oss54j9.mongodb.net/limo?retryWrites=true&w=majority";
// =========================================================================

const LOCAL_URI = "mongodb://127.0.0.1:27017/limo";

// المجموعات (Collections) اللي محتاجين ننقلها
const COLLECTIONS_TO_SYNC = [
  'cars', 
  'fast-track', 
  'hotels', 
  'hotel-apartments', 
  'flights',
  'settings'
];

async function syncDatabases() {
  if (REMOTE_URI.includes('<username>')) {
    console.error("❌ برجاء وضع رابط السيرفر الصحيح في المتغير REMOTE_URI أولاً.");
    process.exit(1);
  }

  console.log("🔄 جاري الاتصال بقواعد البيانات...");
  const localClient = new MongoClient(LOCAL_URI);
  const remoteClient = new MongoClient(REMOTE_URI);

  try {
    await localClient.connect();
    await remoteClient.connect();

    const localDb = localClient.db();
    const remoteDb = remoteClient.db(); // هتاخد اسم الداتا بيز من الرابط

    for (const collectionName of COLLECTIONS_TO_SYNC) {
      console.log(`\n⏳ جاري نقل البيانات للمجموعة: ${collectionName}...`);
      
      const localCollection = localDb.collection(collectionName);
      const remoteCollection = remoteDb.collection(collectionName);

      // جلب البيانات من اللوكال
      const data = await localCollection.find({}).toArray();
      
      if (data.length === 0) {
        console.log(`⚠️ لا يوجد بيانات في ${collectionName} على اللوكال.`);
        continue;
      }

      // مسح البيانات القديمة من السيرفر عشان منحطش داتا متكررة
      await remoteCollection.deleteMany({});
      
      // إدخال البيانات الجديدة للسيرفر
      await remoteCollection.insertMany(data);
      
      console.log(`✅ تم نقل ${data.length} عنصر بنجاح لـ ${collectionName}.`);
    }

    console.log("\n🎉 تم نقل جميع البيانات بنجاح من اللوكال إلى السيرفر!");
  } catch (error) {
    console.error("❌ حدث خطأ أثناء النقل:", error);
  } finally {
    await localClient.close();
    await remoteClient.close();
  }
}

syncDatabases();
