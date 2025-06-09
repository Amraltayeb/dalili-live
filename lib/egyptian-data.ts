//  DALILI BUSINESS DIRECTORY DATA
//  ==============================================
//  Description: Comprehensive categories and locations for global expansion
//               Currently featuring Egyptian data for initial launch
//  ==============================================

export interface BusinessCategory {
  name_en: string;
  name_ar: string;
  icon_svg: string;
  color: string;
  subcategories?: string[];
  keywords: string[];
}

export interface BusinessLocation {
  name_en: string;
  name_ar: string;
  city: string;
  governorate: string;
  latitude: number;
  longitude: number;
  type: 'city' | 'district' | 'compound' | 'area';
}

// ===================== BUSINESS CATEGORIES =====================
// Global business categories with multilingual support
// Keywords help with automatic categorization

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    name_en: "Restaurants",
    name_ar: "مطاعم",
    icon_svg: "🍽️",
    color: "#FF6B6B",
    subcategories: [
      "Egyptian Cuisine", "Mediterranean", "Italian", "Chinese", "Fast Food", 
      "Seafood", "Grills", "Pizza", "Shawarma", "Koshary", "Ful & Falafel"
    ],
    keywords: ["restaurant", "food", "eat", "dining", "meal", "cuisine", "kitchen", "cafe", "bistro"]
  },
  {
    name_en: "Shopping",
    name_ar: "تسوق",
    icon_svg: "🛍️",
    color: "#4ECDC4",
    subcategories: [
      "Malls", "Clothing", "Electronics", "Jewelry", "Books", "Sports Gear", 
      "Home & Garden", "Supermarkets", "Pharmacies", "Mobile Shops"
    ],
    keywords: ["shop", "store", "market", "mall", "retail", "buy", "purchase", "boutique", "outlet"]
  },
  {
    name_en: "Health & Medical",
    name_ar: "صحة وطبي",
    icon_svg: "🏥",
    color: "#45B7D1",
    subcategories: [
      "Hospitals", "Clinics", "Dentists", "Pharmacies", "Eye Care", 
      "Dermatology", "Cardiology", "Pediatrics", "Gynecology", "Labs"
    ],
    keywords: ["medical", "health", "doctor", "clinic", "hospital", "dentist", "pharmacy", "care", "treatment"]
  },
  {
    name_en: "Beauty & Spas",
    name_ar: "تجميل ومنتجعات",
    icon_svg: "💄",
    color: "#FF69B4",
    subcategories: [
      "Hair Salons", "Nail Salons", "Spas", "Barber Shops", "Massage", 
      "Skincare", "Makeup Artists", "Beauty Centers", "Laser Centers"
    ],
    keywords: ["beauty", "salon", "spa", "hair", "nails", "massage", "barber", "makeup", "skincare"]
  },
  {
    name_en: "Automotive",
    name_ar: "سيارات",
    icon_svg: "🚗",
    color: "#96CEB4",
    subcategories: [
      "Car Repair", "Auto Parts", "Car Wash", "Tire Services", "Oil Change", 
      "Car Dealerships", "Auto Insurance", "Car Rental", "Mechanics"
    ],
    keywords: ["car", "auto", "vehicle", "repair", "garage", "mechanic", "tire", "service", "automotive"]
  },
  {
    name_en: "Home Services",
    name_ar: "خدمات منزلية",
    icon_svg: "🔧",
    color: "#FECA57",
    subcategories: [
      "Plumbing", "Electrical", "Cleaning", "HVAC", "Painting", 
      "Carpentry", "Pest Control", "Security Systems", "Internet/Cable"
    ],
    keywords: ["home", "house", "service", "repair", "maintenance", "plumber", "electrical", "cleaning"]
  },
  {
    name_en: "Education",
    name_ar: "تعليم",
    icon_svg: "📚",
    color: "#6C5CE7",
    subcategories: [
      "Schools", "Universities", "Language Centers", "Training Centers", 
      "Tutoring", "Nurseries", "Libraries", "Online Learning"
    ],
    keywords: ["education", "school", "university", "learning", "training", "teaching", "course", "study"]
  },
  {
    name_en: "Entertainment",
    name_ar: "ترفيه",
    icon_svg: "🎭",
    color: "#FD79A8",
    subcategories: [
      "Cinemas", "Theaters", "Gaming Centers", "Bowling", "Karaoke", 
      "Theme Parks", "Museums", "Art Galleries", "Sports Clubs"
    ],
    keywords: ["entertainment", "fun", "cinema", "movie", "game", "play", "theater", "museum", "art"]
  },
  {
    name_en: "Financial Services",
    name_ar: "خدمات مالية",
    icon_svg: "💰",
    color: "#00B894",
    subcategories: [
      "Banks", "ATMs", "Money Exchange", "Insurance", "Real Estate", 
      "Accounting", "Investment", "Loans", "Financial Planning"
    ],
    keywords: ["bank", "money", "finance", "exchange", "insurance", "loan", "investment", "accounting"]
  },
  {
    name_en: "Transportation",
    name_ar: "مواصلات",
    icon_svg: "🚌",
    color: "#0984E3",
    subcategories: [
      "Taxi Services", "Bus Stations", "Metro Stations", "Car Rental", 
      "Delivery Services", "Moving Services", "Travel Agencies"
    ],
    keywords: ["transport", "taxi", "bus", "metro", "travel", "delivery", "moving", "ride"]
  },
  {
    name_en: "Hotels & Travel",
    name_ar: "فنادق وسفر",
    icon_svg: "🏨",
    color: "#E17055",
    subcategories: [
      "Hotels", "Resorts", "Travel Agencies", "Airlines", "Tourist Attractions", 
      "Tour Guides", "Car Rental", "Hostels", "Vacation Rentals"
    ],
    keywords: ["hotel", "travel", "tourism", "vacation", "resort", "trip", "airline", "tour"]
  },
  {
    name_en: "Sports & Fitness",
    name_ar: "رياضة ولياقة",
    icon_svg: "💪",
    color: "#00CEC9",
    subcategories: [
      "Gyms", "Sports Clubs", "Swimming Pools", "Martial Arts", "Yoga", 
      "Personal Training", "Sports Equipment", "Football Clubs"
    ],
    keywords: ["gym", "fitness", "sport", "exercise", "training", "club", "swimming", "football"]
  }
];

// ===================== BUSINESS LOCATIONS =====================
// Currently featuring Egyptian locations for initial launch
// Structure supports any country/region expansion

export const BUSINESS_LOCATIONS: BusinessLocation[] = [
  // Greater Cairo
  { name_en: "New Cairo", name_ar: "القاهرة الجديدة", city: "New Cairo", governorate: "Cairo", latitude: 30.0131, longitude: 31.4586, type: "city" },
  { name_en: "Madinaty", name_ar: "مدينتي", city: "New Cairo", governorate: "Cairo", latitude: 30.1070, longitude: 31.6393, type: "compound" },
  { name_en: "El Shorouk", name_ar: "الشروق", city: "El Shorouk", governorate: "Cairo", latitude: 30.1218, longitude: 31.6092, type: "city" },
  { name_en: "Sheikh Zayed", name_ar: "الشيخ زايد", city: "Sheikh Zayed", governorate: "Giza", latitude: 30.0798, longitude: 30.9716, type: "city" },
  { name_en: "6th of October", name_ar: "مدينة 6 أكتوبر", city: "October City", governorate: "Giza", latitude: 29.9602, longitude: 30.9373, type: "city" },
  { name_en: "Nasr City", name_ar: "مدينة نصر", city: "Cairo", governorate: "Cairo", latitude: 30.0626, longitude: 31.3219, type: "district" },
  { name_en: "Heliopolis", name_ar: "مصر الجديدة", city: "Cairo", governorate: "Cairo", latitude: 30.0808, longitude: 31.3238, type: "district" },
  { name_en: "Zamalek", name_ar: "الزمالك", city: "Cairo", governorate: "Cairo", latitude: 30.0618, longitude: 31.2194, type: "district" },
  { name_en: "Maadi", name_ar: "المعادي", city: "Cairo", governorate: "Cairo", latitude: 29.9602, longitude: 31.2569, type: "district" },
  { name_en: "Dokki", name_ar: "الدقي", city: "Giza", governorate: "Giza", latitude: 30.0378, longitude: 31.2006, type: "district" },
  { name_en: "Mohandessin", name_ar: "المهندسين", city: "Giza", governorate: "Giza", latitude: 30.0626, longitude: 31.2001, type: "district" },
  { name_en: "Tagammu Al Khames", name_ar: "التجمع الخامس", city: "New Cairo", governorate: "Cairo", latitude: 30.0254, longitude: 31.4291, type: "area" },
  { name_en: "Rehab City", name_ar: "مدينة الرحاب", city: "New Cairo", governorate: "Cairo", latitude: 30.0589, longitude: 31.4911, type: "compound" },
  
  // Alexandria
  { name_en: "Alexandria", name_ar: "الإسكندرية", city: "Alexandria", governorate: "Alexandria", latitude: 31.2001, longitude: 29.9187, type: "city" },
  { name_en: "Borg El Arab", name_ar: "برج العرب", city: "Alexandria", governorate: "Alexandria", latitude: 30.9167, longitude: 29.6333, type: "area" },
  { name_en: "Agami", name_ar: "العجمي", city: "Alexandria", governorate: "Alexandria", latitude: 31.0501, longitude: 29.7834, type: "area" },
  
  // Red Sea
  { name_en: "Hurghada", name_ar: "الغردقة", city: "Hurghada", governorate: "Red Sea", latitude: 27.2574, longitude: 33.8129, type: "city" },
  { name_en: "Sharm El Sheikh", name_ar: "شرم الشيخ", city: "Sharm El Sheikh", governorate: "South Sinai", latitude: 27.9158, longitude: 34.3300, type: "city" },
  { name_en: "El Gouna", name_ar: "الجونة", city: "Hurghada", governorate: "Red Sea", latitude: 27.3959, longitude: 33.6801, type: "area" },
  
  // Other Major Cities
  { name_en: "Mansoura", name_ar: "المنصورة", city: "Mansoura", governorate: "Dakahlia", latitude: 31.0364, longitude: 31.3807, type: "city" },
  { name_en: "Tanta", name_ar: "طنطا", city: "Tanta", governorate: "Gharbia", latitude: 30.7865, longitude: 31.0004, type: "city" },
  { name_en: "Zagazig", name_ar: "الزقازيق", city: "Zagazig", governorate: "Sharqia", latitude: 30.5877, longitude: 31.5022, type: "city" },
  { name_en: "Ismailia", name_ar: "الإسماعيلية", city: "Ismailia", governorate: "Ismailia", latitude: 30.5965, longitude: 32.2715, type: "city" },
  { name_en: "Suez", name_ar: "السويس", city: "Suez", governorate: "Suez", latitude: 29.9668, longitude: 32.5498, type: "city" },
  { name_en: "Port Said", name_ar: "بورسعيد", city: "Port Said", governorate: "Port Said", latitude: 31.2653, longitude: 32.3019, type: "city" },
  { name_en: "Luxor", name_ar: "الأقصر", city: "Luxor", governorate: "Luxor", latitude: 25.6872, longitude: 32.6396, type: "city" },
  { name_en: "Aswan", name_ar: "أسوان", city: "Aswan", governorate: "Aswan", latitude: 24.0889, longitude: 32.8998, type: "city" },
  
  // New Administrative Capital
  { name_en: "New Administrative Capital", name_ar: "العاصمة الإدارية الجديدة", city: "New Capital", governorate: "Cairo", latitude: 30.0131, longitude: 31.7330, type: "city" },
  
  // New Cities & Compounds
  { name_en: "New Alamein", name_ar: "العلمين الجديدة", city: "New Alamein", governorate: "Matrouh", latitude: 30.8418, longitude: 28.9547, type: "city" },
  { name_en: "Ain Sokhna", name_ar: "العين السخنة", city: "Ain Sokhna", governorate: "Suez", latitude: 29.5969, longitude: 32.3489, type: "area" },
  { name_en: "Mountain View", name_ar: "ماونتن فيو", city: "New Cairo", governorate: "Cairo", latitude: 30.0189, longitude: 31.4765, type: "compound" },
  { name_en: "Katameya Heights", name_ar: "كتاميا هايتس", city: "New Cairo", governorate: "Cairo", latitude: 29.9945, longitude: 31.4201, type: "compound" },
  { name_en: "Beverly Hills", name_ar: "بيفرلي هيلز", city: "Sheikh Zayed", governorate: "Giza", latitude: 30.0701, longitude: 30.9598, type: "compound" },
  { name_en: "Palm Hills", name_ar: "بالم هيلز", city: "Sheikh Zayed", governorate: "Giza", latitude: 30.0654, longitude: 30.9445, type: "compound" }
];

// ===================== HELPER FUNCTIONS =====================

export function getCategoriesByType(searchTerm: string): BusinessCategory[] {
  return BUSINESS_CATEGORIES.filter(category =>
    category.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    category.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories?.some(sub => 
      sub.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
}

export function getLocationsByGovernorate(governorate: string): BusinessLocation[] {
  return BUSINESS_LOCATIONS.filter(location =>
    location.governorate.toLowerCase() === governorate.toLowerCase()
  );
}

export function getLocationsByCity(city: string): BusinessLocation[] {
  return BUSINESS_LOCATIONS.filter(location =>
    location.city.toLowerCase() === city.toLowerCase()
  );
} 