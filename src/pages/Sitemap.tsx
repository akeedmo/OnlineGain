import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function Sitemap() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'site'));
        if (docSnap.exists()) {
          setContent(docSnap.data().sitemapContent || '');
        }
      } catch (error) {
        console.error("Error fetching sitemap:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSitemap();
  }, []);

  useEffect(() => {
    if (!loading) {
      document.body.innerHTML = `<pre>${content}</pre>`;
      document.body.style.whiteSpace = 'pre-wrap';
      document.body.style.padding = '20px';
    }
  }, [content, loading]);

  if (loading) return null;

  return null;
}
