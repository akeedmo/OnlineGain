import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Mail, CheckCircle2 } from 'lucide-react';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    setMessage('');

    try {
      // Check if already subscribed
      const q = query(collection(db, 'subscribers'), where('email', '==', email.toLowerCase()));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setStatus('error');
        setMessage('أنت مشترك بالفعل في القائمة البريدية!');
        return;
      }

      await addDoc(collection(db, 'subscribers'), {
        email: email.toLowerCase(),
        subscribedAt: new Date().toISOString(),
        status: 'active'
      });

      setStatus('success');
      setEmail('');
      setMessage('تم الاشتراك بنجاح! شكراً لانضمامك إلينا.');
    } catch (error) {
      console.error("Error subscribing:", error);
      setStatus('error');
      setMessage('حدث خطأ أثناء الاشتراك. يرجى المحاولة لاحقاً.');
    }
  };

  return (
    <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden my-16">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900 opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <h3 className="text-3xl font-black mb-4">اشترك في القائمة البريدية</h3>
          <p className="text-indigo-100 text-lg max-w-md">
            احصل على أحدث المقالات والنصائح الحصرية حول العمل الحر والتسويق الرقمي مباشرة في بريدك الإلكتروني.
          </p>
        </div>
        
        <div className="w-full md:w-auto flex-1 max-w-md">
          {status === 'success' ? (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl flex items-center gap-4">
              <CheckCircle2 className="w-10 h-10 text-green-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-lg">مرحباً بك معنا!</h4>
                <p className="text-indigo-100 text-sm">{message}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-indigo-200 rounded-xl py-4 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  dir="rtl"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-white text-indigo-600 font-bold py-4 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-70 shadow-lg"
              >
                {status === 'loading' ? 'جاري الاشتراك...' : 'اشترك الآن'}
              </button>
              {status === 'error' && (
                <p className="text-red-200 text-sm mt-2 text-center">{message}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
