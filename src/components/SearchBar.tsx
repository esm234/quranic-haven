
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useQuranSearch } from '../hooks/useQuranData';
import { Link } from 'react-router-dom';

interface SearchBarProps {
  onClose?: () => void;
}

export const SearchBar = ({ onClose }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  
  const { data: searchResults, isLoading } = useQuranSearch(debouncedTerm);
  
  // عمل تأخير للبحث
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClear = () => {
    setSearchTerm('');
    setDebouncedTerm('');
  };
  
  const handleItemClick = () => {
    if (onClose) onClose();
    handleClear();
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search size={18} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="ابحث في القرآن الكريم..."
          className="block w-full pr-10 pl-10 py-2.5 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          autoFocus
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <X size={18} className="text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
      
      {debouncedTerm.length > 2 && (
        <div className="mt-4 rounded-lg bg-background/90 backdrop-blur-sm border border-border shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="inline-block h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-muted-foreground">جار البحث...</p>
            </div>
          ) : searchResults?.matches?.length ? (
            <div className="divide-y divide-border">
              {searchResults.matches.slice(0, 20).map((match: any, index: number) => (
                <Link
                  key={index}
                  to={`/surah/${match.surah.number}/${match.numberInSurah}`}
                  className="block p-3 hover:bg-secondary/40 transition-colors"
                  onClick={handleItemClick}
                >
                  <div className="flex flex-col justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">
                        {match.surah.englishName} ({match.surah.number}:{match.numberInSurah})
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 arabic-text">
                        {match.text.length > 120 
                          ? match.text.substring(0, 120) + '...' 
                          : match.text
                        }
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              لم يتم العثور على نتائج
            </div>
          )}
        </div>
      )}
    </div>
  );
};
