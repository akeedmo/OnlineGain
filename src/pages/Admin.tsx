import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, setDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth, loginWithGoogle, logout } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { BarChart, Activity, Globe, Users, FileText, PlusCircle, LogOut, Key, MessageSquare, Mail, Settings, Database, Search, DollarSign, Bold, Heading2, Link as LinkIcon, List, Eye as EyeIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function Admin() {
  const [user, setUser] = useState<any>(null);
  const [passcode, setPasscode] = useState('');
  const [isPasscodeValid, setIsPasscodeValid] = useState(false);
  const [activeTab, setActiveTab] = useState('add-post');
  
  // Post Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('freelancing');
  const [image, setImage] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Analytics State
  const [visits, setVisits] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalVisits: 0, daily: 0, weekly: 0, monthly: 0, yearly: 0, topCountries: [], topInterests: [] });

  // Comments and Subscribers State
  const [comments, setComments] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  // Settings State
  const [newPasscode, setNewPasscode] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  
  // Site Settings State
  const [googleSiteVerification, setGoogleSiteVerification] = useState('');
  const [adsenseClientId, setAdsenseClientId] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [sitemapContent, setSitemapContent] = useState('');
  const [isSavingSiteSettings, setIsSavingSiteSettings] = useState(false);
  
  // Login State
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin Posts State
  const [adminPosts, setAdminPosts] = useState<any[]>([]);

  const ADMIN_EMAIL = 'qydalrfyd@gmail.com';
  const [secretPasscode, setSecretPasscode] = useState('admin123'); // Default, will be fetched

  useEffect(() => {
    // Fetch passcode from settings
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'admin'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          if (data.adminPasscode) {
            setSecretPasscode(data.adminPasscode);
          }
          if (data.adminEmails) {
            setAdminEmails(data.adminEmails);
          }
        }

        const siteSettingsDoc = await getDoc(doc(db, 'settings', 'site'));
        if (siteSettingsDoc.exists()) {
          const data = siteSettingsDoc.data();
          setGoogleSiteVerification(data.googleSiteVerification || '');
          setAdsenseClientId(data.adsenseClientId || '');
          setGoogleAnalyticsId(data.googleAnalyticsId || '');
          setSitemapContent(data.sitemapContent || '');
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const isAdminUser = !!user;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log("Logged in user email:", currentUser.email);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && isAdminUser && isPasscodeValid) {
      fetchAnalytics();
      fetchComments();
      fetchSubscribers();
      fetchAdminPosts();
    }
  }, [user, isAdminUser, isPasscodeValid]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === secretPasscode) {
      setIsPasscodeValid(true);
      if (isAdminUser) {
        fetchAnalytics();
        fetchComments();
        fetchSubscribers();
        fetchAdminPosts();
      }
    } else {
      setLoginError('الرمز غير صحيح');
    }
  };

  const fetchAdminPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const firestorePosts: any[] = [];
      querySnapshot.forEach((doc) => {
        firestorePosts.push({ id: doc.id, ...doc.data() });
      });

      setAdminPosts(firestorePosts);
    } catch (error) {
      console.error("Error fetching admin posts:", error);
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
      setSettingsMessage("حدث خطأ أثناء تحديث حالة التعليق");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      setSettingsMessage("حدث خطأ أثناء حذف التعليق");
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    try {
      await deleteDoc(doc(db, 'subscribers', subscriberId));
      fetchSubscribers();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      setSettingsMessage("حدث خطأ أثناء حذف المشترك");
    }
  };

  const handleDeleteAdminPost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      fetchAdminPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      setSettingsMessage("حدث خطأ أثناء حذف المنشور");
    }
  };

  const handleUpdatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode || newPasscode.length < 6) {
      setSettingsMessage('يجب أن يتكون الرمز من 6 أحرف على الأقل');
      return;
    }
    try {
      await setDoc(doc(db, 'settings', 'admin'), { adminPasscode: newPasscode }, { merge: true });
      setSecretPasscode(newPasscode);
      setSettingsMessage('تم تحديث رمز الدخول بنجاح!');
      setNewPasscode('');
    } catch (error) {
      console.error("Error updating passcode:", error);
      setSettingsMessage('حدث خطأ أثناء تحديث الرمز');
    }
  };

  const handleAddAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      setSettingsMessage('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    if (adminEmails.includes(newAdminEmail) || newAdminEmail === ADMIN_EMAIL) {
      setSettingsMessage('هذا البريد مضاف مسبقاً');
      return;
    }
    try {
      const updatedEmails = [...adminEmails, newAdminEmail];
      await setDoc(doc(db, 'settings', 'admin'), { adminEmails: updatedEmails }, { merge: true });
      setAdminEmails(updatedEmails);
      setSettingsMessage('تم إضافة المشرف بنجاح!');
      setNewAdminEmail('');
    } catch (error) {
      console.error("Error adding admin:", error);
      setSettingsMessage('حدث خطأ أثناء إضافة المشرف');
    }
  };

  const handleRemoveAdminEmail = async (emailToRemove: string) => {
    try {
      const updatedEmails = adminEmails.filter(email => email !== emailToRemove);
      await setDoc(doc(db, 'settings', 'admin'), { adminEmails: updatedEmails }, { merge: true });
      setAdminEmails(updatedEmails);
      setSettingsMessage('تم إزالة المشرف بنجاح!');
    } catch (error) {
      console.error("Error removing admin:", error);
      setSettingsMessage('حدث خطأ أثناء إزالة المشرف');
    }
  };

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSiteSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), {
        googleSiteVerification,
        adsenseClientId,
        googleAnalyticsId,
        sitemapContent
      }, { merge: true });
      setSettingsMessage('تم حفظ إعدادات الموقع بنجاح!');
    } catch (error) {
      console.error("Error saving site settings:", error);
      setSettingsMessage('حدث خطأ أثناء حفظ إعدادات الموقع');
    } finally {
      setIsSavingSiteSettings(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const q = query(collection(db, 'visits'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const visitsData: any[] = [];
      const countryCount: Record<string, number> = {};
      const interestCount: Record<string, number> = {};
      
      const now = new Date();
      const daily = new Date(now); daily.setHours(0, 0, 0, 0);
      const weekly = new Date(now); weekly.setDate(now.getDate() - 7);
      const monthly = new Date(now); monthly.setMonth(now.getMonth() - 1);
      const yearly = new Date(now); yearly.setFullYear(now.getFullYear() - 1);

      let dVisits = 0, wVisits = 0, mVisits = 0, yVisits = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        visitsData.push(data);
        const ts = new Date(data.timestamp);

        if (ts >= daily) dVisits++;
        if (ts >= weekly) wVisits++;
        if (ts >= monthly) mVisits++;
        if (ts >= yearly) yVisits++;
        
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
        daily: dVisits,
        weekly: wVisits,
        monthly: mVisits,
        yearly: yVisits,
        topCountries,
        topInterests
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Generate slug from title: lowercase, replace spaces/special chars with hyphens, remove duplicate hyphens
    const generatedSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
  };

  const insertMarkdown = (before: string, after: string) => {
    const textarea = document.getElementById('post-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    
    setContent(newText);
    
    // Focus back and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const newPostId = slug || title.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)+/g, '');
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
      setSlug('');
      setSummary('');
      setContent('');
      setImage('');
      setKeywords('');
      fetchAdminPosts();
    } catch (error) {
      console.error("Error adding post:", error);
      setMessage('حدث خطأ أثناء إضافة المنشور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setLoginError('');
      const loggedInUser = await loginWithGoogle();
      if (!loggedInUser) {
        setLoginError('تم إلغاء تسجيل الدخول. يرجى التأكد من السماح بالنوافذ المنبثقة (Popups) في متصفحك والمحاولة مرة أخرى.');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <Users className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول للمشرف</h1>
          <p className="text-gray-500 mb-6">يجب تسجيل الدخول بحساب المشرف المعتمد</p>
          
          {loginError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm">
              {loginError}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoggingIn ? (
              <span>جاري تسجيل الدخول...</span>
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                تسجيل الدخول باستخدام Google
              </>
            )}
          </button>
          <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-sm text-indigo-800 mb-3">
              ملاحظة: إذا لم يستجب زر تسجيل الدخول (بسبب حظر النوافذ المنبثقة داخل المعاينة)، يرجى الضغط على الرابط التالي لفتح لوحة التحكم في نافذة مستقلة:
            </p>
            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-2 px-4 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
            >
              🚀 فتح لوحة التحكم في نافذة جديدة
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح لك</h1>
          <p className="text-gray-500 mb-6">هذا الحساب ({user?.email}) ليس لديه صلاحيات المشرف.</p>
          <div className="bg-gray-100 p-4 rounded-lg text-left text-xs text-gray-600 mb-6 overflow-auto">
            <p><strong>الإيميل المسجل:</strong> {user?.email}</p>
            <p><strong>الإيميل المشرف الثابت:</strong> {ADMIN_EMAIL}</p>
            <p><strong>قائمة الإيميلات من قاعدة البيانات:</strong> {adminEmails.join(', ')}</p>
            <p><strong>هل إيميلك في القائمة؟:</strong> {adminEmails.includes(user?.email || '') ? 'نعم' : 'لا'}</p>
            <p><strong>هل إيميلك هو المشرف الثابت؟:</strong> {user?.email === ADMIN_EMAIL ? 'نعم' : 'لا'}</p>
          </div>
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
              <PlusCircle className="w-6 h-6 text-indigo-600" />
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">عنوان المقال</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="مثال: كيف تبدأ في العمل الحر..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رابط المقال (Slug)</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                    placeholder="how-to-start-freelancing"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رابط الصورة</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ملخص قصير (يظهر في البطاقة)</label>
                <textarea
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-20"
                  placeholder="اكتب ملخصاً جذاباً للمقال..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">المحتوى (يدعم Markdown)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => insertMarkdown('## ', '')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                      title="عنوان فرعي"
                    >
                      <Heading2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('**', '**')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                      title="خط عريض"
                    >
                      <Bold size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('[', '](url)')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                      title="رابط خارجي"
                    >
                      <LinkIcon size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('- ', '')}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                      title="قائمة"
                    >
                      <List size={18} />
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        isPreviewOpen ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <EyeIcon size={14} />
                      {isPreviewOpen ? 'إغلاق المعاينة' : 'معاينة المحتوى'}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {!isPreviewOpen ? (
                    <textarea
                      id="post-content"
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-96 font-mono text-sm leading-relaxed"
                      placeholder="ابدأ بكتابة مقالك هنا... يمكنك استخدام Markdown للتنسيق."
                      dir="auto"
                    />
                  ) : (
                    <div className="w-full p-6 rounded-xl border border-gray-200 bg-gray-50 h-96 overflow-y-auto prose prose-indigo max-w-none">
                      <ReactMarkdown>{content || '*لا يوجد محتوى للمعاينة حالياً*'}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">كلمات مفتاحية (SEO)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="مثال: عمل حر, ربح من الانترنت, تسويق..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    جاري النشر...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-6 h-6" />
                    نشر المقال الآن
                  </>
                )}
              </button>
            </form>

            {/* Admin Posts List */}
            <div className="mt-16 border-t border-gray-100 pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  المنشورات السابقة
                </div>
                <span className="text-sm font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                  إجمالي المنشورات: {adminPosts.length}
                </span>
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-sm">
                      <th className="pb-4 font-medium">العنوان</th>
                      <th className="pb-4 font-medium">القسم</th>
                      <th className="pb-4 font-medium">المشاهدات</th>
                      <th className="pb-4 font-medium">التاريخ</th>
                      <th className="pb-4 font-medium">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {adminPosts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">لا توجد منشورات حتى الآن</td>
                      </tr>
                    ) : (
                      adminPosts.map((post) => (
                        <tr key={post.id} className="text-sm">
                          <td className="py-4 font-medium text-gray-900 max-w-[200px] truncate">{post.title}</td>
                          <td className="py-4 text-gray-600">{post.category}</td>
                          <td className="py-4 text-gray-600">{post.views || 0}</td>
                          <td className="py-4 text-gray-500" dir="ltr">
                            {post.date}
                          </td>
                          <td className="py-4">
                            <button
                              onClick={() => handleDeleteAdminPost(post.id)}
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
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {[
                { label: 'إجمالي الزيارات', value: stats.totalVisits },
                { label: 'زيارات اليوم', value: stats.daily },
                { label: 'زيارات الأسبوع', value: stats.weekly },
                { label: 'زيارات الشهر', value: stats.monthly },
                { label: 'زيارات السنة', value: stats.yearly },
                { label: 'المشتركون', value: subscribers.length },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
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

              {/* Manage Admins */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  إدارة المشرفين
                </h3>
                <form onSubmit={handleAddAdminEmail} className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">إضافة بريد مشرف جديد</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="example@gmail.com"
                        dir="ltr"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </form>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">المشرفون الحاليون:</h4>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
                      <span className="text-sm text-gray-900 font-medium" dir="ltr">{ADMIN_EMAIL}</span>
                      <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded">المالك</span>
                    </div>
                    {adminEmails.map((email) => (
                      <div key={email} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-700" dir="ltr">{email}</span>
                        <button
                          onClick={() => handleRemoveAdminEmail(email)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium bg-red-50 px-2 py-1 rounded"
                        >
                          إزالة
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SEO & Monetization */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 md:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-indigo-600" />
                  تحسين محركات البحث وتحقيق الدخل (SEO & Monetization)
                </h3>
                <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        إثبات ملكية Google (Search Console)
                      </label>
                      <input
                        type="text"
                        value={googleSiteVerification}
                        onChange={(e) => setGoogleSiteVerification(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="مثال: XyZ123..."
                        dir="ltr"
                      />
                      <p className="mt-1 text-xs text-gray-500">ضع الكود الخاص بـ google-site-verification هنا</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        معرف Google Analytics
                      </label>
                      <input
                        type="text"
                        value={googleAnalyticsId}
                        onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="مثال: G-XXXXXXXXXX"
                        dir="ltr"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        معرف عميل Google AdSense
                      </label>
                      <input
                        type="text"
                        value={adsenseClientId}
                        onChange={(e) => setAdsenseClientId(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="مثال: ca-pub-1234567890123456"
                        dir="ltr"
                      />
                      <p className="mt-1 text-xs text-gray-500">أدخل معرف الناشر الخاص بك لتفعيل الإعلانات على الموقع</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        خريطة الموقع (sitemap.xml)
                      </label>
                      <textarea
                        value={sitemapContent}
                        onChange={(e) => setSitemapContent(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={10}
                        placeholder="أدخل محتوى ملف sitemap.xml هنا"
                        dir="ltr"
                      />
                      <p className="mt-1 text-xs text-gray-500">سيتم عرض هذا المحتوى عند زيارة /sitemap.xml</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingSiteSettings}
                    className="w-full md:w-auto px-8 bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
                  >
                    {isSavingSiteSettings ? 'جاري الحفظ...' : 'حفظ إعدادات الموقع'}
                  </button>
                </form>
              </div>

              {/* Post Statistics */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  إحصائيات المقالات
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                    <span className="text-gray-600">إجمالي المقالات في قاعدة البيانات</span>
                    <span className="text-xl font-bold text-indigo-600">{adminPosts.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
