
import React, { useState } from 'react';
import { Bookmark, ChevronDown, ChevronUp, Headphones, BookOpen, Volume2 } from 'lucide-react';
import { Verse } from '../hooks/useQuranData';
import { useBookmarks } from '../hooks/useBookmarks';
import { useAuth } from '../contexts/AuthProvider';
import { cn } from '@/lib/utils';

interface VerseCardProps {
  verse: Verse;
  surahNumber: number;
  surahName: string;
  onPlay: (verse: Verse) => void;
  isPlaying: boolean;
  fontSize: string;
}

export const VerseCard = ({ 
  verse, 
  surahNumber, 
  surahName, 
  onPlay, 
  isPlaying,
  fontSize = 'medium'
}: VerseCardProps) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { user } = useAuth();
  const bookmarked = user ? isBookmarked(surahNumber, verse.number) : false;
  const [showTafsir, setShowTafsir] = useState(false);

  const handleBookmarkClick = () => {
    toggleBookmark(surahNumber, verse.number, verse.text, surahName);
  };

  return (
    <div className="verse-card-enter verse-transition glass rounded-xl p-5 mb-4 transform hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/20 text-foreground">
            {verse.number % 1000}
          </div>
          <button 
            onClick={() => onPlay(verse)}
            className={cn(
              "play-button px-4 py-2 mr-2 rounded-full flex items-center space-x-2",
              isPlaying 
                ? "bg-primary/40 text-foreground animate-pulse" 
                : "hover:bg-primary/30"
            )}
            aria-label={isPlaying ? "قيد التشغيل" : "استماع للآية"}
          >
            {isPlaying ? (
              <>
                <Volume2 size={16} className="mr-1 animate-pulse" />
                <span>قيد التشغيل</span>
              </>
            ) : (
              <>
                <Headphones size={16} className="mr-1" />
                <span>استماع</span>
              </>
            )}
          </button>
        </div>
        {user && (
          <button
            onClick={handleBookmarkClick}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label={bookmarked ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            title={bookmarked ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          >
            <Bookmark
              size={20}
              className={`transition-all duration-300 ${
                bookmarked 
                  ? 'fill-primary text-primary' 
                  : 'fill-transparent text-muted-foreground'
              }`}
            />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <p className={`arabic-text font-size-${fontSize} leading-loose`}>{verse.text}</p>
        {verse.translation && (
          <p className="text-muted-foreground text-sm md:text-base">{verse.translation}</p>
        )}
        
        {verse.tafsir && (
          <div className="mt-3 pt-2 border-t border-border">
            <div 
              className="flex items-center cursor-pointer text-primary hover:text-primary/80 transition-colors" 
              onClick={() => setShowTafsir(!showTafsir)}
            >
              <BookOpen size={16} className="ml-1" />
              <span className="text-sm font-medium ml-1">التفسير المختصر</span>
              {showTafsir ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {showTafsir && (
              <div className="mt-2 text-sm text-muted-foreground bg-secondary/30 p-4 rounded-md animate-fade-in">
                <p>{verse.tafsir}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

VerseCard.defaultProps = {
  fontSize: 'medium'
};
