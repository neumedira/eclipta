import { useState, useEffect } from 'react';
import { db, doc, getDoc } from '../firebase';
import { About } from '../types';

const CACHE_KEY = 'aboutData';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 1 hari dalam milidetik

const useAboutData = () => {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // Cek apakah data ada di localStorage dan belum kadaluarsa
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(`${CACHE_KEY}_timestamp`);
        const now = new Date().getTime();

        if (cachedData && cachedTime && now - parseInt(cachedTime) < CACHE_EXPIRY_TIME) {
          // Gunakan data dari cache
          setAbout(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        // Jika tidak ada cache atau cache sudah kadaluarsa, fetch data dari Firebase
        const aboutDocRef = doc(db, 'about', 'about');
        const aboutDoc = await getDoc(aboutDocRef);

        if (aboutDoc.exists()) {
          const data = aboutDoc.data() as About;
          setAbout(data);
          // Simpan data dan timestamp ke localStorage
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          localStorage.setItem(`${CACHE_KEY}_timestamp`, now.toString());
        } else {
          setError('No such document!');
        }
      } catch (error) {
        setError('Error getting document: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  return { about, loading, error };
};

export default useAboutData;