
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, List } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSurah, Verse } from '../hooks/useQuranData';
import { VerseCard } from './VerseCard';
import { AudioPlayer } from './AudioPlayer';
import { useAuth } from '../contexts/AuthProvider';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const QuranReader = () => {
  const { surahNumber, verseNumber } = useParams();
  const navigate = useNavigate();
  const surahId = parseInt(surahNumber || '1');
  const initialVerseId = parseInt(verseNumber || '1');
  
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const { data: surah, isLoading, error } = useSurah(surahId);
  
  useEffect(() => {
    // التمرير إلى آية محددة إذا كانت مقدمة في عنوان URL
    if (surah?.ayahs && initialVerseId > 1) {
      const verseToPlay = surah.ayahs.find(v => v.number % 1000 === initialVerseId);
      if (verseToPlay) {
        setCurrentVerse(verseToPlay);
        
        // التمرير إلى الآية (مع تأخير طفيف لضمان العرض)
        setTimeout(() => {
          const verseElement = document.getElementById(`verse-${initialVerseId}`);
          if (verseElement) {
            verseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      }
    }
    
    // حفظ آخر قراءة إذا كان المستخدم مسجل الدخول
    const saveLastRead = async () => {
      if (user) {
        try {
          const { error } = await supabase
            .from('user_preferences')
            .update({
              last_read_surah: surahId,
              last_read_verse: initialVerseId
            })
            .eq('user_id', user.id);
            
          if (error) throw error;
        } catch (err) {
          console.error('فشل حفظ آخر قراءة:', err);
        }
      }
    };
    
    saveLastRead();
  }, [surah, initialVerseId, surahId, user]);
  
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
          <p className="mt-4 text-muted-foreground">جار تحميل السورة...</p>
        </div>
      </div>
    );
  }
  
  if (error || !surah) {
    return (
      <div className="text-center p-8 bg-destructive/10 rounded-lg">
        <p className="text-destructive font-medium">فشل تحميل السورة</p>
        <p className="text-muted-foreground mt-2">يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.</p>
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
            <span className="mr-2">كافة السور</span>
          </Link>
        </div>
      </div>
      
      <div className="mb-6 glass p-4 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          {surah.numberOfAyahs} آية • {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
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
          <ArrowRight size={18} />
          <span className="mr-2">السورة السابقة</span>
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
          <span className="ml-2">السورة التالية</span>
          <ArrowLeft size={18} />
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
