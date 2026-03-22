import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { HeroSection } from '../components/HeroSection';
import { Sidebar } from '../components/Sidebar';
import { PostGrid } from '../components/PostGrid';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

import { usePosts } from '../hooks/usePosts';
import { Eye, TrendingUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Newsletter } from '../components/Newsletter';

export const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [visiblePostsCount, setVisiblePostsCount] = useState(12);
  const { posts, loading } = usePosts();

  const trendingPosts = [...posts]
    .filter(p => (p.views || 0) >= 10000)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  const handleLoadMore = () => {
    setVisiblePostsCount(prev => prev + 10);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>اربح - منصتك الشاملة للربح من الإنترنت والعمل الحر</title>
        <meta name="description" content="اربح هي منصتك الشاملة لتعلم طرق الربح من الإنترنت، العمل الحر، التسويق بالعمولة، والتجارة الإلكترونية. ابدأ رحلتك نحو الاستقلال المالي اليوم." />
        <meta property="og:site_name" content="اربح" />
        <meta property="og:title" content="اربح - منصتك للربح من الإنترنت والعمل الحر" />
        <meta property="og:description" content="تعلم طرق الربح من الإنترنت، العمل الحر، والتجارة الإلكترونية. ابدأ رحلتك نحو الاستقلال المالي اليوم." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&h=630&q=80" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={window.location.origin} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="اربح - منصتك للربح من الإنترنت" />
        <meta name="twitter:description" content="تعلم طرق الربح من الإنترنت، العمل الحر، والتجارة الإلكترونية. ابدأ رحلتك نحو الاستقلال المالي اليوم." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&h=630&q=80" />
        <link rel="canonical" href={window.location.origin} />
      </Helmet>
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <HeroSection />
        
        {/* Trending Section - Only visible if there are posts with >= 10000 views */}
        {trendingPosts.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-3xl font-black text-gray-900">الأكثر قراءة</h2>
              <div className="h-1 flex-1 mx-8 bg-gray-100 rounded-full hidden sm:block"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trendingPosts.map((post, index) => (
                <Link 
                  to={`/post/${post.id}`} 
                  key={post.id}
                  className="group relative bg-white p-6 rounded-[2rem] border border-gray-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 text-8xl font-black text-gray-50 -mr-4 -mt-4 group-hover:text-indigo-50 transition-colors">
                    0{index + 1}
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4">
                      <Eye size={14} />
                      <span>{post.views} مشاهدة</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {post.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-gray-900">أحدث المقالات</h2>
            <div className="h-1 flex-1 mx-8 bg-gray-100 rounded-full hidden sm:block"></div>
          </div>
          <PostGrid limit={visiblePostsCount} />
          
          {visiblePostsCount < posts.length && (
            <div className="mt-16 flex justify-center">
              <button 
                onClick={handleLoadMore}
                className="group flex flex-col items-center gap-3 text-gray-500 hover:text-indigo-600 transition-all duration-300"
              >
                <span className="font-bold text-sm uppercase tracking-widest">عرض المزيد من المقالات</span>
                <div className="bg-white p-4 rounded-full border border-gray-100 shadow-lg group-hover:shadow-indigo-100 group-hover:-translate-y-1 transition-all">
                  <ChevronDown size={24} className="group-hover:animate-bounce" />
                </div>
              </button>
            </div>
          )}
        </section>

        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};
