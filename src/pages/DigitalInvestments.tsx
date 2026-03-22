import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PostGrid } from '../components/PostGrid';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const DigitalInvestments = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>الاستثمارات الرقمية | اربح</title>
        <meta name="description" content="استثمر أموالك بذكاء في الأصول الرقمية والعملات المشفرة." />
        <meta property="og:title" content="الاستثمارات الرقمية - منصة اربح" />
        <meta property="og:description" content="دليلك الشامل للاستثمار في الأصول الرقمية والعملات المشفرة." />
      </Helmet>
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <Breadcrumbs 
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'الاستثمارات الرقمية', to: '/digital-investments' }
          ]} 
        />
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">الاستثمارات الرقمية</h1>
          <p className="text-gray-500 text-lg">استثمر أموالك بذكاء في الأصول الرقمية والعملات المشفرة.</p>
        </div>
        <PostGrid category="digital-investments" />
      </main>
      <Footer />
    </div>
  );
};
