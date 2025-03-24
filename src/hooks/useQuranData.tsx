
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Verse {
  number: number;
  text: string;
  translation?: string;
  audioUrl?: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Verse[];
}

// Fetch list of Surahs
export const useSurahs = () => {
  return useQuery({
    queryKey: ['surahs'],
    queryFn: async () => {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await response.json();
      return data.data as Surah[];
    },
  });
};

// Fetch specific Surah with verses
export const useSurah = (surahNumber: number) => {
  return useQuery({
    queryKey: ['surah', surahNumber],
    queryFn: async () => {
      // Fetch Arabic text
      const arabicResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
      const arabicData = await arabicResponse.json();
      
      // Fetch English translation
      const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`);
      const translationData = await translationResponse.json();
      
      // Combine data
      const surahDetail: SurahDetail = arabicData.data;
      
      if (arabicData.data && translationData.data && arabicData.data.ayahs && translationData.data.ayahs) {
        surahDetail.ayahs = arabicData.data.ayahs.map((ayah: any, index: number) => ({
          number: ayah.number,
          text: ayah.text,
          translation: translationData.data.ayahs[index]?.text || '',
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`
        }));
      }
      
      return surahDetail;
    },
    enabled: !!surahNumber,
  });
};

// Get list of audio reciters
export const useReciters = () => {
  return useQuery({
    queryKey: ['reciters'],
    queryFn: async () => {
      const response = await fetch('https://api.alquran.cloud/v1/edition/format/audio');
      const data = await response.json();
      return data.data;
    },
  });
};

// Search Quran
export const useQuranSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      const response = await fetch(`https://api.alquran.cloud/v1/search/${searchTerm}/all/en`);
      const data = await response.json();
      return data.data;
    },
    enabled: searchTerm.length > 2,
  });
};
