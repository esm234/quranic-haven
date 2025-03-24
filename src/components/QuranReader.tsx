
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, List, ChevronDown, ChevronUp, ChevronRightSquare, ChevronLeftSquare } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSurah, Verse, useReciters } from '../hooks/useQuranData';
import { VerseCard } from './VerseCard';
import { AudioPlayer } from './AudioPlayer';
import { useAuth } from '../contexts/AuthProvider';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const QuranReader = () => {
  const { surahNumber, verseNumber } = useParams();
  const navigate = useNavigate();
  const surahId = parseInt(surahNumber || '1');
  const initialVerseId = parseInt(verseNumber || '1');
  
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reciter, setReciter] = useState('ar.alafasy');
  const [currentVerseNumber, setCurrentVerseNumber] = useState(initialVerseId);
  const [jumpToVerseInput, setJumpToVerseInput] = useState('');
  const [showJumpInput, setShowJumpInput] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const { data: surah, isLoading, error } = useSurah(surahId, reciter);
  const { data: reciters, isLoading: isLoadingReciters } = useReciters();
  
  // فلترة قائمة القراء للغة العربية فقط
  const arabicReciters = reciters?.filter(r => r.language === 'ar') || [];
  
  useEffect(() => {
    // التمرير إلى آية محددة إذا كانت مقدمة في عنوان URL
    if (surah?.ayahs && initialVerseId > 1) {
      const verseToPlay = surah.ayahs.find(v => v.number % 1000 === initialVerseId);
      if (verseToPlay) {
        setCurrentVerse(verseToPlay);
        setCurrentVerseNumber(initialVerseId);
        
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
              last_read_verse: initialVerseId,
              reciter: reciter
            })
            .eq('user_id', user.id);
            
          if (error) throw error;
        } catch (err) {
          console.error('فشل حفظ آخر قراءة:', err);
        }
      }
    };
    
    saveLastRead();
  }, [surah, initialVerseId, surahId, user, reciter]);
  
  useEffect(() => {
    // جلب تفضيلات المستخدم عند تسجيل الدخول
    const fetchUserPreferences = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('reciter')
            .eq('user_id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data?.reciter) {
            setReciter(data.reciter);
          }
        } catch (err) {
          console.error('فشل جلب تفضيلات المستخدم:', err);
        }
      }
    };
    
    fetchUserPreferences();
  }, [user]);
  
  const handlePlayVerse = (verse: Verse) => {
    setCurrentVerse(verse);
    setCurrentVerseNumber(verse.number % 1000);
    setIsPlaying(true);
  };
  
  const handleNextVerse = () => {
    if (!surah?.ayahs || !currentVerse) return;
    
    const currentIndex = surah.ayahs.findIndex(v => v.number === currentVerse.number);
    if (currentIndex < surah.ayahs.length - 1) {
      setCurrentVerse(surah.ayahs[currentIndex + 1]);
      setCurrentVerseNumber((surah.ayahs[currentIndex + 1].number % 1000));
      setIsPlaying(true);
      
      // التمرير إلى الآية التالية
      const nextVerseElement = document.getElementById(`verse-${surah.ayahs[currentIndex + 1].number % 1000}`);
      if (nextVerseElement) {
        nextVerseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  
  const handlePreviousVerse = () => {
    if (!surah?.ayahs || !currentVerse) return;
    
    const currentIndex = surah.ayahs.findIndex(v => v.number === currentVerse.number);
    if (currentIndex > 0) {
      setCurrentVerse(surah.ayahs[currentIndex - 1]);
      setCurrentVerseNumber((surah.ayahs[currentIndex - 1].number % 1000));
      setIsPlaying(true);
      
      // التمرير إلى الآية السابقة
      const previousVerseElement = document.getElementById(`verse-${surah.ayahs[currentIndex - 1].number % 1000}`);
      if (previousVerseElement) {
        previousVerseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
  
  const handleJumpToVerse = () => {
    if (!surah) return;
    
    const verseNum = parseInt(jumpToVerseInput);
    if (isNaN(verseNum) || verseNum < 1 || verseNum > surah.numberOfAyahs) {
      toast({
        title: "خطأ",
        description: `رقم الآية يجب أن يكون بين 1 و ${surah.numberOfAyahs}`,
        variant: "destructive"
      });
      return;
    }
    
    const verseToJump = surah.ayahs.find(v => v.number % 1000 === verseNum);
    if (verseToJump) {
      setCurrentVerse(verseToJump);
      setCurrentVerseNumber(verseNum);
      setShowJumpInput(false);
      
      // التمرير إلى الآية المحددة
      const verseElement = document.getElementById(`verse-${verseNum}`);
      if (verseElement) {
        verseElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  
  const handleReciterChange = async (value: string) => {
    setReciter(value);
    
    // حفظ تفضيل القارئ للمستخدم
    if (user) {
      try {
        const { error } = await supabase
          .from('user_preferences')
          .update({ reciter: value })
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        toast({
          title: "تم التحديث",
          description: "تم تغيير القارئ بنجاح"
        });
      } catch (err) {
        console.error('فشل تحديث تفضيلات القارئ:', err);
      }
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
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
          <div className="w-full md:w-auto">
            <Select value={reciter} onValueChange={handleReciterChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="اختر القارئ" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingReciters ? (
                  <div className="p-2 text-center">جار التحميل...</div>
                ) : (
                  arabicReciters.map((r) => (
                    <SelectItem key={r.identifier} value={r.identifier}>
                      {r.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Link to="/" className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/70 transition-colors flex items-center space-x-2">
              <List size={18} />
              <span className="mr-2">كافة السور</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mb-6 glass p-4 rounded-lg text-center">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {surah.numberOfAyahs} آية • {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
          </p>
          
          <div className="flex items-center space-x-2">
            {!showJumpInput ? (
              <button 
                onClick={() => setShowJumpInput(true)}
                className="px-3 py-1 text-sm rounded-lg bg-secondary hover:bg-secondary/70 transition-colors flex items-center"
              >
                <span className="ml-1">انتقال لآية</span>
                <ChevronDown size={16} />
              </button>
            ) : (
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  value={jumpToVerseInput}
                  onChange={(e) => setJumpToVerseInput(e.target.value)}
                  placeholder={`1-${surah.numberOfAyahs}`}
                  className="w-20 px-2 py-1 rounded-md text-sm border border-border bg-background"
                  min="1"
                  max={surah.numberOfAyahs}
                />
                <button 
                  onClick={handleJumpToVerse}
                  className="px-2 py-1 rounded-md bg-primary/20 hover:bg-primary/30 transition-colors"
                >
                  انتقال
                </button>
                <button 
                  onClick={() => setShowJumpInput(false)}
                  className="p-1 rounded-md hover:bg-accent transition-colors"
                >
                  <ChevronUp size={16} />
                </button>
              </div>
            )}
            
            <div className="flex">
              <button 
                onClick={handlePreviousVerse}
                className="p-1 rounded-md hover:bg-accent transition-colors"
                aria-label="الآية السابقة"
              >
                <ChevronRightSquare size={18} />
              </button>
              <span className="mx-1 text-sm font-medium">آية {currentVerseNumber}</span>
              <button 
                onClick={handleNextVerse}
                className="p-1 rounded-md hover:bg-accent transition-colors"
                aria-label="الآية التالية"
              >
                <ChevronLeftSquare size={18} />
              </button>
            </div>
          </div>
        </div>
        
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
