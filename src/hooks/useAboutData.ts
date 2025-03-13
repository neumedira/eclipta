import { useState, useEffect } from "react";
import { db, doc, getDoc, isFirebaseConfigured } from "../firebase";
import { About } from "../types";

// Data Dummy
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

const CACHE_KEY = "aboutData";
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 1 hari dalam milidetik

const useAboutData = () => {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // Jika Firebase tidak dikonfigurasi, gunakan data dummy
        if (!isFirebaseConfigured) {
          setAbout(dummyAbout);
          setLoading(false);
          return;
        }

        // Cek apakah data ada di localStorage dan belum kadaluarsa
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(`${CACHE_KEY}_timestamp`);
        const now = new Date().getTime();

        if (
          cachedData &&
          cachedTime &&
          now - parseInt(cachedTime) < CACHE_EXPIRY_TIME
        ) {
          // Gunakan data dari cache
          setAbout(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        // Jika tidak ada cache atau cache sudah kadaluarsa, fetch data dari Firebase
        const aboutDocRef = doc(db, "about", "about");
        const aboutDoc = await getDoc(aboutDocRef);

        if (aboutDoc.exists()) {
          const data = aboutDoc.data() as About;
          setAbout(data);
          // Simpan data dan timestamp ke localStorage
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          localStorage.setItem(`${CACHE_KEY}_timestamp`, now.toString());
        } else {
          // Jika dokumen tidak ditemukan, gunakan data dummy
          setAbout(dummyAbout);
          localStorage.setItem(CACHE_KEY, JSON.stringify(dummyAbout));
          localStorage.setItem(`${CACHE_KEY}_timestamp`, now.toString());
        }
      } catch (error) {
        // Jika terjadi error, gunakan data dummy
        setAbout(dummyAbout);
        setError("Error getting document: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  return { about, loading, error };
};

export default useAboutData;
