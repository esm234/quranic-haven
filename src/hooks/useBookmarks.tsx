
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthProvider';
import { toast } from '@/hooks/use-toast';

export interface Bookmark {
  id: string;
  surah_number: number;
  verse_number: number;
  verse_text: string;
  surah_name: string;
  created_at: string;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // جلب الإشارات المرجعية من Supabase
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) {
        setBookmarks([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setBookmarks(data || []);
      } catch (error: any) {
        console.error('Error fetching bookmarks:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookmarks();
  }, [user]);
  
  // التحقق مما إذا كانت الآية مضافة للمفضلة
  const isBookmarked = (surahNumber: number, verseNumber: number) => {
    return bookmarks.some(
      bookmark => bookmark.surah_number === surahNumber && bookmark.verse_number === verseNumber
    );
  };
  
  // إضافة إشارة مرجعية
  const addBookmark = async (surahNumber: number, verseNumber: number, verseText: string, surahName: string) => {
    if (!user) {
      toast({
        title: 'تنبيه',
        description: 'يجب تسجيل الدخول لإضافة الآية إلى المفضلة',
      });
      return;
    }
    
    if (!isBookmarked(surahNumber, verseNumber)) {
      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            surah_number: surahNumber,
            verse_number: verseNumber,
            verse_text: verseText,
            surah_name: surahName
          })
          .select();
        
        if (error) throw error;
        
        setBookmarks([data[0], ...bookmarks]);
        
        toast({
          title: 'تمت الإضافة',
          description: 'تمت إضافة الآية إلى المفضلة بنجاح',
        });
      } catch (error: any) {
        toast({
          title: 'خطأ',
          description: error.message || 'حدث خطأ أثناء إضافة الآية إلى المفضلة',
          variant: 'destructive',
        });
      }
    }
  };
  
  // إزالة إشارة مرجعية
  const removeBookmark = async (surahNumber: number, verseNumber: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('surah_number', surahNumber)
        .eq('verse_number', verseNumber);
      
      if (error) throw error;
      
      setBookmarks(
        bookmarks.filter(
          bookmark => !(bookmark.surah_number === surahNumber && bookmark.verse_number === verseNumber)
        )
      );
      
      toast({
        title: 'تمت الإزالة',
        description: 'تمت إزالة الآية من المفضلة بنجاح',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء إزالة الآية من المفضلة',
        variant: 'destructive',
      });
    }
  };
  
  // تبديل حالة الإشارة المرجعية
  const toggleBookmark = async (surahNumber: number, verseNumber: number, verseText: string, surahName: string) => {
    if (isBookmarked(surahNumber, verseNumber)) {
      await removeBookmark(surahNumber, verseNumber);
    } else {
      await addBookmark(surahNumber, verseNumber, verseText, surahName);
    }
  };
  
  return {
    bookmarks,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    loading
  };
};
