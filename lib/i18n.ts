import type { Car, FastTrackPackage, HotelOption, Locale, SiteSettings } from "./types";

export const locales: Locale[] = ["ar", "en"];

export const ui = {
  ar: {
    home: "الرئيسية",
    cars: "السيارات",
    fastTrack: "المسار السريع",
    hotels: "الفنادق",
    about: "من نحن",
    contact: "تواصل معنا",
    whatsapp: "واتساب",
    bookWhatsapp: "احجز عبر واتساب",
    carBooking: "حجز ليموزين",
    bookLimo: "احجز ليموزين",
    bookFastTrack: "احجز المسار السريع",
    services: "الخدمات",
    servicesTitle: "كل ما يحتاجه الزائر من الوصول حتى الإقامة",
    servicesText: "ثلاث خدمات واضحة، كل خدمة لها رقم واتساب صحيح ورسالة حجز جاهزة.",
    fleet: "الأسطول",
    fleetTitle: "سيارات بأسعار ظاهرة من البداية",
    fleetText: "تبدأ الأسعار من {price} ويمكن تعديلها لاحقًا من لوحة التحكم.",
    viewAllCars: "عرض كل السيارات",
    serviceCards: [
      ["ليموزين", "اختيار السيارة والتاريخ وعدد الركاب.", "/cars"],
      ["المسار السريع", "استقبال ومرافقة داخل المطارات.", "/fast-track"],
      ["فنادق", "طلب عرض إقامة حسب المدينة والميزانية.", "/hotels"],
    ],
    stats: [["24/7", "استقبال طلبات طوال اليوم"], ["3 خطوات", "اختيار الخدمة ثم البيانات ثم واتساب"], ["رقمان", "توجيه العميل للرقم الصحيح حسب الخدمة"]],
    seats: "حتى {count} ركاب",
    model: "موديل {year}",
    available: "متاحة",
    unavailable: "غير متاحة",
    availableModels: "الموديلات المتاحة",
    bookThisCar: "احجز هذه السيارة",
    selectCar: "اختر السيارة المناسبة",
    selectCarText: "كل فئة تعرض السعة والسعر بوضوح، ثم تنقلك لنموذج حجز سريع عبر واتساب.",
    fastTrackTitle: "مسار سريع في المطارات",
    fastTrackText: "اختر الباقة المناسبة ثم أكد الطلب مباشرة عبر رقم خدمات المسار السريع والفنادق.",
    airport: "مطار {name}",
    perPerson: "للفرد",
    hotelTitle: "اطلب عرض إقامة حسب المدينة",
    hotelText: "أرسل تاريخ الوصول والمغادرة وعدد الأفراد، وسيتم تأكيد التفاصيل عبر واتساب.",
    hotelBooking: "طلب حجز فندق",
    aboutTitle: "شركة ليمو مصر",
    aboutText: "شركة نقل وخدمات سفر في مصر تركز على وضوح السعر وسرعة تأكيد الحجز وتجربة مريحة للزوار والسياح.",
    aboutBody: "نخدم عملاء الأفراد والعائلات والوفود من خلال أسطول متنوع وخدمات مسار سريع بالمطارات وحجز فنادق. هدفنا أن يصل العميل لقرار الحجز في أقل وقت، مع رقم واتساب مناسب لكل خدمة.",
    contactTitle: "العنوان والأرقام",
    contactText: "اختر الرقم المناسب حسب الخدمة حتى يصل طلبك للفريق الصحيح مباشرة.",
    address: "العنوان",
    carNumber: "حجز السيارات",
    serviceNumber: "المسار السريع والفنادق",
    policies: "الشروط والأحكام",
    privacy: "سياسة الخصوصية",
    carsLabel: "سيارات",
    fastHotelsLabel: "المسار السريع وفنادق",
    hero: {
      eyebrow: "تنقل أسهل... راحة أكثر",
      title1: "احجز رحلتك الآن واستمتع",
      title2: "براحة من أول لحظة",
      text: "سواء رحلتك من و إلى المطار أو محتاج سيارة ليومك، إحنا بنوفرلك تجربة تنقل مريحة وآمنة بأسطول سيارات حديث وسائقين محترفين. خدمة متاحة في أي وقت، أسعار تنافسية، وتجربة تقدر تعتمد عليها في كل مشوار.",
      cta: "احجز رحلتك الآن"
    },
    social: {
      title: "رافقنا في الرحلة",
      text: "إلهام للسفر، وكواليس رحلاتنا، وأجمل ما في مصر — انضم إلى مجتمعنا وكن جزءاً من رحلاتنا الاستثنائية."
    },
    contactPage: {
      title: "تواصل معنا",
      subtitle: "نحن هنا للإجابة على استفساراتك ومساعدتك لتلبية احتياجاتك لتجربة سفر مريحة وآمنة.",
      formTitle: "أرسل لنا رسالة",
      name: "الاسم",
      email: "البريد الإلكتروني",
      phone: "رقم الجوال",
      phonePlaceholder: "ادخل رقم هاتفك",
      message: "رسالتك",
      messagePlaceholder: "كيف يمكننا مساعدتك؟",
      send: "إرسال الرسالة",
      hq: "مقر الشركة الرئيسي",
      emailLabel: "البريد الإلكتروني",
      followUs: "تابعنا على"
    }
  },
  en: {
    home: "Home",
    cars: "Cars",
    fastTrack: "Fast Track",
    hotels: "Hotels",
    about: "About",
    contact: "Contact",
    whatsapp: "WhatsApp",
    bookWhatsapp: "Book on WhatsApp",
    carBooking: "Limousine Booking",
    bookLimo: "Book Limo",
    bookFastTrack: "Book Fast Track",
    services: "Services",
    servicesTitle: "Everything visitors need from arrival to stay",
    servicesText: "Three clear services, each routed to the right WhatsApp number with a ready message.",
    fleet: "Fleet",
    fleetTitle: "Cars with clear prices from the start",
    fleetText: "Prices start from {price}, and admins can edit them later from the dashboard.",
    viewAllCars: "View All Cars",
    serviceCards: [
      ["Limousine", "Choose car, date, and passenger count.", "/cars"],
      ["Fast Track", "Airport meet-and-assist services.", "/fast-track"],
      ["Hotels", "Request a stay offer by city and budget.", "/hotels"],
    ],
    stats: [["24/7", "Requests received all day"], ["3 steps", "Choose, fill details, then WhatsApp"], ["2 numbers", "Customers reach the right team"]],
    seats: "Up to {count} passengers",
    model: "Model {year}",
    available: "Available",
    unavailable: "Unavailable",
    availableModels: "Available models",
    bookThisCar: "Book this car",
    selectCar: "Choose the right car",
    selectCarText: "Each category shows capacity and price clearly, then opens a fast WhatsApp booking form.",
    fastTrackTitle: "Airport fast track services",
    fastTrackText: "Choose the right package and confirm directly through the services WhatsApp number.",
    airport: "{name} Airport",
    perPerson: "per person",
    hotelTitle: "Request a hotel offer by city",
    hotelText: "Send arrival, departure, and guest count, then confirm details on WhatsApp.",
    hotelBooking: "Hotel booking request",
    aboutTitle: "Limo Masr Company",
    aboutText: "A transport and travel services company in Egypt focused on clear prices, fast booking confirmation, and a comfortable visitor experience.",
    aboutBody: "We serve individuals, families, and delegations through a varied fleet, airport fast track services, and hotel booking. Our goal is to help customers decide quickly with the right WhatsApp number for every service.",
    contactTitle: "Address and Numbers",
    contactText: "Choose the right number for your service so the correct team receives your request directly.",
    address: "Address",
    carNumber: "Car booking",
    serviceNumber: "Fast track and hotels",
    policies: "Terms and Conditions",
    privacy: "Privacy Policy",
    carsLabel: "Cars",
    fastHotelsLabel: "Fast Track and Hotels",
    hero: {
      eyebrow: "Easier transit... More comfort",
      title1: "Book your ride now and enjoy",
      title2: "comfort from the first moment",
      text: "Whether your trip is to/from the airport or you need a car for the day, we provide a comfortable and safe transportation experience with a modern fleet and professional drivers. Available 24/7, competitive prices, and a reliable experience.",
      cta: "Book your ride now"
    },
    social: {
      title: "Join us on the journey",
      text: "Travel inspiration, behind the scenes, and the best of Egypt — join our community and be part of our exceptional journeys."
    },
    contactPage: {
      title: "Contact Us",
      subtitle: "We are here to answer your inquiries and help meet your needs for a comfortable and safe travel experience.",
      formTitle: "Send us a message",
      name: "Name",
      email: "Email Address",
      phone: "Phone Number",
      phonePlaceholder: "Enter your phone number",
      message: "Your Message",
      messagePlaceholder: "How can we help you?",
      send: "Send Message",
      hq: "Headquarters",
      emailLabel: "Email",
      followUs: "Follow Us"
    }
  },
} as const;

export function getLocale(value?: string | string[]): Locale {
  return value === "en" ? "en" : "ar";
}

export function withLang(href: string, locale: Locale) {
  return locale === "ar" ? href : `${href}?lang=en`;
}

export function siteText(settings: SiteSettings, locale: Locale) {
  const translated = settings.translations?.[locale];
  return {
    brand: translated?.brand ?? settings.heroTitle,
    address: translated?.address ?? settings.address,
    heroTitle: translated?.heroTitle ?? settings.heroTitle,
    heroSubtitle: translated?.heroSubtitle ?? settings.heroSubtitle,
    heroBadge: translated?.heroBadge ?? ui[locale].bookWhatsapp,
    footerText: translated?.footerText ?? "",
    policies: translated?.policies ?? settings.policies,
    privacy: translated?.privacy ?? settings.privacy,
  };
}

export function localizeCar(car: Car, locale: Locale): Car {
  return { ...car, ...car.translations?.[locale] };
}

export function localizePackage(item: FastTrackPackage, locale: Locale): FastTrackPackage {
  return { ...item, ...item.translations?.[locale] };
}

export function localizeHotel(item: HotelOption, locale: Locale): HotelOption {
  return { ...item, ...item.translations?.[locale] };
}
