export type ServiceType = "car" | "fast_track" | "hotel" | "flight" | "apartment";

export type AvailabilityStatus = "available" | "unavailable";

export type BookingStatus = "new" | "confirmed" | "cancelled" | "completed";

export type PriceUnit = "per_hour" | "per_trip" | "per_person";

export type AdminUserRole = "super_admin" | "sales";

export type Locale = "ar" | "en";

export type LocalizedText = {
  ar?: string;
  en?: string;
};

export type Car = {
  id: string;
  slug: string;
  categoryName: string;
  subtitle: string;
  models: string[];
  year: string;
  seats: number;
  price: number;
  priceUnit: PriceUnit;
  images: string[];
  status: AvailabilityStatus;
  tag?: string;
  sortOrder: number;
  notes?: string;
  translations?: {
    ar?: Partial<Pick<Car, "categoryName" | "subtitle" | "models" | "tag" | "notes">>;
    en?: Partial<Pick<Car, "categoryName" | "subtitle" | "models" | "tag" | "notes">>;
  };
};

export type FastTrackPackage = {
  id: string;
  name: string;
  airport: string;
  price: number;
  currency: "EGP" | "USD";
  description: string;
  image?: string;
  status: AvailabilityStatus;
  sortOrder: number;
  translations?: {
    ar?: Partial<Pick<FastTrackPackage, "name" | "airport" | "description">>;
    en?: Partial<Pick<FastTrackPackage, "name" | "airport" | "description">>;
  };
};

export type HotelOption = {
  id: string;
  city: string;
  name?: string;
  description: string;
  status: AvailabilityStatus;
  translations?: {
    ar?: Partial<Pick<HotelOption, "city" | "name" | "description">>;
    en?: Partial<Pick<HotelOption, "city" | "name" | "description">>;
  };
};

export type Booking = {
  id: string;
  type: ServiceType;
  customerName: string;
  phone: string;
  serviceRefId: string;
  serviceName: string;
  date: string;
  notes: string;
  passengers?: number;
  price?: number;
  status: BookingStatus;
  source: "whatsapp" | "web";
  createdAt: string;
};

export type SiteTranslation = {
  brand: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  footerText: string;
  policies: string;
  privacy: string;
};

export type SiteSettings = {
  whatsappCarNumber: string;
  whatsappServiceNumber: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroImages?: string[];
  socialLinks: Record<string, string>;
  policies: string;
  privacy: string;
  translations?: Partial<Record<Locale, SiteTranslation>>;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  read: boolean;
};
