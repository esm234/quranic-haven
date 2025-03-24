
import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkMinus, Loader } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';

export const BookmarksList = () => {
  const { bookmarks, removeBookmark, loading } = useBookmarks();
  
  if (loading) {
    return (
      <div className="text-center p-16">
        <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">جار تحميل المفضلة...</p>
      </div>
    );
  }
  
  if (bookmarks.length === 0) {
    return (
      <div className="text-center p-16 bg-secondary/30 rounded-lg">
        <p className="text-lg font-medium">لا توجد آيات مفضلة حتى الآن</p>
        <p className="text-muted-foreground mt-2">
          أضف الآيات إلى المفضلة أثناء القراءة لحفظها هنا
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 fade-in-elements">
      {bookmarks.map((bookmark) => (
        <div 
          key={bookmark.id}
          className="glass p-4 rounded-lg flex justify-between items-center"
        >
          <Link
            to={`/surah/${bookmark.surah_number}/${bookmark.verse_number}`}
            className="flex-1 hover:underline"
          >
            <div className="flex flex-col">
              <h3 className="font-medium">{bookmark.surah_name}</h3>
              <p className="text-sm text-muted-foreground">
                الآية {bookmark.verse_number} • {new Date(bookmark.created_at).toLocaleDateString('ar-SA')}
              </p>
              <p className="mt-2 text-sm arabic-text">{bookmark.verse_text.length > 100 
                ? bookmark.verse_text.substring(0, 100) + '...' 
                : bookmark.verse_text}
              </p>
            </div>
          </Link>
          <button
            onClick={() => removeBookmark(bookmark.surah_number, bookmark.verse_number)}
            className="p-2 mr-4 rounded-full hover:bg-secondary transition-colors"
            aria-label="إزالة من المفضلة"
          >
            <BookmarkMinus size={18} className="text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      ))}
    </div>
  );
};
