
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, Search, Bookmark, Home, User, LogIn, MessageSquare } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthProvider';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isLoading } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-semibold tracking-tight animate-fade-in">
                القرآن الكريم
              </span>
            </Link>
          </div>

          {/* القائمة للشاشات الكبيرة */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors hover:bg-accent">
              <Home size={20} />
              <span className="mx-2">الرئيسية</span>
            </Link>
            <Link to="/bookmarks" className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors hover:bg-accent">
              <Bookmark size={20} />
              <span className="mx-2">المفضلة</span>
            </Link>
            <Link to="/contact" className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors hover:bg-accent">
              <MessageSquare size={20} />
              <span className="mx-2">اتصل بنا</span>
            </Link>
            <button
              onClick={toggleSearch}
              className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors hover:bg-accent"
            >
              <Search size={20} />
              <span className="mx-2">بحث</span>
            </button>
            
            {!isLoading && (
              user ? (
                <Link to="/profile" className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors hover:bg-accent">
                  <User size={20} />
                  <span className="mx-2">الحساب</span>
                </Link>
              ) : (
                <Link to="/auth" className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors hover:bg-accent">
                  <LogIn size={20} />
                  <span className="mx-2">تسجيل الدخول</span>
                </Link>
              )
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-colors hover:bg-accent"
              aria-label="تغيير المظهر"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* زر القائمة للجوال */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full transition-colors hover:bg-accent"
              aria-label="بحث"
            >
              <Search size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-colors hover:bg-accent"
              aria-label="تغيير المظهر"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full transition-colors hover:bg-accent"
              aria-label="فتح القائمة"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* القائمة للجوال */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={20} />
              <span className="mx-2">الرئيسية</span>
            </Link>
            <Link
              to="/bookmarks"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              <Bookmark size={20} />
              <span className="mx-2">المفضلة</span>
            </Link>
            <Link
              to="/contact"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageSquare size={20} />
              <span className="mx-2">اتصل بنا</span>
            </Link>
            {!isLoading && (
              user ? (
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  <span className="mx-2">الحساب</span>
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn size={20} />
                  <span className="mx-2">تسجيل الدخول</span>
                </Link>
              )
            )}
          </div>
        </div>
      )}

      {/* طبقة البحث */}
      {isSearchOpen && (
        <div className="absolute top-full right-0 left-0 bg-background/95 backdrop-blur-lg border-b border-border p-4 animate-fade-in">
          <SearchBar onClose={toggleSearch} />
        </div>
      )}
    </nav>
  );
};
