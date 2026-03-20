import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PostGrid } from '../components/PostGrid';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const DigitalMarketing = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <Breadcrumbs 
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'التسويق الرقمي', to: '/digital-marketing' }
          ]} 
        />
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">التسويق الرقمي</h1>
          <p className="text-gray-500 text-lg">تعلم أحدث استراتيجيات التسويق عبر الإنترنت لزيادة مبيعاتك وانتشارك.</p>
        </div>
        <PostGrid category="digital-marketing" />
      </main>
      <Footer />
    </div>
  );
};
