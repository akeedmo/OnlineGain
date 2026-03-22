import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Menu, Search } from 'lucide-react';
import ar from '../locales/ar.json';
import en from '../locales/en.json';
import tr from '../locales/tr.json';

const translations = { ar, en, tr };

export const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { language } = useLanguage();
  const t = translations[language].nav;

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 border-2 border-black rounded-md md:hidden">
          <Menu size={24} />
        </button>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white p-2 rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700 tracking-tighter hidden sm:inline">{t.websiteName}</span>
        </Link>
      </div>
      
      <nav className="hidden lg:flex gap-6 text-gray-700 font-medium">
        <Link to="/" className="hover:text-indigo-600 transition-colors">{t.home}</Link>
        <Link to="/freelancing" className="hover:text-indigo-600 transition-colors">{t.freelancing}</Link>
        <Link to="/digital-marketing" className="hover:text-indigo-600 transition-colors">{t.digitalMarketing}</Link>
        <Link to="/ecommerce" className="hover:text-indigo-600 transition-colors">{t.ecommerce}</Link>
        <Link to="/digital-investments" className="hover:text-indigo-600 transition-colors">{t.digitalInvestments}</Link>
        <Link to="/tools" className="hover:text-indigo-600 transition-colors">{t.tools}</Link>
      </nav>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link to="/search" className="p-2 text-gray-700 hover:text-indigo-600 transition-colors">
          <Search size={20} />
        </Link>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative bg-white border border-indigo-100 px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700">{t.websiteName}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  );
};
