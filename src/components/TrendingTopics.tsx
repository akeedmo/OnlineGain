import { Link } from 'react-router-dom';
import { posts } from '../data/posts';
import { Calendar, ArrowLeft } from 'lucide-react';

export const TrendingTopics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map(post => (
        <Link 
          to={`/post/${post.id}`} 
          key={post.id} 
          className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 hover:-translate-y-2"
        >
          <div className="relative h-56 overflow-hidden">
            <img 
              src={post.image || `https://picsum.photos/seed/${post.id}/800/450`} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
              {post.category === 'freelancing' ? 'العمل الحر' : 
               post.category === 'digital-marketing' ? 'التسويق الرقمي' :
               post.category === 'ecommerce' ? 'التجارة الإلكترونية' :
               post.category === 'digital-investments' ? 'الاستثمارات' : 'أدوات'}
            </div>
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
              <Calendar size={14} />
              <span>{post.date || '2026-03-19'}</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
              {post.title}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">
              {post.summary}
            </p>
            <div className="mt-auto flex items-center gap-2 text-indigo-600 font-bold text-sm group-hover:gap-4 transition-all">
              <span>اقرأ المزيد</span>
              <ArrowLeft size={16} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
