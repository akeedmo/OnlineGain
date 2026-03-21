import { useLanguage } from '../context/LanguageContext';
import ar from '../locales/ar.json';
import en from '../locales/en.json';
import tr from '../locales/tr.json';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const translations = { ar, en, tr };

export const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language].nav;

  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl blur opacity-25"></div>
                <div className="relative bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700 tracking-tighter">اربح</span>
            </Link>
            <p className="text-gray-500 max-w-sm leading-relaxed mb-6">
              {language === 'ar' ? 'منصة اربح هي دليلك الأول لتعلم طرق الربح من الإنترنت والعمل الحر والتجارة الإلكترونية بأحدث الاستراتيجيات.' : 
               'Arbah platform is your first guide to learning online earning methods, freelancing, and e-commerce with the latest strategies.'}
            </p>
            <div className="flex items-center gap-4">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-white rounded-lg text-gray-400 hover:text-indigo-600 shadow-sm transition-colors"
                title="مشاركة على فيسبوك"
              >
                <Facebook size={20} />
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent('تعلم الربح من الانترنت 2026 - منصة اربح')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-white rounded-lg text-gray-400 hover:text-indigo-600 shadow-sm transition-colors"
                title="مشاركة على تويتر"
              >
                <Twitter size={20} />
              </a>
              <a 
                href={`https://www.instagram.com/`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-white rounded-lg text-gray-400 hover:text-indigo-600 shadow-sm transition-colors"
                title="تابعنا على إنستجرام"
              >
                <Instagram size={20} />
              </a>
              <a 
                href={`https://www.youtube.com/`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-white rounded-lg text-gray-400 hover:text-indigo-600 shadow-sm transition-colors"
                title="اشترك في قناتنا"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-6">{language === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm">
              <li><Link to="/" className="hover:text-indigo-600 transition-colors">{t.home}</Link></li>
              <li><Link to="/freelancing" className="hover:text-indigo-600 transition-colors">{t.freelancing}</Link></li>
              <li><Link to="/digital-marketing" className="hover:text-indigo-600 transition-colors">{t.digitalMarketing}</Link></li>
              <li><Link to="/ecommerce" className="hover:text-indigo-600 transition-colors">{t.ecommerce}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">{language === 'ar' ? 'الدعم' : 'Support'}</h4>
            <ul className="flex flex-col gap-4 text-gray-500 text-sm">
              <li><a href="mailto:qydalrfyd@gmail.com" className="hover:text-indigo-600 transition-colors">{language === 'ar' ? 'اتصل بنا' : 'Contact Us'}</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">{language === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}</a></li>
              <li><Link to="/admin" className="hover:text-indigo-600 transition-colors">{language === 'ar' ? 'لوحة المشرف' : 'Admin Panel'}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 text-center text-gray-400 text-xs">
          <p>&copy; 2026 اربح. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};
