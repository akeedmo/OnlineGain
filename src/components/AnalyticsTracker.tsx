import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Simple IP API to get country (free tier, no key needed for basic usage)
        let country = 'Unknown';
        let city = 'Unknown';
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
          clearTimeout(timeoutId);
          const data = await response.json();
          if (data.country_name) country = data.country_name;
          if (data.city) city = data.city;
        } catch (e) {
          // Silently fail if location data cannot be fetched
        }

        // Extract potential search terms or interests from path
        const path = location.pathname;
        const interests = [];
        if (path.includes('freelancing')) interests.push('العمل الحر');
        if (path.includes('digital-marketing')) interests.push('التسويق الرقمي');
        if (path.includes('ecommerce')) interests.push('التجارة الإلكترونية');
        if (path.includes('digital-investments')) interests.push('الاستثمارات الرقمية');
        if (path.includes('tools')) interests.push('أدوات الذكاء الاصطناعي');

        await addDoc(collection(db, 'visits'), {
          path,
          country,
          city,
          interests,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error tracking visit:", error);
      }
    };

    // Only track if not admin page
    if (!location.pathname.startsWith('/admin')) {
      trackVisit();
    }
  }, [location]);

  return null;
}
