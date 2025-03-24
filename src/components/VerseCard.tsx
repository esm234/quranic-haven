
import React, { useState } from 'react';
import { Bookmark, ChevronDown, ChevronUp } from 'lucide-react';
import { Verse } from '../hooks/useQuranData';
import { useBookmarks } from '../hooks/useBookmarks';
import { useAuth } from '../contexts/AuthProvider';

interface VerseCardProps {
  verse: Verse;
  surahNumber: number;
  surahName: string;
  onPlay: (verse: Verse) => void;
  isPlaying: boolean;
}

export const VerseCard = ({ verse, surahNumber, surahName, onPlay, isPlaying }: VerseCardProps) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { user } = useAuth();
  const bookmarked = user ? isBookmarked(surahNumber, verse.number) : false;
  const [showTafsir, setShowTafsir] = useState(false);

  const handleBookmarkClick = () => {
    toggleBookmark(surahNumber, verse.number, verse.text, surahName);
  };

  return (
    <div className="verse-transition glass rounded-xl p-5 mb-4 transform hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/20 text-foreground">
            {verse.number % 1000}
          </div>
          <button 
            onClick={() => onPlay(verse)}
            className={`px-3 py-1.5 mr-2 rounded-full text-xs ${
              isPlaying 
                ? 'bg-primary/30 text-foreground animate-pulse' 
                : 'bg-secondary text-foreground/70 hover:bg-primary/20'
            } transition-colors`}
          >
            {isPlaying ? 'تشغيل' : 'استماع'}
          </button>
        </div>
        {user && (
          <button
            onClick={handleBookmarkClick}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
            aria-label={bookmarked ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          >
            <Bookmark
              size={18}
              className={`transition-all ${
                bookmarked 
                  ? 'fill-foreground text-foreground' 
                  : 'fill-transparent text-muted-foreground'
              }`}
            />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <p className="arabic-text text-xl md:text-2xl leading-loose">{verse.text}</p>
        {verse.translation && (
          <p className="text-muted-foreground text-sm md:text-base">{verse.translation}</p>
        )}
        
        {verse.tafsir && (
          <div className="mt-2 pt-2 border-t border-border">
            <div 
              className="flex items-center cursor-pointer text-primary hover:text-primary/80 transition-colors" 
              onClick={() => setShowTafsir(!showTafsir)}
            >
              <span className="text-sm font-medium ml-1">التفسير المختصر</span>
              {showTafsir ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {showTafsir && (
              <p className="mt-2 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md">
                {verse.tafsir}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
