import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PostGrid } from '../components/PostGrid';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const Freelancing = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>العمل الحر | اربح</title>
        <meta name="description" content="اكتشف أفضل الطرق والمنصات للبدء في مسيرتك المهنية المستقلة والربح من مهاراتك." />
        <meta property="og:title" content="العمل الحر - منصة اربح" />
        <meta property="og:description" content="دليلك الشامل للنجاح في العمل الحر والربح من الإنترنت." />
      </Helmet>
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <Breadcrumbs 
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'العمل الحر', to: '/freelancing' }
          ]} 
        />
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">العمل الحر</h1>
          <p className="text-gray-500 text-lg">اكتشف أفضل الطرق والمنصات للبدء في مسيرتك المهنية المستقلة.</p>
        </div>
        <PostGrid category="freelancing" />
      </main>
      <Footer />
    </div>
  );
};
