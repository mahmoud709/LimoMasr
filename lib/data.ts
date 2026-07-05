import { promises as fs } from "fs";
import path from "path";
import { getDb } from "./mongodb";
import type {
  Booking,
  Car,
  FastTrackPackage,
  HotelOption,
  SiteSettings,
  ContactMessage,
} from "./types";

const dataDir = path.join(process.cwd(), "data");

async function readJsonFallback<T>(fileName: string): Promise<T | null> {
  try {
    let file = await fs.readFile(path.join(dataDir, fileName), "utf8");
    if (file.charCodeAt(0) === 0xFEFF) {
      file = file.slice(1);
    }
    return JSON.parse(file) as T;
  } catch (error) {
    console.error(`Error reading fallback JSON file ${fileName}:`, error);
    return null;
  }
}

export async function getCars(): Promise<Car[]> {
  const db = await getDb();
  const collection = db.collection<Car>("cars");
  
  // Find all cars
  let cars = await collection.find({}).toArray();
  
  // If collection is empty, seed it from JSON file
  if (cars.length === 0) {
    const fallbackCars = await readJsonFallback<Car[]>("cars.json");
    if (fallbackCars && fallbackCars.length > 0) {
      // Remove mongo internal _id properties if any exist in the json array (unlikely but safe)
      const toInsert = fallbackCars.map(({ ...c }) => c);
      await collection.insertMany(toInsert);
      cars = await collection.find({}).toArray();
    }
  }
  
  // Strip _id before returning to avoid TS issues or return with standard formatting
  const result = cars.map(({ _id, ...car }) => car as Car);
  return result.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveCars(cars: Car[]) {
  const db = await getDb();
  const collection = db.collection("cars");
  
  // In a bulk update pattern, replace all documents
  await collection.deleteMany({});
  if (cars.length > 0) {
    // Insert new list
    const toInsert = cars.map(({ ...c }) => c);
    await collection.insertMany(toInsert);
  }
}

export async function addCar(car: Car) {
  const db = await getDb();
  const collection = db.collection("cars");
  await collection.insertOne({ ...car });
}

export async function updateCar(id: string, car: Partial<Car>) {
  const db = await getDb();
  const collection = db.collection("cars");
  const { _id, ...updateData } = car as any; // Ensure we don't try to update _id
  await collection.updateOne({ id }, { $set: updateData });
}

export async function deleteCar(id: string) {
  const db = await getDb();
  const collection = db.collection("cars");
  await collection.deleteOne({ id });
}

export async function getFastTrackPackages(): Promise<FastTrackPackage[]> {
  const db = await getDb();
  const collection = db.collection<FastTrackPackage>("fast-track");
  
  let packages = await collection.find({}).toArray();
  
  if (packages.length === 0) {
    const fallbackPackages = await readJsonFallback<FastTrackPackage[]>("fast-track.json");
    if (fallbackPackages && fallbackPackages.length > 0) {
      const toInsert = fallbackPackages.map(({ ...p }) => p);
      await collection.insertMany(toInsert);
      packages = await collection.find({}).toArray();
    }
  }
  
  const result = packages.map(({ _id, ...p }) => p as FastTrackPackage);
  return result.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveFastTrackPackages(packages: FastTrackPackage[]) {
  const db = await getDb();
  const collection = db.collection("fast-track");
  
  await collection.deleteMany({});
  if (packages.length > 0) {
    const toInsert = packages.map(({ ...p }) => p);
    await collection.insertMany(toInsert);
  }
}

export async function addFastTrackPackage(pkg: FastTrackPackage) {
  const db = await getDb();
  const collection = db.collection("fast-track");
  await collection.insertOne({ ...pkg });
}

export async function updateFastTrackPackage(id: string, pkg: Partial<FastTrackPackage>) {
  const db = await getDb();
  const collection = db.collection("fast-track");
  const { _id, ...updateData } = pkg as any;
  await collection.updateOne({ id }, { $set: updateData });
}

export async function deleteFastTrackPackage(id: string) {
  const db = await getDb();
  const collection = db.collection("fast-track");
  await collection.deleteOne({ id });
}

export async function getHotels(): Promise<HotelOption[]> {
  const db = await getDb();
  const collection = db.collection<HotelOption>("hotels");
  
  let hotels = await collection.find({}).toArray();
  
  if (hotels.length === 0) {
    const fallbackHotels = await readJsonFallback<HotelOption[]>("hotels.json");
    if (fallbackHotels && fallbackHotels.length > 0) {
      const toInsert = fallbackHotels.map(({ ...h }) => h);
      await collection.insertMany(toInsert);
      hotels = await collection.find({}).toArray();
    }
  }
  
  return hotels.map(({ _id, ...h }) => h as HotelOption);
}

export async function saveHotels(hotels: HotelOption[]) {
  const db = await getDb();
  const collection = db.collection("hotels");
  
  await collection.deleteMany({});
  if (hotels.length > 0) {
    const toInsert = hotels.map(({ ...h }) => h);
    await collection.insertMany(toInsert);
  }
}

export async function addHotel(hotel: HotelOption) {
  const db = await getDb();
  const collection = db.collection("hotels");
  await collection.insertOne({ ...hotel });
}

export async function updateHotel(id: string, hotel: Partial<HotelOption>) {
  const db = await getDb();
  const collection = db.collection("hotels");
  const { _id, ...updateData } = hotel as any;
  await collection.updateOne({ id }, { $set: updateData });
}

export async function deleteHotel(id: string) {
  const db = await getDb();
  const collection = db.collection("hotels");
  await collection.deleteOne({ id });
}

export async function getBookings(): Promise<Booking[]> {
  const db = await getDb();
  const collection = db.collection<Booking>("bookings");
  
  let bookings = await collection.find({}).toArray();
  
  if (bookings.length === 0) {
    const fallbackBookings = await readJsonFallback<Booking[]>("bookings.json");
    if (fallbackBookings && fallbackBookings.length > 0) {
      const toInsert = fallbackBookings.map(({ ...b }) => b);
      await collection.insertMany(toInsert);
      bookings = await collection.find({}).toArray();
    }
  }
  
  const result = bookings.map(({ _id, ...b }) => b as Booking);
  return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveBookings(bookings: Booking[]) {
  const db = await getDb();
  const collection = db.collection("bookings");
  
  await collection.deleteMany({});
  if (bookings.length > 0) {
    const toInsert = bookings.map(({ ...b }) => b);
    await collection.insertMany(toInsert);
  }
}

export async function addBooking(booking: Booking) {
  const db = await getDb();
  const collection = db.collection("bookings");
  await collection.insertOne({ ...booking });
}

export async function updateBooking(id: string, booking: Partial<Booking>) {
  const db = await getDb();
  const collection = db.collection("bookings");
  const { _id, ...updateData } = booking as any;
  await collection.updateOne({ id }, { $set: updateData });
}

export async function deleteBooking(id: string) {
  const db = await getDb();
  const collection = db.collection("bookings");
  await collection.deleteOne({ id });
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const db = await getDb();
  const collection = db.collection("settings");
  
  // Settings is a single object stored with _id = "site-settings"
  const settingsDoc = await collection.findOne({ _id: "site-settings" as any });
  
  if (settingsDoc) {
    const { _id, ...settings } = settingsDoc as any;
    return settings as SiteSettings;
  }
  
  // Seed settings if empty
  const fallbackSettings = await readJsonFallback<SiteSettings>("site-settings.json");
  if (fallbackSettings) {
    const doc = { _id: "site-settings" as any, ...fallbackSettings };
    await collection.insertOne(doc);
    return fallbackSettings;
  }
  
  // Fallback empty settings object if everything fails
  return {
    whatsappCarNumber: "",
    whatsappServiceNumber: "",
    address: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    socialLinks: {},
    policies: "",
    privacy: "",
  };
}

export async function saveSiteSettings(settings: SiteSettings) {
  const db = await getDb();
  const collection = db.collection("settings");
  
  await collection.replaceOne(
    { _id: "site-settings" as any },
    { _id: "site-settings" as any, ...settings },
    { upsert: true }
  );
}

export async function addContactMessage(message: ContactMessage) {
  const db = await getDb();
  const collection = db.collection("messages");
  await collection.insertOne({ ...message });
}

export async function getContactMessages(page = 1, limit = 10): Promise<{ messages: ContactMessage[], total: number }> {
  const db = await getDb();
  const collection = db.collection<ContactMessage>("messages");
  const skip = (page - 1) * limit;
  
  const [messages, total] = await Promise.all([
    collection.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    collection.countDocuments()
  ]);
  
  return { 
    messages: messages.map(({ _id, ...m }) => m as ContactMessage), 
    total 
  };
}

export async function updateContactMessage(id: string, update: Partial<ContactMessage>) {
  const db = await getDb();
  const collection = db.collection("messages");
  const { _id, ...updateData } = update as any;
  await collection.updateOne({ id }, { $set: updateData });
}

export async function deleteContactMessage(id: string) {
  const db = await getDb();
  const collection = db.collection("messages");
  await collection.deleteOne({ id });
}
