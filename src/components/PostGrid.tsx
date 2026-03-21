import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { Calendar, ArrowLeft, Eye } from 'lucide-react';

interface PostGridProps {
  category?: string;
  limit?: number;
}

export const PostGrid = ({ category, limit }: PostGridProps) => {
  const { posts, loading } = usePosts();

  if (loading) {
    return <div className="text-center py-20 text-gray-500">جاري تحميل المقالات...</div>;
  }

  const filteredPosts = category 
    ? posts.filter(post => post.category === category)
    : posts;

  const displayedPosts = limit ? filteredPosts.slice(0, limit) : filteredPosts;

  if (displayedPosts.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 font-bold">لا توجد مقالات في هذا القسم حالياً.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayedPosts.map(post => (
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
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{post.date || '2026-03-19'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye size={14} />
                <span>{post.views || 0} مشاهدة</span>
              </div>
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
