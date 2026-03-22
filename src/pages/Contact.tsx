import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:qydalrfyd@gmail.com?subject=Contact from ${formData.name}&body=${formData.message}`;
  };

  const center = { lat: 24.7136, lng: 46.6753 }; // Riyadh, Saudi Arabia as a placeholder

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Helmet>
        <title>اتصل بنا | اربح</title>
        <meta name="description" content="نحن هنا لمساعدتك في رحلتك للربح من الإنترنت. تواصل معنا لأي استفسار أو اقتراح." />
        <meta property="og:title" content="اتصل بنا - منصة اربح" />
        <meta property="og:description" content="تواصل مع فريق منصة اربح للحصول على الدعم والمساعدة." />
      </Helmet>
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <Breadcrumbs items={[{ label: 'الرئيسية', to: '/' }, { label: 'اتصل بنا', to: '/contact' }]} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
          {/* Contact Info & Form */}
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-6">تواصل معنا</h1>
            <p className="text-gray-500 text-lg mb-12">
              نحن هنا لمساعدتك في رحلتك للربح من الإنترنت. إذا كان لديك أي استفسار أو اقتراح، لا تتردد في مراسلتنا.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">البريد الإلكتروني</p>
                  <a href="mailto:qydalrfyd@gmail.com" className="text-lg font-bold text-gray-800 hover:text-indigo-600">qydalrfyd@gmail.com</a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">المقر الرئيسي</p>
                  <p className="text-lg font-bold text-gray-800">الرياض، المملكة العربية السعودية</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="اسمك الكامل"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الرسالة</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="كيف يمكننا مساعدتك؟"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                <Send size={20} />
                إرسال الرسالة
              </button>
            </form>
          </div>

          {/* Map Section */}
          <div className="h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative">
            <Map
              defaultCenter={center}
              defaultZoom={13}
              mapId="DEMO_MAP_ID"
              {...({ internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'] } as any)}
              style={{ width: '100%', height: '100%' }}
            >
              <AdvancedMarker position={center}>
                <Pin background="#4f46e5" glyphColor="#fff" borderColor="#312e81" />
              </AdvancedMarker>
            </Map>
            
            {/* Map Overlay Info */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
              <h3 className="font-black text-indigo-900 mb-2">مكتب اربح الرئيسي</h3>
              <p className="text-sm text-indigo-700/70 leading-relaxed">
                تفضل بزيارتنا في مقرنا الرئيسي لمناقشة فرص التعاون والنمو في العالم الرقمي.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
