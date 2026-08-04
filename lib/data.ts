import { promises as fs } from "fs";
import path from "path";
import { getDb } from "./mongodb";
import type {
  Booking,
  Car,
  FastTrackPackage,
  HotelOption,
  HotelItem,
  FlightRoute,
  ApartmentItem,
  SiteSettings,
  ContactMessage,
  Review,
  Article,
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

export async function getArticles(onlyPublished = false): Promise<Article[]> {
  try {
    const db = await getDb();
    const collection = db.collection<Article>("articles");
    
    let articles = await collection.find({}).toArray();
    
    if (articles.length === 0) {
      const fallbackArticles = await readJsonFallback<Article[]>("articles.json");
      if (fallbackArticles && fallbackArticles.length > 0) {
        const toInsert = fallbackArticles.map(({ ...a }) => a);
        await collection.insertMany(toInsert).catch(err => console.error("Error seeding articles:", err));
        articles = await collection.find({}).toArray();
      }
    }
    
    const result = articles.map(({ _id, ...article }) => article as Article);
    if (onlyPublished) {
      return result.filter(a => a.published !== false);
    }
    return result;
  } catch (error) {
    console.error("Failed to fetch articles from DB, falling back to JSON:", error);
    const fallbackArticles = await readJsonFallback<Article[]>("articles.json");
    const list = fallbackArticles || [];
    if (onlyPublished) {
      return list.filter(a => a.published !== false);
    }
    return list;
  }
}

export async function getArticleBySlug(slug: string, onlyPublished = true): Promise<Article | null> {
  const articles = await getArticles(onlyPublished);
  return articles.find(a => a.slug === slug) || null;
}

export async function addArticle(article: Article): Promise<void> {
  try {
    const db = await getDb();
    await db.collection("articles").insertOne(article);
  } catch (error) {
    console.error("Error adding article:", error);
    throw error;
  }
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<void> {
  try {
    const db = await getDb();
    await db.collection("articles").updateOne({ id }, { $set: updates });
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    const db = await getDb();
    await db.collection("articles").deleteOne({ id });
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}

export async function getCars(): Promise<Car[]> {
  try {
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
        await collection.insertMany(toInsert).catch(err => console.error("Error seeding cars:", err));
        cars = await collection.find({}).toArray();
      }
    }
    
    // Strip _id before returning to avoid TS issues or return with standard formatting
    const result = cars.map(({ _id, ...car }) => car as Car);
    return result.sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (error) {
    console.error("Failed to fetch cars from DB, falling back to JSON:", error);
    const fallbackCars = await readJsonFallback<Car[]>("cars.json");
    if (fallbackCars) {
      return fallbackCars.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return [];
  }
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
  try {
    const db = await getDb();
    const collection = db.collection<FastTrackPackage>("fast-track");
    
    let packages = await collection.find({}).toArray();
    
    // Check if we have duplicate ids in the database and clean them up
    const ids = packages.map(p => p.id);
    const hasDuplicates = ids.some((id, index) => ids.indexOf(id) !== index);
    
    // Check if we have old seed data (containing "cairo-standard" or USD currency or old image paths) or if it's empty
    const hasOldData = packages.some(p => p.id === "cairo-standard" || p.currency === "USD" || p.image?.startsWith("/airport_") || p.image?.startsWith("/vip_"));
    if (packages.length === 0 || hasOldData || hasDuplicates) {
      const fallbackPackages = await readJsonFallback<FastTrackPackage[]>("fast-track.json");
      if (fallbackPackages && fallbackPackages.length > 0) {
        await collection.deleteMany({});
        const toInsert = fallbackPackages.map(({ ...p }) => p);
        await collection.insertMany(toInsert).catch(err => console.error("Error seeding fast-track packages:", err));
        packages = await collection.find({}).toArray();
      }
    }
    
    const result = packages.map(({ _id, ...p }) => p as FastTrackPackage);
    return result.sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (error) {
    console.error("Failed to fetch fast-track packages from DB, falling back to JSON:", error);
    const fallbackPackages = await readJsonFallback<FastTrackPackage[]>("fast-track.json");
    if (fallbackPackages) {
      return fallbackPackages.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return [];
  }
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

export async function getHotels(): Promise<HotelItem[]> {
  try {
    const db = await getDb();
    const collection = db.collection<HotelItem>("hotels");
    
    let hotels = await collection.find({}).toArray();
    
    // Reseed if empty or old simple structure without price
    const hasOldData = hotels.some(h => typeof h.price !== "number" || !h.features);
    if (hotels.length === 0 || hasOldData) {
      const fallbackHotels = await readJsonFallback<HotelItem[]>("hotels.json");
      if (fallbackHotels && fallbackHotels.length > 0) {
        await collection.deleteMany({});
        const toInsert = fallbackHotels.map(({ ...h }) => h);
        await collection.insertMany(toInsert).catch(err => console.error("Error seeding hotels:", err));
        hotels = await collection.find({}).toArray();
      }
    }
    
    const result = hotels.map(({ _id, ...h }) => h as HotelItem);
    return result.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (error) {
    console.error("Failed to fetch hotels from DB, falling back to JSON:", error);
    const fallbackHotels = await readJsonFallback<HotelItem[]>("hotels.json");
    if (fallbackHotels) {
      return fallbackHotels.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }
    return [];
  }
}

export async function saveHotels(hotels: HotelItem[]) {
  const db = await getDb();
  const collection = db.collection("hotels");
  
  await collection.deleteMany({});
  if (hotels.length > 0) {
    const toInsert = hotels.map(({ ...h }) => h);
    await collection.insertMany(toInsert);
  }
}

export async function addHotel(hotel: HotelItem) {
  const db = await getDb();
  const collection = db.collection("hotels");
  await collection.insertOne({ ...hotel });
}

export async function updateHotel(id: string, hotel: Partial<HotelItem>) {
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

/* =========================================================================
   FLIGHT ROUTES
   ========================================================================= */

export async function getFlights(): Promise<FlightRoute[]> {
  try {
    const db = await getDb();
    const collection = db.collection<FlightRoute>("flights");
    
    let flights = await collection.find({}).toArray();
    
    if (flights.length === 0) {
      const fallbackFlights = await readJsonFallback<FlightRoute[]>("flights.json");
      if (fallbackFlights && fallbackFlights.length > 0) {
        await collection.deleteMany({});
        const toInsert = fallbackFlights.map(({ ...f }) => f);
        await collection.insertMany(toInsert).catch(err => console.error("Error seeding flights:", err));
        flights = await collection.find({}).toArray();
      }
    }
    
    const result = flights.map(({ _id, ...f }) => f as FlightRoute);
    return result.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (error) {
    console.error("Failed to fetch flights from DB, falling back to JSON:", error);
    const fallbackFlights = await readJsonFallback<FlightRoute[]>("flights.json");
    if (fallbackFlights) {
      return fallbackFlights.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }
    return [];
  }
}

export async function saveFlights(flights: FlightRoute[]) {
  const db = await getDb();
  const collection = db.collection("flights");
  
  await collection.deleteMany({});
  if (flights.length > 0) {
    const toInsert = flights.map(({ ...f }) => f);
    await collection.insertMany(toInsert);
  }
}

export async function addFlight(flight: FlightRoute) {
  const db = await getDb();
  const collection = db.collection("flights");
  await collection.insertOne({ ...flight });
}

export async function updateFlight(id: string, flight: Partial<FlightRoute>) {
  const db = await getDb();
  const collection = db.collection("flights");
  const { _id, ...updateData } = flight as any;
  await collection.updateOne({ id }, { $set: updateData });
}

export async function deleteFlight(id: string) {
  const db = await getDb();
  const collection = db.collection("flights");
  await collection.deleteOne({ id });
}

/* =========================================================================
   HOTEL APARTMENTS & SUITES
   ========================================================================= */

export async function getHotelApartments(): Promise<ApartmentItem[]> {
  try {
    const db = await getDb();
    const collection = db.collection<ApartmentItem>("hotel_apartments");
    
    let apartments = await collection.find({}).toArray();
    
    if (apartments.length === 0) {
      const fallbackApartments = await readJsonFallback<ApartmentItem[]>("hotel-apartments.json");
      if (fallbackApartments && fallbackApartments.length > 0) {
        await collection.deleteMany({});
        const toInsert = fallbackApartments.map(({ ...a }) => a);
        await collection.insertMany(toInsert).catch(err => console.error("Error seeding hotel apartments:", err));
        apartments = await collection.find({}).toArray();
      }
    }
    
    const result = apartments.map(({ _id, ...a }) => a as ApartmentItem);
    return result.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (error) {
    console.error("Failed to fetch hotel apartments from DB, falling back to JSON:", error);
    const fallbackApartments = await readJsonFallback<ApartmentItem[]>("hotel-apartments.json");
    if (fallbackApartments) {
      return fallbackApartments.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }
    return [];
  }
}

export async function saveHotelApartments(apartments: ApartmentItem[]) {
  const db = await getDb();
  const collection = db.collection("hotel_apartments");
  
  await collection.deleteMany({});
  if (apartments.length > 0) {
    const toInsert = apartments.map(({ ...a }) => a);
    await collection.insertMany(toInsert);
  }
}

export async function addHotelApartment(apartment: ApartmentItem) {
  const db = await getDb();
  const collection = db.collection("hotel_apartments");
  await collection.insertOne({ ...apartment });
}

export async function updateHotelApartment(id: string, apartment: Partial<ApartmentItem>) {
  const db = await getDb();
  const collection = db.collection("hotel_apartments");
  const { _id, ...updateData } = apartment as any;
  await collection.updateOne({ id }, { $set: updateData });
}

export async function deleteHotelApartment(id: string) {
  const db = await getDb();
  const collection = db.collection("hotel_apartments");
  await collection.deleteOne({ id });
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const db = await getDb();
    const collection = db.collection<Booking>("bookings");
    
    let bookings = await collection.find({}).toArray();
    
    if (bookings.length === 0) {
      const fallbackBookings = await readJsonFallback<Booking[]>("bookings.json");
      if (fallbackBookings && fallbackBookings.length > 0) {
        const toInsert = fallbackBookings.map(({ ...b }) => b);
        await collection.insertMany(toInsert).catch(err => console.error("Error seeding bookings:", err));
        bookings = await collection.find({}).toArray();
      }
    }
    
    const normalizeBooking = (b: any): Booking => {
      const item = { ...b } as Booking;
      if (item.notes) {
        if (item.notes.includes("[النوع: فندق]") && (item.type === "apartment" || !item.type)) {
          item.type = "hotel";
        } else if (item.notes.includes("[النوع: شقة فندقية]") && (item.type === "hotel" || !item.type)) {
          item.type = "apartment";
        }
        
        // If serviceName is generic but specific place/hotel was recorded in notes
        if (!item.serviceName || item.serviceName === "طلب حجز شقق فندقية" || item.serviceName === "طلب حجز فندق" || item.serviceName === "Hotel Booking Request" || item.serviceName === "Hotel Apartments Request") {
          const placeMatch = item.notes.match(/\[المكان:\s*([^\]]+)\]/);
          if (placeMatch && placeMatch[1] && placeMatch[1].trim() && placeMatch[1].trim() !== "غير محدد") {
            item.serviceName = placeMatch[1].trim();
          }
        }
      }
      return item;
    };

    const result = bookings.map(({ _id, ...b }) => normalizeBooking(b));
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    console.error("Failed to fetch bookings from DB, falling back to JSON:", error);
    const fallbackBookings = await readJsonFallback<Booking[]>("bookings.json");
    if (fallbackBookings) {
      return fallbackBookings.map((b: any) => {
        const item = { ...b } as Booking;
        if (item.notes) {
          if (item.notes.includes("[النوع: فندق]")) item.type = "hotel";
          if (item.notes.includes("[المكان:")) {
            const m = item.notes.match(/\[المكان:\s*([^\]]+)\]/);
            if (m && m[1] && m[1].trim() && m[1].trim() !== "غير محدد") item.serviceName = m[1].trim();
          }
        }
        return item;
      }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return [];
  }
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

export async function getLiveExchangeRates() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/EGP", {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error("Failed to fetch rates");
    const data = await res.json();
    return {
      usdRate: data.rates.USD ? Number((1 / data.rates.USD).toFixed(2)) : undefined,
      eurRate: data.rates.EUR ? Number((1 / data.rates.EUR).toFixed(2)) : undefined,
      sarRate: data.rates.SAR ? Number((1 / data.rates.SAR).toFixed(2)) : undefined,
      qarRate: data.rates.QAR ? Number((1 / data.rates.QAR).toFixed(2)) : undefined,
      kwdRate: data.rates.KWD ? Number((1 / data.rates.KWD).toFixed(2)) : undefined,
      bhdRate: data.rates.BHD ? Number((1 / data.rates.BHD).toFixed(2)) : undefined,
    };
  } catch (err) {
    console.error("Error fetching live rates:", err);
    return {};
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  let settingsToReturn: SiteSettings | null = null;
  try {
    const db = await getDb();
    const collection = db.collection("settings");
    
    // Settings is a single object stored with _id = "site-settings"
    const settingsDoc = await collection.findOne({ _id: "site-settings" as any });
    
    if (settingsDoc) {
      const { _id, ...settings } = settingsDoc as any;
      settingsToReturn = settings as SiteSettings;
    }
    
    if (!settingsToReturn) {
    const fallbackSettings = await readJsonFallback<SiteSettings>("site-settings.json");
      if (fallbackSettings) {
        const doc = { _id: "site-settings" as any, ...fallbackSettings };
        await collection.insertOne(doc).catch(err => console.error("Error seeding site settings:", err));
        settingsToReturn = fallbackSettings;
      }
    }
  } catch (error) {
    console.error("Failed to fetch site settings from DB, falling back to JSON:", error);
  }
  
  if (!settingsToReturn) {
    const fallbackSettings = await readJsonFallback<SiteSettings>("site-settings.json");
    if (fallbackSettings) {
      settingsToReturn = fallbackSettings;
    } else {
      // Fallback empty settings object if everything fails
      settingsToReturn = {
        whatsappCarNumber: "",
        whatsappServiceNumber: "",
        address: "",
        heroTitle: "",
        heroSubtitle: "",
        heroImage: "",
        socialLinks: {},
        policies: "",
        privacy: "",
        usdRate: 50,
      };
    }
  }

  const liveRates = await getLiveExchangeRates();
  return {
    ...settingsToReturn,
    usdRate: liveRates.usdRate || settingsToReturn.usdRate || 50,
    eurRate: liveRates.eurRate || settingsToReturn.eurRate || 55,
    sarRate: liveRates.sarRate || settingsToReturn.sarRate || 13,
    qarRate: liveRates.qarRate || settingsToReturn.qarRate || 13,
    kwdRate: liveRates.kwdRate || settingsToReturn.kwdRate || 160,
    bhdRate: liveRates.bhdRate || settingsToReturn.bhdRate || 130,
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
  try {
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
  } catch (error) {
    console.error("Failed to fetch contact messages from DB:", error);
    return { messages: [], total: 0 };
  }
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

export async function getReviews(onlyApproved = false): Promise<Review[]> {
  try {
    const db = await getDb();
    const collection = db.collection<Review>("reviews");
    const query = onlyApproved ? { approved: true } : {};
    const reviews = await collection.find(query).sort({ date: -1 }).toArray();
    return reviews.map(({ _id, ...r }) => r as Review);
  } catch (error) {
    console.error("Failed to fetch reviews from DB:", error);
    return [];
  }
}

export async function addReview(review: Review) {
  const db = await getDb();
  const collection = db.collection("reviews");
  await collection.insertOne({ ...review });
}

export async function updateReview(id: string, update: Partial<Review>) {
  const db = await getDb();
  const collection = db.collection("reviews");
  const { _id, ...updateData } = update as any;
  await collection.updateOne({ id }, { $set: updateData });
}

export async function deleteReview(id: string) {
  const db = await getDb();
  const collection = db.collection("reviews");
  await collection.deleteOne({ id });
}
