import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePosts } from '../hooks/usePosts';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const Search = () => {
  const navigate = useNavigate();
  const { posts, loading } = usePosts();
  const [query, setQuery] = useState('');
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.summary.toLowerCase().includes(query.toLowerCase()) ||
    post.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Helmet>
        <title>البحث | اربح</title>
        <meta name="description" content="ابحث عن أفضل المقالات والدورات للربح من الإنترنت في منصة اربح." />
        <meta property="og:title" content="البحث - منصة اربح" />
      </Helmet>
      <Header toggleSidebar={() => {}} />
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium"
        >
          <ArrowRight size={20} />
          <span>الرجوع للخلف</span>
        </button>
        <div className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مقال..."
            className="w-full p-4 pr-12 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <SearchIcon className="absolute right-4 top-4 text-gray-400" />
        </div>
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">جاري التحميل...</p>
          ) : query.length > 0 && filteredPosts.length === 0 ? (
            <p className="text-center text-gray-500">لا توجد نتائج مطابقة.</p>
          ) : (
            filteredPosts.map(post => (
              <Link key={post.id} to={`/post/${post.id}`} className="block bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600">{post.summary}</p>
              </Link>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
