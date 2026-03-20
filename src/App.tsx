/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Home } from './pages/Home';
import { Post } from './pages/Post';
import { Freelancing } from './pages/Freelancing';
import { DigitalMarketing } from './pages/DigitalMarketing';
import { Ecommerce } from './pages/Ecommerce';
import { DigitalInvestments } from './pages/DigitalInvestments';
import { Tools } from './pages/Tools';
import { Contact } from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import { APIProvider } from '@vis.gl/react-google-maps';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

export default function App() {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
      <LanguageProvider>
        <BrowserRouter>
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
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </APIProvider>
  );
}
