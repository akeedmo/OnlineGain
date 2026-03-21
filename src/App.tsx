/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';
import { Home } from './pages/Home';
import { Post } from './pages/Post';
import { Freelancing } from './pages/Freelancing';
import { DigitalMarketing } from './pages/DigitalMarketing';
import { Ecommerce } from './pages/Ecommerce';
import { DigitalInvestments } from './pages/DigitalInvestments';
import { Tools } from './pages/Tools';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { Sitemap } from './pages/Sitemap';
import ScrollToTop from './components/ScrollToTop';
import { AnalyticsTracker } from './components/AnalyticsTracker';
import { SiteIntegrations } from './components/SiteIntegrations';
import { APIProvider } from '@vis.gl/react-google-maps';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

export default function App() {
  return (
    <HelmetProvider>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
        <LanguageProvider>
          <SiteIntegrations />
          <BrowserRouter>
            <AnalyticsTracker />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post/:id" element={<Post />} />
              <Route path="/freelancing" element={<Freelancing />} />
              <Route path="/digital-marketing" element={<DigitalMarketing />} />
              <Route path="/ecommerce" element={<Ecommerce />} />
              <Route path="/digital-investments" element={<DigitalInvestments />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/sitemap.xml" element={<Sitemap />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </APIProvider>
    </HelmetProvider>
  );
}
