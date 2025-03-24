
import React from 'react';
import { BookmarksList } from '../components/Bookmark';
import { Book } from 'lucide-react';

const Bookmarks = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center">
          <Book className="ml-3" size={24} />
          <h1 className="text-2xl font-semibold">المفضلة</h1>
        </div>
        
        <BookmarksList />
      </div>
    </div>
  );
};

export default Bookmarks;
