
import React from 'react';
import { Bookmark } from 'lucide-react';
import { Verse } from '../hooks/useQuranData';
import { useBookmarks } from '../hooks/useBookmarks';

interface VerseCardProps {
  verse: Verse;
  surahNumber: number;
  surahName: string;
  onPlay: (verse: Verse) => void;
  isPlaying: boolean;
}

export const VerseCard = ({ verse, surahNumber, surahName, onPlay, isPlaying }: VerseCardProps) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(surahNumber, verse.number);

  return (
    <div className="verse-transition glass rounded-xl p-5 mb-4 transform hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/20 text-foreground">
            {verse.number % 1000}
          </div>
          <button 
            onClick={() => onPlay(verse)}
            className={`px-3 py-1.5 rounded-full text-xs ${
              isPlaying 
                ? 'bg-primary/30 text-foreground animate-pulse' 
                : 'bg-secondary text-foreground/70 hover:bg-primary/20'
            } transition-colors`}
          >
            {isPlaying ? 'Playing' : 'Play'}
          </button>
        </div>
        <button
          onClick={() => toggleBookmark(surahNumber, verse.number, surahName)}
          className="p-1.5 rounded-full hover:bg-secondary transition-colors"
          aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
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
      </div>
      
      <div className="space-y-4">
        <p className="arabic-text text-xl md:text-2xl leading-loose">{verse.text}</p>
        {verse.translation && (
          <p className="text-muted-foreground text-sm md:text-base">{verse.translation}</p>
        )}
      </div>
    </div>
  );
};
