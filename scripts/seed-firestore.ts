/**
 * Firestore Seed Script
 *
 * Run this script to populate your Firestore with dummy products for testing.
 *
 * Usage:
 *   1. Fill in your Firebase config in the .env file
 *   2. Run: npx ts-node scripts/seed-firestore.ts
 *
 * NOTE: This uses the Firebase Web SDK directly.
 * Make sure your Firestore security rules allow writes, or use the Firebase Admin SDK.
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// Replace with your actual Firebase config or load from .env
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DUMMY_PRODUCTS = [
  // === COMMERCIAL TREADMILLS ===
  {
    name: "ProFit X9000 Commercial Treadmill",
    shortDescription: "Heavy-duty treadmill for professional gyms",
    fullDescription:
      "The ProFit X9000 is a premium commercial-grade treadmill designed for high-traffic fitness centers. Featuring a powerful 5HP AC motor, 22-inch wide running belt, and advanced cushioning system to reduce joint impact. The 15.6-inch HD touchscreen offers built-in workout programs, heart rate monitoring, and connectivity features. Built to withstand continuous heavy use with a robust steel frame and self-lubricating deck.",
    price: 285000,
    mainCategory: "commercial",
    subCategory: "treadmills",
    images: [
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600",
    ],
    specifications: {
      Motor: "5 HP AC Motor",
      "Speed Range": "0.5 - 25 km/h",
      Incline: "0-15% Auto Incline",
      "Belt Size": '22" x 62"',
      "Max User Weight": "180 kg",
      Display: '15.6" HD Touchscreen',
      Warranty: "5 Years Frame, 3 Years Motor",
      Dimensions: "210 x 95 x 160 cm",
    },
    inStock: true,
    createdAt: Timestamp.now(),
  },
  {
    name: "SprintMax 7500 Treadmill",
    shortDescription: "Commercial treadmill with incline & decline",
    fullDescription:
      "The SprintMax 7500 offers a unique incline and decline feature perfect for interval training. Equipped with a 4HP motor, shock-absorbing deck, and a 12.1-inch interactive console. Ideal for gyms that want to offer diverse cardio training options to their members.",
    price: 195000,
    mainCategory: "commercial",
    subCategory: "treadmills",
    images: [
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600",
    ],
    specifications: {
      Motor: "4 HP AC Motor",
      "Speed Range": "0.5 - 22 km/h",
      Incline: "-3% to 15%",
      "Belt Size": '20" x 60"',
      "Max User Weight": "160 kg",
      Display: '12.1" LCD Console',
      Warranty: "3 Years Comprehensive",
      Dimensions: "200 x 90 x 155 cm",
    },
    inStock: true,
    createdAt: Timestamp.now(),
  },
  // === COMMERCIAL BIKES ===
  {
    name: "CyclePro S600 Spin Bike",
    shortDescription: "Premium spinning bike for group fitness",
    fullDescription:
      "The CyclePro S600 is engineered for intense group cycling sessions. Features a 25kg precision-balanced flywheel, magnetic resistance system with 40 levels, and a fully adjustable design to accommodate riders of all sizes. The built-in power meter and cadence sensor provide accurate performance data. SPD-compatible pedals and silent belt drive make it perfect for any studio environment.",
    price: 85000,
    mainCategory: "commercial",
    subCategory: "bikes",
    images: [
      "https://images.unsplash.com/photo-1591741535018-d08648b3f373?w=600",
    ],
    specifications: {
      "Flywheel Weight": "25 kg",
      Resistance: "40-Level Magnetic",
      "Drive System": "Belt Drive (Silent)",
      Pedals: "SPD-Compatible Dual-Sided",
      Display: "LCD with Bluetooth",
      "Max User Weight": "150 kg",
      Warranty: "2 Years Comprehensive",
      Weight: "65 kg",
    },
    inStock: true,
    createdAt: Timestamp.now(),
  },
  // === COMMERCIAL STRENGTH TRAINING ===
  {
    name: "IronForge Multi-Station Gym",
    shortDescription: "4-station multi-gym for complete workouts",
    fullDescription:
      "The IronForge Multi-Station Gym is a complete strength training solution for commercial facilities. This 4-station system allows multiple users to train simultaneously with dedicated stations for lat pulldown, chest press, cable crossover, and leg press. Heavy-duty steel construction with premium upholstery and smooth cable operation ensures years of intensive use.",
    price: 450000,
    mainCategory: "commercial",
    subCategory: "strength-training",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
    ],
    specifications: {
      Stations: "4 Independent Stations",
      "Weight Stack": "100 kg per station",
      "Frame Material": "Heavy-Duty Steel (Q235)",
      "Cable Type": "7x19 Aircraft-Grade",
      Upholstery: "Premium PU Leather",
      Footprint: "350 x 280 x 230 cm",
      "Total Weight": "850 kg",
      Warranty: "5 Years Frame, 2 Years Parts",
    },
    inStock: true,
    createdAt: Timestamp.now(),
  },
  // === COMMERCIAL ELLIPTICAL ===
  {
    name: "GlideFit E900 Elliptical Trainer",
    shortDescription: "Low-impact commercial elliptical with long stride",
    fullDescription:
      "The GlideFit E900 delivers a smooth, low-impact workout with its 21-inch stride length and self-generating power system. Features 25 resistance levels, 12 preset programs, and heart rate monitoring through handlebar sensors and wireless chest strap compatibility. The ergonomic moving handlebars provide an effective upper body workout while the oversized pedals ensure comfortable foot placement.",
    price: 175000,
    mainCategory: "commercial",
    subCategory: "elliptical-trainers",
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600",
    ],
    specifications: {
      "Stride Length": "21 inches",
      Resistance: "25 Levels (ECB Magnetic)",
      Programs: "12 Preset + 4 Custom",
      Power: "Self-Generating",
      Display: '10" LCD Backlit',
      "Max User Weight": "170 kg",
      "Heart Rate": "Contact + Wireless",
      Warranty: "3 Years Comprehensive",
    },
    inStock: false,
    createdAt: Timestamp.now(),
  },
  // === DOMESTIC TREADMILLS ===
  {
    name: "HomeFit T200 Foldable Treadmill",
    shortDescription: "Compact foldable treadmill for home use",
    fullDescription:
      "The HomeFit T200 is the perfect home treadmill that folds flat for easy storage. Despite its compact design, it features a 2.5HP peak motor, 16-inch running belt, and speeds up to 14 km/h. The soft-drop hydraulic system makes folding and unfolding safe and effortless. Bluetooth speakers and tablet holder make your home workouts entertaining.",
    price: 32000,
    mainCategory: "domestic",
    subCategory: "treadmills",
    images: [
      "https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=600",
    ],
    specifications: {
      Motor: "2.5 HP Peak DC Motor",
      "Speed Range": "1 - 14 km/h",
      Incline: "3-Level Manual",
      "Belt Size": '16" x 48"',
      "Max User Weight": "110 kg",
      Display: "5-inch LCD",
      Foldable: "Yes (Hydraulic Soft-Drop)",
      Warranty: "1 Year Comprehensive",
    },
    inStock: true,
    createdAt: Timestamp.now(),
  },
  {
    name: "RunElite R400 Home Treadmill",
    shortDescription: "Feature-rich home treadmill with auto incline",
    fullDescription:
      "The RunElite R400 brings gym-quality features to your home. With a 3HP continuous duty motor, automatic incline up to 12%, and a spacious 18-inch running belt, it handles everything from walking to intense running. The 7-inch touchscreen display connects to popular fitness apps and provides real-time workout metrics. Built-in fan and Bluetooth audio enhance your exercise experience.",
    price: 55000,
    mainCategory: "domestic",
    subCategory: "treadmills",
    images: [
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600",
    ],
    specifications: {
      Motor: "3 HP Continuous Duty",
      "Speed Range": "0.5 - 18 km/h",
      Incline: "0-12% Automatic",
      "Belt Size": '18" x 52"',
      "Max User Weight": "130 kg",
      Display: '7" Touchscreen',
      Connectivity: "Bluetooth, WiFi",
      Warranty: "2 Years Motor, 1 Year Parts",
    },
    inStock: true,
    createdAt: Timestamp.now(),
  },
  // === DOMESTIC BIKES ===
  {
    name: "SpinHome X1 Exercise Bike",
    shortDescription: "Quiet magnetic resistance bike for home",
    fullDescription:
      "The SpinHome X1 brings the cycling studio experience to your living room. Its whisper-quiet magnetic resistance system won't disturb family members. Features a comfortable padded seat with horizontal and vertical adjustment, anti-slip pedals with toe cages, and a simple LCD monitor tracking time, speed, distance, and calories. The compact footprint makes it ideal for apartments and small spaces.",
    price: 18000,
    mainCategory: "domestic",
    subCategory: "bikes",
    images: [
      "https://images.unsplash.com/photo-1591741535018-d08648b3f373?w=600",
    ],
    specifications: {
      "Flywheel Weight": "8 kg",
      Resistance: "8-Level Magnetic",
      "Drive System": "Belt Drive",
      "Seat Adjustment": "4-Way Adjustable",
      Display: "Basic LCD",
      "Max User Weight": "120 kg",
      Weight: "28 kg",
      Warranty: "1 Year Comprehensive",
    },
    inStock: true,
    createdAt: Timestamp.now(),
  },
];

async function seedFirestore() {
  console.log("🚀 Starting Firestore seed...\n");

  const productsRef = collection(db, "products");

  for (const product of DUMMY_PRODUCTS) {
    try {
      const docRef = await addDoc(productsRef, product);
      console.log(
        `✅ Added: ${product.name} (${product.mainCategory}/${product.subCategory}) → ${docRef.id}`
      );
    } catch (error) {
      console.error(`❌ Failed to add ${product.name}:`, error);
    }
  }

  console.log("\n🎉 Seeding complete!");
  process.exit(0);
}

seedFirestore();
