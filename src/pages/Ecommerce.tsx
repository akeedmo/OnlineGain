import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PostGrid } from '../components/PostGrid';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const Ecommerce = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <Breadcrumbs 
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'التجارة الإلكترونية', to: '/ecommerce' }
          ]} 
        />
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">التجارة الإلكترونية</h1>
          <p className="text-gray-500 text-lg">كل ما تحتاجه لإنشاء وإدارة متجر إلكتروني ناجح ومربح.</p>
        </div>
        <PostGrid category="ecommerce" />
      </main>
      <Footer />
    </div>
  );
};
