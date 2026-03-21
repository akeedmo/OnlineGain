import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function SiteIntegrations() {
  useEffect(() => {
    const fetchAndInject = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'site'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Google Site Verification
          if (data.googleSiteVerification) {
            let meta = document.querySelector('meta[name="google-site-verification"]');
            if (!meta) {
              meta = document.createElement('meta');
              meta.setAttribute('name', 'google-site-verification');
              document.head.appendChild(meta);
            }
            meta.setAttribute('content', data.googleSiteVerification);
          }

          // Google AdSense
          if (data.adsenseClientId) {
            const scriptId = 'adsense-script';
            if (!document.getElementById(scriptId)) {
              const script = document.createElement('script');
              script.id = scriptId;
              script.async = true;
              script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${data.adsenseClientId}`;
              script.crossOrigin = 'anonymous';
              document.head.appendChild(script);
            }
          }

          // Google Analytics
          if (data.googleAnalyticsId) {
            const scriptId = 'ga-script';
            if (!document.getElementById(scriptId)) {
              const script = document.createElement('script');
              script.id = scriptId;
              script.async = true;
              script.src = `https://www.googletagmanager.com/gtag/js?id=${data.googleAnalyticsId}`;
              document.head.appendChild(script);

              const inlineScript = document.createElement('script');
              inlineScript.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${data.googleAnalyticsId}');
              `;
              document.head.appendChild(inlineScript);
            }
          }

          // Sitemap link
          let sitemapLink = document.querySelector('link[rel="sitemap"]');
          if (!sitemapLink) {
            sitemapLink = document.createElement('link');
            sitemapLink.setAttribute('rel', 'sitemap');
            sitemapLink.setAttribute('type', 'application/xml');
            sitemapLink.setAttribute('href', '/sitemap.xml');
            document.head.appendChild(sitemapLink);
          }
        }
      } catch (error) {
        console.error("Error loading site integrations:", error);
      }
    };
    fetchAndInject();
  }, []);

  return null;
}
