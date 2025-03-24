
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, List } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSurah, Verse } from '../hooks/useQuranData';
import { VerseCard } from './VerseCard';
import { AudioPlayer } from './AudioPlayer';

export const QuranReader = () => {
  const { surahNumber, verseNumber } = useParams();
  const navigate = useNavigate();
  const surahId = parseInt(surahNumber || '1');
  const initialVerseId = parseInt(verseNumber || '1');
  
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { data: surah, isLoading, error } = useSurah(surahId);
  
  useEffect(() => {
    // Scroll to specific verse if provided in URL
    if (surah?.ayahs && initialVerseId > 1) {
      const verseToPlay = surah.ayahs.find(v => v.number % 1000 === initialVerseId);
      if (verseToPlay) {
        setCurrentVerse(verseToPlay);
        
        // Scroll to verse (with a slight delay to ensure rendering)
        setTimeout(() => {
          const verseElement = document.getElementById(`verse-${initialVerseId}`);
          if (verseElement) {
            verseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      }
    }
  }, [surah, initialVerseId]);
  
  const handlePlayVerse = (verse: Verse) => {
    setCurrentVerse(verse);
    setIsPlaying(true);
  };
  
  const handleNextVerse = () => {
    if (!surah?.ayahs || !currentVerse) return;
    
    const currentIndex = surah.ayahs.findIndex(v => v.number === currentVerse.number);
    if (currentIndex < surah.ayahs.length - 1) {
      setCurrentVerse(surah.ayahs[currentIndex + 1]);
      setIsPlaying(true);
    }
  };
  
  const handlePreviousVerse = () => {
    if (!surah?.ayahs || !currentVerse) return;
    
    const currentIndex = surah.ayahs.findIndex(v => v.number === currentVerse.number);
    if (currentIndex > 0) {
      setCurrentVerse(surah.ayahs[currentIndex - 1]);
      setIsPlaying(true);
    }
  };
  
  const navigateToPreviousSurah = () => {
    if (surahId > 1) {
      navigate(`/surah/${surahId - 1}`);
    }
  };
  
  const navigateToNextSurah = () => {
    if (surahId < 114) {
      navigate(`/surah/${surahId + 1}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading Surah...</p>
        </div>
      </div>
    );
  }
  
  if (error || !surah) {
    return (
      <div className="text-center p-8 bg-destructive/10 rounded-lg">
        <p className="text-destructive font-medium">Failed to load Surah</p>
        <p className="text-muted-foreground mt-2">Please check your connection and try again.</p>
      </div>
    );
  }
  
  return (
    <div className="pb-24 page-transition">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold font-arabic">{surah.name}</h1>
          <p className="text-muted-foreground">{surah.englishName} • {surah.englishNameTranslation}</p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Link to="/" className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/70 transition-colors flex items-center space-x-2">
            <List size={18} />
            <span>All Surahs</span>
          </Link>
        </div>
      </div>
      
      <div className="mb-6 glass p-4 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          {surah.numberOfAyahs} verses • {surah.revelationType}
        </p>
        
        {surah.number !== 9 && (
          <p className="arabic-text text-xl mt-2 leading-loose">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}
      </div>
      
      <div ref={contentRef}>
        {surah.ayahs.map((verse) => (
          <div key={verse.number} id={`verse-${verse.number % 1000}`}>
            <VerseCard
              verse={verse}
              surahNumber={surah.number}
              surahName={surah.name}
              onPlay={handlePlayVerse}
              isPlaying={isPlaying && currentVerse?.number === verse.number}
            />
          </div>
        ))}
      </div>
      
      <div className="my-8 flex justify-between">
        <button
          onClick={navigateToPreviousSurah}
          disabled={surahId <= 1}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            surahId <= 1 
              ? 'bg-secondary/40 text-muted-foreground cursor-not-allowed'
              : 'bg-secondary hover:bg-secondary/70 transition-colors'
          }`}
        >
          <ArrowLeft size={18} />
          <span>Previous Surah</span>
        </button>
        
        <button
          onClick={navigateToNextSurah}
          disabled={surahId >= 114}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            surahId >= 114
              ? 'bg-secondary/40 text-muted-foreground cursor-not-allowed'
              : 'bg-secondary hover:bg-secondary/70 transition-colors'
          }`}
        >
          <span>Next Surah</span>
          <ArrowRight size={18} />
        </button>
      </div>
      
      {currentVerse && (
        <AudioPlayer
          currentVerse={currentVerse}
          onNext={handleNextVerse}
          onPrevious={handlePreviousVerse}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      )}
    </div>
  );
};
