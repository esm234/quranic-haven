
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, SkipBack, SkipForward, Volume1, Volume, Disc } from 'lucide-react';
import { Verse } from '../hooks/useQuranData';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  currentVerse: Verse | null;
  onNext: () => void;
  onPrevious: () => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const AudioPlayer = ({ 
  currentVerse,
  onNext,
  onPrevious,
  isPlaying,
  setIsPlaying
}: AudioPlayerProps) => {
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (currentVerse?.audioUrl && audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = currentVerse.audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play()
          .catch(error => {
            console.error("Audio playback failed:", error);
            setIsPlaying(false);
          });
      }
    }
  }, [currentVerse, setIsPlaying]);
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play()
        .catch(error => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
        });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, setIsPlaying]);
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);
  
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    
    setCurrentTime(currentTime);
    setDuration(duration);
    setProgress((currentTime / duration) * 100);
    setIsLoading(false);
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    onNext();
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (value === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const value = parseFloat(e.target.value);
    const time = (value / 100) * duration;
    
    audioRef.current.currentTime = time;
    setProgress(value);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getVolumeIcon = () => {
    if (isMuted) return <VolumeX size={20} />;
    if (volume < 0.3) return <Volume size={20} />;
    if (volume < 0.7) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };
  
  if (!currentVerse) return null;
  
  return (
    <div className="audio-player fixed bottom-0 left-0 right-0 py-3 px-4 z-10">
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedData={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        preload="auto"
      />
      
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button 
              onClick={onPrevious}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="الآية السابقة"
            >
              <SkipBack size={20} />
            </button>
            
            <button 
              onClick={togglePlay}
              className={cn(
                "p-3 rounded-full transition-all duration-300",
                isPlaying 
                  ? "bg-primary/40 hover:bg-primary/50" 
                  : "bg-primary/20 hover:bg-primary/30"
              )}
              aria-label={isPlaying ? "إيقاف" : "تشغيل"}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                isPlaying ? <Pause size={20} /> : <Play size={20} />
              )}
            </button>
            
            <button 
              onClick={onNext}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="الآية التالية"
            >
              <SkipForward size={20} />
            </button>
            
            <div className="hidden sm:flex items-center space-x-2">
              <div className="text-xs text-secondary-foreground bg-secondary/30 px-2 py-1 rounded-full">
                الآية {currentVerse.number % 1000}
              </div>
              <div className="text-sm font-medium">
                {formatTime(currentTime)} 
                <span className="text-muted-foreground mx-1">/</span> 
                {formatTime(duration)}
              </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="audio-progress w-full"
              aria-label="تقدم التشغيل"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground sm:hidden">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button 
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
            >
              {getVolumeIcon()}
            </button>
            
            <div className="w-20">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="audio-progress w-full"
                aria-label="مستوى الصوت"
              />
            </div>
            
            <div className="flex items-center space-x-2 pr-1">
              <Disc size={18} className={`text-primary ${isPlaying ? 'animate-spin' : ''}`} />
              <span className="text-xs font-medium hidden sm:inline-block">
                {currentVerse.number % 1000}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
