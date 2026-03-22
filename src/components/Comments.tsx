import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Star, Send } from 'lucide-react';

interface Comment {
  id: string;
  postId: string;
  authorName: string;
  text: string;
  rating: number;
  createdAt: string;
  status: string;
}

export const Comments = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments: Comment[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Comment;
        if (data.status === 'approved') {
          fetchedComments.push({ id: doc.id, ...data });
        }
      });
      // Sort by createdAt desc on client side
      fetchedComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComments(fetchedComments);
    }, (error) => {
      console.error("Error in onSnapshot:", error);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !text.trim()) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        authorName: authorName.trim(),
        text: text.trim(),
        rating,
        createdAt: new Date().toISOString(),
        status: 'pending' // Requires admin approval
      });
      
      setAuthorName('');
      setText('');
      setRating(5);
      setMessage('تم إرسال تعليقك بنجاح! سيتم نشره بعد المراجعة.');
    } catch (error) {
      console.error("Error adding comment:", error);
      setMessage('حدث خطأ أثناء إرسال التعليق.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="text-2xl font-black text-gray-900 mb-6">التعليقات والتقييمات</h3>
      
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-2xl">
        <h4 className="text-lg font-bold text-gray-800 mb-4">أضف تعليقك</h4>
        
        {message && (
          <div className={`p-4 rounded-xl mb-4 text-sm font-medium ${message.includes('خطأ') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="اسمك الكريم"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">التقييم</label>
            <div className="flex items-center gap-2 h-[50px]">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">التعليق</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            placeholder="شاركنا رأيك..."
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          <Send size={18} />
          {isSubmitting ? 'جاري الإرسال...' : 'إرسال التعليق'}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">لا توجد تعليقات حتى الآن. كن أول من يعلق!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {comment.authorName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">{comment.authorName}</h5>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < comment.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mt-3 leading-relaxed">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
