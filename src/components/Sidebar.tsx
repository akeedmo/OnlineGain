import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { X, ChevronLeft, Search } from 'lucide-react';
import ar from '../locales/ar.json';
import en from '../locales/en.json';
import tr from '../locales/tr.json';

const translations = { ar, en, tr };

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { language, setLanguage } = useLanguage();
  const t = translations[language].nav;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 border-2 border-black rounded-md">
            <X size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl blur opacity-25"></div>
              <div className="relative bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700 tracking-tighter">اربح</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl blur opacity-30"></div>
            <div className="relative bg-white border border-indigo-100 px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700">اربح</span>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col">
        {[
          { to: "/", label: t.home },
          { to: "/freelancing", label: t.freelancing },
          { to: "/digital-marketing", label: t.digitalMarketing },
          { to: "/ecommerce", label: t.ecommerce },
          { to: "/digital-investments", label: t.digitalInvestments },
          { to: "/tools", label: t.tools },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className="flex items-center justify-between p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-medium text-gray-800">{item.label}</span>
            <ChevronLeft size={20} className="text-gray-400" />
          </Link>
        ))}
      </nav>

      {/* Language Selector at bottom */}
      <div className="mt-auto p-6 bg-gray-50">
        <p className="text-sm text-gray-500 mb-2 text-right">اختر اللغة</p>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
          className="w-full p-3 border border-gray-200 rounded-lg bg-white appearance-none text-right"
        >
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="tr">Türkçe</option>
        </select>
      </div>
    </div>
  );
};
