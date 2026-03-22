import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { usePosts } from '../hooks/usePosts';
import { Info, ChevronDown, Share2, Eye } from 'lucide-react';
import { Comments } from '../components/Comments';

import ReactMarkdown from 'react-markdown';

export const Post = () => {
  const { id } = useParams();
  const { posts, loading } = usePosts();
  const post = posts.find(p => p.id === id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const incrementViews = async () => {
        try {
          const postRef = doc(db, 'posts', id);
          await updateDoc(postRef, {
            views: increment(1)
          });
        } catch (error) {
          console.error("Error incrementing views:", error);
        }
      };
      incrementViews();
    }
  }, [id]);

  useEffect(() => {
    // Unique visitor tracking
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('visitorId', visitorId);
      // Track new unique visitor
      const trackUniqueVisitor = async () => {
        try {
          await addDoc(collection(db, 'unique_visitors'), {
            visitorId,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error("Error tracking unique visitor:", error);
        }
      };
      trackUniqueVisitor();
    }
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50" dir="rtl">
        <h1 className="text-4xl font-black text-gray-900 mb-4">المقال غير موجود</h1>
        <Link to="/" className="text-indigo-600 font-bold hover:underline">العودة للرئيسية</Link>
      </div>
    );
  }

  const categoryMap: Record<string, { label: string; to: string }> = {
    'freelancing': { label: 'العمل الحر', to: '/freelancing' },
    'digital-marketing': { label: 'التسويق الرقمي', to: '/digital-marketing' },
    'ecommerce': { label: 'التجارة الإلكترونية', to: '/ecommerce' },
    'digital-investments': { label: 'الاستثمارات الرقمية', to: '/digital-investments' },
    'tools': { label: 'أدوات', to: '/tools' },
  };

  const category = categoryMap[post.category] || { label: 'المقالات', to: '/' };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Helmet>
        <title>{post.title} | اربح</title>
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        <meta property="og:image" content={post.image || `https://picsum.photos/seed/${post.id}/1200/600`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.summary} />
        <meta name="twitter:image" content={post.image || `https://picsum.photos/seed/${post.id}/1200/600`} />
      </Helmet>
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: category.label, to: category.to },
            { label: post.title, to: `/post/${post.id}` }
          ]} 
        />

        {/* Post Header */}
        <div className="mb-8">
          <Link to="#" className="text-blue-600 font-medium hover:underline mb-4 block">
            الكشف عن المعلن
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-gray-500 text-sm mb-8">
            <p>تم التحديث بتاريخ 19/3/2026</p>
            <div className="flex items-center gap-1.5">
              <Eye size={16} />
              <span>{post.views?.toLocaleString()} مشاهدة</span>
            </div>
          </div>

          {/* Author Card */}
          <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between border border-gray-100 mb-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full blur opacity-25"></div>
                <div className="relative bg-white p-2 rounded-full shadow-sm border border-gray-100">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">بواسطة</span>
                  <span className="font-bold text-gray-800 text-lg">اربح</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <span>منصة تعليمية</span>
                  <Info size={14} />
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-gray-800 font-medium cursor-pointer">
              <span>فريق التحرير</span>
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-12 markdown-content">
          <img 
            src={post.image || `https://picsum.photos/seed/${post.id}/1200/600`} 
            alt={post.title} 
            className="w-full rounded-2xl mb-8 shadow-lg"
          />
          <div className="text-xl text-gray-700 leading-relaxed font-bold mb-8 border-r-4 border-indigo-600 pr-4 py-2 bg-indigo-50/30">
            {post.summary}
          </div>
          <div className="markdown-body text-gray-700 leading-relaxed">
            <ReactMarkdown>{post.content || ''}</ReactMarkdown>
          </div>
        </div>

        {/* Share Section at the end of post */}
        <div className="border-t border-gray-100 pt-10 mb-16">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">هل أعجبك المقال؟ شاركه مع أصدقائك</h3>
            <button 
              onClick={handleShare}
              className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              <Share2 size={20} />
              <span>مشاركة المقال الآن</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <Comments postId={post.id} />

        {/* Suggested Posts Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-black text-gray-900">مقالات قد تهمك</h2>
            <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts
              .filter(p => p.id !== post.id)
              .sort(() => Math.random() - 0.5)
              .slice(0, 10)
              .map(suggestedPost => (
                <Link 
                  to={`/post/${suggestedPost.id}`} 
                  key={suggestedPost.id}
                  className="group flex gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl">
                    <img 
                      src={suggestedPost.image || `https://picsum.photos/seed/${suggestedPost.id}/200/200`} 
                      alt={suggestedPost.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-1">
                      {suggestedPost.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Eye size={12} />
                      <span>{suggestedPost.views} مشاهدة</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};
