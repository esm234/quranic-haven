
import React from 'react';
import { Link } from 'react-router-dom';
import { useSurahs } from '../hooks/useQuranData';

export const SurahList = () => {
  const { data: surahs, isLoading, error } = useSurahs();

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading Surahs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-destructive/10 rounded-lg">
        <p className="text-destructive font-medium">Failed to load Surahs</p>
        <p className="text-muted-foreground mt-2">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 fade-in-elements">
      {surahs?.map((surah) => (
        <Link 
          key={surah.number}
          to={`/surah/${surah.number}`}
          className="glass group p-5 rounded-xl transition-all duration-300 transform hover:translate-y-[-5px] hover:shadow-xl glass-hover"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 text-foreground">
              {surah.number}
            </div>
            <div className="text-end">
              <h3 className="text-xl font-arabic mb-1">{surah.name}</h3>
              <p className="text-sm text-muted-foreground">{surah.englishName}</p>
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-secondary">
              {surah.revelationType}
            </span>
            <span className="text-xs text-muted-foreground">
              {surah.numberOfAyahs} verses
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};
