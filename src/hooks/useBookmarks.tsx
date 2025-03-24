
import { useState, useEffect } from 'react';

export interface Bookmark {
  surahNumber: number;
  verseNumber: number;
  surahName: string;
  timestamp: number;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  
  // Load bookmarks from localStorage on initial load
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('quran-bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Failed to parse bookmarks:', error);
      }
    }
  }, []);
  
  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quran-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);
  
  // Check if a verse is bookmarked
  const isBookmarked = (surahNumber: number, verseNumber: number) => {
    return bookmarks.some(
      bookmark => bookmark.surahNumber === surahNumber && bookmark.verseNumber === verseNumber
    );
  };
  
  // Add bookmark
  const addBookmark = (surahNumber: number, verseNumber: number, surahName: string) => {
    if (!isBookmarked(surahNumber, verseNumber)) {
      setBookmarks([
        ...bookmarks,
        {
          surahNumber,
          verseNumber,
          surahName,
          timestamp: Date.now()
        }
      ]);
    }
  };
  
  // Remove bookmark
  const removeBookmark = (surahNumber: number, verseNumber: number) => {
    setBookmarks(
      bookmarks.filter(
        bookmark => !(bookmark.surahNumber === surahNumber && bookmark.verseNumber === verseNumber)
      )
    );
  };
  
  // Toggle bookmark
  const toggleBookmark = (surahNumber: number, verseNumber: number, surahName: string) => {
    if (isBookmarked(surahNumber, verseNumber)) {
      removeBookmark(surahNumber, verseNumber);
    } else {
      addBookmark(surahNumber, verseNumber, surahName);
    }
  };
  
  return {
    bookmarks,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark
  };
};
