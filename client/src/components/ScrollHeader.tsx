import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { BookOpen, Menu, X } from 'lucide-react';
import { CTAButton } from './CTAButton';

interface ScrollHeaderProps {
  onOpenWaitlist: () => void;
}

export function ScrollHeader({ onOpenWaitlist }: ScrollHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show header after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform backdrop-blur-lg bg-white/70 dark:bg-black/60 border-b border-white/10 dark:border-gray-800/30 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <BookOpen className="h-6 w-6 text-[#2c4c3b] dark:text-[#a5c2a5]" />
            <span className="text-xl font-semibold text-[#2c4c3b] dark:text-[#a5c2a5]">Leavn</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/reader">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-[#2c4c3b] dark:hover:text-[#a5c2a5] transition-colors">
              Reader
            </span>
          </Link>
          <Link href="/reading-plans">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-[#2c4c3b] dark:hover:text-[#a5c2a5] transition-colors">
              Reading Plans
            </span>
          </Link>
          <Link href="/explorer">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-[#2c4c3b] dark:hover:text-[#a5c2a5] transition-colors">
              Explorer
            </span>
          </Link>
          <CTAButton onClick={onOpenWaitlist} size="sm" data-ab="header-cta">Join Waitlist</CTAButton>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-slate-700 dark:text-slate-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-lg bg-white/90 dark:bg-black/90 border-b border-gray-200 dark:border-gray-800 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link href="/reader" onClick={() => setIsMenuOpen(false)}>
              <span className="block py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-[#2c4c3b] dark:hover:text-[#a5c2a5]">
                Reader
              </span>
            </Link>
            <Link href="/reading-plans" onClick={() => setIsMenuOpen(false)}>
              <span className="block py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-[#2c4c3b] dark:hover:text-[#a5c2a5]">
                Reading Plans
              </span>
            </Link>
            <Link href="/explorer" onClick={() => setIsMenuOpen(false)}>
              <span className="block py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-[#2c4c3b] dark:hover:text-[#a5c2a5]">
                Explorer
              </span>
            </Link>
            <CTAButton 
              onClick={() => {
                onOpenWaitlist();
                setIsMenuOpen(false);
              }} 
              className="w-full"
              data-ab="mobile-header-cta"
            >
              Join Waitlist
            </CTAButton>
          </div>
        </div>
      )}
    </header>
  );
}