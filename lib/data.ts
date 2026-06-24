import { promises as fs } from "fs";
import path from "path";
import type {
  Booking,
  Car,
  FastTrackPackage,
  HotelOption,
  SiteSettings,
} from "./types";

const dataDir = path.join(process.cwd(), "data");

async function readJson<T>(fileName: string): Promise<T> {
  let file = await fs.readFile(path.join(dataDir, fileName), "utf8");
  if (file.charCodeAt(0) === 0xFEFF) {
    file = file.slice(1);
  }
  return JSON.parse(file) as T;
}

async function writeJson<T>(fileName: string, data: T) {
  await fs.writeFile(
    path.join(dataDir, fileName),
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8",
  );
}

export async function getCars() {
  const cars = await readJson<Car[]>("cars.json");
  return cars.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveCars(cars: Car[]) {
  await writeJson("cars.json", cars);
}

export async function getFastTrackPackages() {
  const packages = await readJson<FastTrackPackage[]>("fast-track.json");
  return packages.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveFastTrackPackages(packages: FastTrackPackage[]) {
  await writeJson("fast-track.json", packages);
}

export async function getHotels() {
  return readJson<HotelOption[]>("hotels.json");
}

export async function saveHotels(hotels: HotelOption[]) {
  await writeJson("hotels.json", hotels);
}

export async function getBookings() {
  const bookings = await readJson<Booking[]>("bookings.json");
  return bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveBookings(bookings: Booking[]) {
  await writeJson("bookings.json", bookings);
}

export async function getSiteSettings() {
  return readJson<SiteSettings>("site-settings.json");
}

export async function saveSiteSettings(settings: SiteSettings) {
  await writeJson("site-settings.json", settings);
}
