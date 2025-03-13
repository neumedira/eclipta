// src/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { About } from "./types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Cek apakah semua variabel lingkungan Firebase sudah diisi
const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => !!value
);

// Initialize Firebase hanya jika semua variabel lingkungan sudah diisi
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
const db = isFirebaseConfigured ? getFirestore(app) : null;

// Fungsi untuk menginisialisasi data dummy
const initializeFirebaseData = async () => {
  if (!db) {
    console.error("Firebase is not configured properly.");
    return;
  }

  const aboutCollection = collection(db, "about");
  const querySnapshot = await getDocs(aboutCollection);

  // Jika koleksi 'about' kosong, tambahkan data dummy
  if (querySnapshot.empty) {
    const dummyAbout: About = {
      shortName: "John Doe",
      fullName: "John Doe",
      job: "Software Engineer",
      workplace: "Tech Company",
      profileImage: "https://i.pravatar.cc/500",
      socialMedia: {
        email: "john.doe@example.com",
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
        instagram: "https://instagram.com/johndoe",
      },
      description:
        "I am a passionate software engineer with experience in building web applications.",
      experiences: [],
      educations: [],
      techStack: [],
      interests: [],
    };

    // Tambahkan data dummy ke dokumen dengan ID 'about'
    await setDoc(doc(db, "about", "about"), dummyAbout);
    console.log("Dummy data initialized successfully.");
  }
};

// Ekspor fungsi inisialisasi
export {
  db,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  isFirebaseConfigured,
  initializeFirebaseData,
};
