import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ar from '../locales/ar.json';
import en from '../locales/en.json';
import tr from '../locales/tr.json';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

const translations = { ar, en, tr };

export const HeroSection = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <section className="relative py-24 px-6 overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800 text-white mb-16">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold mb-8 border border-white/20 animate-bounce">
          <Sparkles size={16} className="text-amber-300" />
          <span>{language === 'ar' ? 'دليلك الشامل للربح من الإنترنت' : 'Your complete guide to online earning'}</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
          {t.title}
        </h1>
        
        <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          {t.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/freelancing" 
            className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-900/20 transition-all active:scale-95 text-center"
          >
            {t.cta}
          </Link>
          <Link 
            to="/tools" 
            className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all text-center"
          >
            {language === 'ar' ? 'تصفح الأدوات' : 'Browse Tools'}
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-16 pt-16 border-t border-white/10">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white/10 p-3 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">استثمارات</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white/10 p-3 rounded-2xl">
              <Zap size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">سرعة</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white/10 p-3 rounded-2xl">
              <Sparkles size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">ذكاء</span>
          </div>
        </div>
      </div>
    </section>
  );
};
