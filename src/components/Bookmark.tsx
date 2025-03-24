
import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkMinus } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';

export const BookmarksList = () => {
  const { bookmarks, removeBookmark } = useBookmarks();
  
  if (bookmarks.length === 0) {
    return (
      <div className="text-center p-16 bg-secondary/30 rounded-lg">
        <p className="text-lg font-medium">No bookmarks yet</p>
        <p className="text-muted-foreground mt-2">
          Bookmark verses while reading to save them here
        </p>
      </div>
    );
  }
  
  // Sort bookmarks by timestamp (newest first)
  const sortedBookmarks = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);
  
  return (
    <div className="space-y-4 fade-in-elements">
      {sortedBookmarks.map((bookmark) => (
        <div 
          key={`${bookmark.surahNumber}-${bookmark.verseNumber}`}
          className="glass p-4 rounded-lg flex justify-between items-center"
        >
          <Link
            to={`/surah/${bookmark.surahNumber}/${bookmark.verseNumber}`}
            className="flex-1 hover:underline"
          >
            <h3 className="font-medium">{bookmark.surahName}</h3>
            <p className="text-sm text-muted-foreground">
              Verse {bookmark.verseNumber} • {new Date(bookmark.timestamp).toLocaleDateString()}
            </p>
          </Link>
          <button
            onClick={() => removeBookmark(bookmark.surahNumber, bookmark.verseNumber)}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Remove bookmark"
          >
            <BookmarkMinus size={18} className="text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      ))}
    </div>
  );
};
