
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, Search, Bookmark, Home } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useTheme } from '../hooks/useTheme';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-semibold tracking-tight animate-fade-in">
                قرآن كريم
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors hover:bg-accent">
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link to="/bookmarks" className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors hover:bg-accent">
              <Bookmark size={20} />
              <span>Bookmarks</span>
            </Link>
            <button
              onClick={toggleSearch}
              className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors hover:bg-accent"
            >
              <Search size={20} />
              <span>Search</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-colors hover:bg-accent"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full transition-colors hover:bg-accent"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-colors hover:bg-accent"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full transition-colors hover:bg-accent"
              aria-label="Open menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link
              to="/bookmarks"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              <Bookmark size={20} />
              <span>Bookmarks</span>
            </Link>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border p-4 animate-fade-in">
          <SearchBar onClose={toggleSearch} />
        </div>
      )}
    </nav>
  );
};
