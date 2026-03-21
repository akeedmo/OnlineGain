import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { posts as staticPosts } from '../data/posts';

export function usePosts() {
  const [posts, setPosts] = useState<any[]>(staticPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestorePosts: any[] = [];
      snapshot.forEach((doc) => {
        firestorePosts.push({ ...doc.data(), id: doc.id });
      });
      
      // Merge firestore posts with static posts, avoiding duplicates by ID
      const mergedPosts = [...firestorePosts];
      const firestoreIds = new Set(firestorePosts.map(p => p.id));
      
      staticPosts.forEach(sp => {
        if (!firestoreIds.has(sp.id)) {
          mergedPosts.push(sp);
        }
      });
      
      // Sort by date descending
      mergedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setPosts(mergedPosts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { posts, loading };
}
