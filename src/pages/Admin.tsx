import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, setDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth, loginWithGoogle, logout } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { BarChart, Activity, Globe, Users, FileText, PlusCircle, LogOut, Key, MessageSquare, Mail, Settings, Database } from 'lucide-react';
import { posts as staticPosts } from '../data/posts';

export function Admin() {
  const [user, setUser] = useState<any>(null);
  const [passcode, setPasscode] = useState('');
  const [isPasscodeValid, setIsPasscodeValid] = useState(false);
  const [activeTab, setActiveTab] = useState('add-post');
  
  // Post Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('freelancing');
  const [image, setImage] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Analytics State
  const [visits, setVisits] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalVisits: 0, topCountries: [], topInterests: [] });

  // Comments and Subscribers State
  const [comments, setComments] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  // Settings State
  const [newPasscode, setNewPasscode] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);

  const ADMIN_EMAIL = 'qydalrfyd@gmail.com';
  const [secretPasscode, setSecretPasscode] = useState('admin123'); // Default, will be fetched

  useEffect(() => {
    // Fetch passcode from settings
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'admin'));
        if (settingsDoc.exists() && settingsDoc.data().adminPasscode) {
          setSecretPasscode(settingsDoc.data().adminPasscode);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email === ADMIN_EMAIL && isPasscodeValid) {
        fetchAnalytics();
        fetchComments();
        fetchSubscribers();
      }
    });
    return () => unsubscribe();
  }, [isPasscodeValid]);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === secretPasscode) {
      setIsPasscodeValid(true);
      if (user?.email === ADMIN_EMAIL) {
        fetchAnalytics();
        fetchComments();
        fetchSubscribers();
      }
    } else {
      alert('الرمز غير صحيح');
    }
  };

  const fetchComments = async () => {
    try {
      const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const commentsData: any[] = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() });
      });
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const q = query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const subscribersData: any[] = [];
      querySnapshot.forEach((doc) => {
        subscribersData.push({ id: doc.id, ...doc.data() });
      });
      setSubscribers(subscribersData);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    }
  };

  const handleUpdateCommentStatus = async (commentId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'comments', commentId), { status });
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("حدث خطأ أثناء تحديث حالة التعليق");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("حدث خطأ أثناء حذف التعليق");
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المشترك؟")) return;
    try {
      await deleteDoc(doc(db, 'subscribers', subscriberId));
      fetchSubscribers();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      alert("حدث خطأ أثناء حذف المشترك");
    }
  };

  const handleUpdatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode || newPasscode.length < 6) {
      setSettingsMessage('يجب أن يتكون الرمز من 6 أحرف على الأقل');
      return;
    }
    try {
      await setDoc(doc(db, 'settings', 'admin'), { adminPasscode: newPasscode });
      setSecretPasscode(newPasscode);
      setSettingsMessage('تم تحديث رمز الدخول بنجاح!');
      setNewPasscode('');
    } catch (error) {
      console.error("Error updating passcode:", error);
      setSettingsMessage('حدث خطأ أثناء تحديث الرمز');
    }
  };

  const handleMigratePosts = async () => {
    if (!window.confirm("هل أنت متأكد من رغبتك في نقل جميع المقالات القديمة إلى قاعدة البيانات؟ لن يتم تكرار المقالات الموجودة مسبقاً.")) return;
    
    setIsMigrating(true);
    setSettingsMessage('جاري نقل المقالات...');
    
    try {
      let count = 0;
      for (const post of staticPosts) {
        const postRef = doc(db, 'posts', post.id);
        const postSnap = await getDoc(postRef);
        
        if (!postSnap.exists()) {
          await setDoc(postRef, {
            ...post,
            views: post.views || 0
          });
          count++;
        }
      }
      setSettingsMessage(`تم الانتهاء! تمت إضافة ${count} مقال جديد إلى قاعدة البيانات.`);
    } catch (error) {
      console.error("Error migrating posts:", error);
      setSettingsMessage('حدث خطأ أثناء نقل المقالات.');
    } finally {
      setIsMigrating(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const q = query(collection(db, 'visits'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const visitsData: any[] = [];
      const countryCount: Record<string, number> = {};
      const interestCount: Record<string, number> = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        visitsData.push(data);
        
        if (data.country) {
          countryCount[data.country] = (countryCount[data.country] || 0) + 1;
        }
        
        if (data.interests && Array.isArray(data.interests)) {
          data.interests.forEach((interest: string) => {
            interestCount[interest] = (interestCount[interest] || 0) + 1;
          });
        }
      });

      const topCountries = Object.entries(countryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      const topInterests = Object.entries(interestCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      setVisits(visitsData);
      setStats({
        totalVisits: visitsData.length,
        topCountries,
        topInterests
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const newPostId = title.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)+/g, '');
      const newPost = {
        id: newPostId,
        title,
        summary,
        content,
        category,
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
        date: new Date().toISOString().split('T')[0],
        image: image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
        views: 0,
        authorId: user.uid
      };

      await setDoc(doc(db, 'posts', newPostId), newPost);
      setMessage('تم إضافة المنشور بنجاح!');
      setTitle('');
      setSummary('');
      setContent('');
      setImage('');
      setKeywords('');
    } catch (error) {
      console.error("Error adding post:", error);
      setMessage('حدث خطأ أثناء إضافة المنشور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isPasscodeValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <Key className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">لوحة المشرف</h1>
          <p className="text-gray-500 mb-6">الرجاء إدخال رمز الدخول السري</p>
          <form onSubmit={handlePasscodeSubmit}>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4 text-center text-2xl tracking-widest"
              placeholder="••••••"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <Users className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول للمشرف</h1>
          <p className="text-gray-500 mb-6">يجب تسجيل الدخول بحساب المشرف المعتمد</p>
          <button
            onClick={loginWithGoogle}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            تسجيل الدخول باستخدام Google
          </button>
        </div>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح لك</h1>
          <p className="text-gray-500 mb-6">هذا الحساب ليس لديه صلاحيات المشرف.</p>
          <button
            onClick={logout}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar / Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">لوحة تحكم المشرف</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-600 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('add-post')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'add-post' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            إضافة منشور جديد
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart className="w-5 h-5" />
            إحصائيات الزوار
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'comments' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            إدارة التعليقات
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'subscribers' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Mail className="w-5 h-5" />
            إدارة المشتركين
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            الإعدادات
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'add-post' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              نشر مقال جديد
            </h2>
            
            {message && (
              <div className={`p-4 rounded-xl mb-6 ${message.includes('خطأ') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleAddPost} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">عنوان المنشور</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="مثال: كيف تبدأ في العمل الحر..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">القسم (الصفحة)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="freelancing">العمل الحر</option>
                    <option value="digital-marketing">التسويق الرقمي</option>
                    <option value="ecommerce">التجارة الإلكترونية</option>
                    <option value="digital-investments">الاستثمارات الرقمية</option>
                    <option value="tools">أدوات الذكاء الاصطناعي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ملخص قصير</label>
                <textarea
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-24"
                  placeholder="ملخص يظهر في بطاقة المنشور..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المحتوى (يدعم Markdown)</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-64 font-mono text-sm"
                  placeholder="اكتب محتوى المقال هنا..."
                  dir="auto"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رابط الصورة (اختياري)</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">كلمات مفتاحية (مفصولة بفاصلة)</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="عمل حر, تسويق, ربح..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'جاري النشر...' : 'نشر المقال الآن'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">إجمالي الزيارات</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalVisits}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Countries */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  الزيارات حسب الدولة
                </h3>
                <div className="space-y-4">
                  {stats.topCountries.length > 0 ? stats.topCountries.map((item: any, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-700">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${(item.count / stats.totalVisits) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8 text-left">{item.count}</span>
                      </div>
                    </div>
                  )) : <p className="text-gray-500 text-sm">لا توجد بيانات كافية بعد.</p>}
                </div>
              </div>

              {/* Top Interests */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  اهتمامات الزوار (الأقسام)
                </h3>
                <div className="space-y-4">
                  {stats.topInterests.length > 0 ? stats.topInterests.map((item: any, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-700">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${(item.count / stats.totalVisits) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8 text-left">{item.count}</span>
                      </div>
                    </div>
                  )) : <p className="text-gray-500 text-sm">لا توجد بيانات كافية بعد.</p>}
                </div>
              </div>
            </div>
            
            {/* Recent Visits Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">أحدث الزيارات</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-gray-50 text-gray-500 text-sm">
                    <tr>
                      <th className="px-6 py-3 font-medium">التاريخ والوقت</th>
                      <th className="px-6 py-3 font-medium">الصفحة (المسار)</th>
                      <th className="px-6 py-3 font-medium">الدولة</th>
                      <th className="px-6 py-3 font-medium">المدينة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {visits.slice(0, 10).map((visit, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(visit.timestamp).toLocaleString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-medium" dir="ltr">{visit.path}</td>
                        <td className="px-6 py-4 text-gray-700">{visit.country || '-'}</td>
                        <td className="px-6 py-4 text-gray-700">{visit.city || '-'}</td>
                      </tr>
                    ))}
                    {visits.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          لا توجد زيارات مسجلة حتى الآن.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'comments' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
              إدارة التعليقات
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-sm">
                    <th className="pb-4 font-medium">الاسم</th>
                    <th className="pb-4 font-medium">التعليق</th>
                    <th className="pb-4 font-medium">التقييم</th>
                    <th className="pb-4 font-medium">التاريخ</th>
                    <th className="pb-4 font-medium">الحالة</th>
                    <th className="pb-4 font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {comments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">لا توجد تعليقات حتى الآن</td>
                    </tr>
                  ) : (
                    comments.map((comment) => (
                      <tr key={comment.id} className="text-sm">
                        <td className="py-4 font-medium text-gray-900">{comment.authorName}</td>
                        <td className="py-4 text-gray-600 max-w-xs truncate">{comment.text}</td>
                        <td className="py-4 text-gray-600">{comment.rating} / 5</td>
                        <td className="py-4 text-gray-500" dir="ltr">
                          {new Date(comment.createdAt).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            comment.status === 'approved' ? 'bg-green-100 text-green-700' :
                            comment.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {comment.status === 'approved' ? 'مقبول' : comment.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {comment.status !== 'approved' && (
                              <button
                                onClick={() => handleUpdateCommentStatus(comment.id, 'approved')}
                                className="text-green-600 hover:text-green-800 font-medium text-xs bg-green-50 px-2 py-1 rounded"
                              >
                                قبول
                              </button>
                            )}
                            {comment.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateCommentStatus(comment.id, 'rejected')}
                                className="text-yellow-600 hover:text-yellow-800 font-medium text-xs bg-yellow-50 px-2 py-1 rounded"
                              >
                                رفض
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-600 hover:text-red-800 font-medium text-xs bg-red-50 px-2 py-1 rounded"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-indigo-600" />
              إدارة المشتركين
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-sm">
                    <th className="pb-4 font-medium">البريد الإلكتروني</th>
                    <th className="pb-4 font-medium">تاريخ الاشتراك</th>
                    <th className="pb-4 font-medium">الحالة</th>
                    <th className="pb-4 font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subscribers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">لا يوجد مشتركون حتى الآن</td>
                    </tr>
                  ) : (
                    subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="text-sm">
                        <td className="py-4 font-medium text-gray-900" dir="ltr">{subscriber.email}</td>
                        <td className="py-4 text-gray-500" dir="ltr">
                          {new Date(subscriber.subscribedAt).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            subscriber.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {subscriber.status === 'active' ? 'نشط' : 'غير مشترك'}
                          </span>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => handleDeleteSubscriber(subscriber.id)}
                            className="text-red-600 hover:text-red-800 font-medium text-xs bg-red-50 px-3 py-1 rounded"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-indigo-600" />
              الإعدادات
            </h2>

            {settingsMessage && (
              <div className={`p-4 rounded-xl mb-6 ${settingsMessage.includes('خطأ') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {settingsMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Change Passcode */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-600" />
                  تغيير رمز الدخول السري
                </h3>
                <form onSubmit={handleUpdatePasscode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الرمز الجديد</label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="أدخل الرمز الجديد (6 أحرف على الأقل)"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                    حفظ الرمز الجديد
                  </button>
                </form>
              </div>

              {/* Migrate Posts */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  نقل المقالات القديمة
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  استخدم هذا الزر لنقل جميع المقالات الثابتة (الموجودة في الكود) إلى قاعدة بيانات Firebase. لن يتم تكرار المقالات الموجودة مسبقاً.
                </p>
                <button
                  onClick={handleMigratePosts}
                  disabled={isMigrating}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <Database className="w-5 h-5" />
                  {isMigrating ? 'جاري النقل...' : 'نقل المقالات إلى قاعدة البيانات'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
