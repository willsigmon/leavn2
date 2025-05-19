import React, { useState, useEffect } from 'react';
import { BookOpen, MenuIcon, Bookmark, MessageCircle, Settings, ChevronRight, ChevronLeft } from 'lucide-react';

export function DemoPreview() {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [activeVerse, setActiveVerse] = useState(3);
  const [activeLens, setActiveLens] = useState('E');
  const [showCommentary, setShowCommentary] = useState(false);
  
  // Cycling through animations
  useEffect(() => {
    const highlightTimer = setTimeout(() => {
      setIsHighlighted(true);
      setShowCommentary(true);
      
      const lensTimer = setTimeout(() => {
        setActiveLens('C');
        
        const resetTimer = setTimeout(() => {
          setIsHighlighted(false);
          setShowCommentary(false);
          setActiveLens('E');
          
          // Move to next verse after a cycle
          const verseTimer = setTimeout(() => {
            setActiveVerse(prev => prev === 3 ? 4 : (prev === 4 ? 5 : 3));
          }, 1000);
          
          return () => clearTimeout(verseTimer);
        }, 5000);
        
        return () => clearTimeout(resetTimer);
      }, 4000);
      
      return () => clearTimeout(lensTimer);
    }, 3000);
    
    return () => clearTimeout(highlightTimer);
  }, [activeVerse]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl border-2 border-white dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-500">
      {/* Reader Header */}
      <div className="bg-[#e8efe5] dark:bg-[#284233]/90 p-2 sm:p-3 border-b border-[#d8e5d2] dark:border-[#2c4c3b]/50 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <MenuIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#2c4c3b] dark:text-[#a5c2a5]" />
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[#2c4c3b] dark:text-[#a5c2a5] mr-1 sm:mr-2" />
            <span className="font-medium text-sm sm:text-base text-[#2c4c3b] dark:text-[#a5c2a5]">Genesis 1</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="flex items-center">
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-[#2c4c3b] dark:text-[#a5c2a5] cursor-pointer hover:bg-[#d8e5d2] dark:hover:bg-[#345841]/30 rounded-full p-1" />
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#2c4c3b] dark:text-[#a5c2a5] cursor-pointer hover:bg-[#d8e5d2] dark:hover:bg-[#345841]/30 rounded-full p-1" />
          </div>
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-[#d8e5d2] dark:bg-[#345841] flex items-center justify-center cursor-pointer">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-[#2c4c3b] dark:text-[#a5c2a5]" />
          </div>
        </div>
      </div>
      
      {/* Reader Content */}
      <div className="p-2 md:p-3 overflow-hidden relative h-full">
        <div className="relative max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
          <p className={`font-serif text-sm sm:text-base text-stone-800 dark:text-stone-200 mb-1.5 transition-all duration-300 ${activeVerse === 1 ? 'bg-[#f0f4ed]/50 dark:bg-[#2c4c3b]/20 -mx-2 px-2 py-1 rounded' : ''}`}>
            <span className="text-[#2c4c3b] dark:text-[#a5c2a5] font-semibold mr-1.5">1</span>
            In the beginning God created the heavens and the earth.
          </p>
          
          <p className={`font-serif text-sm sm:text-base text-stone-800 dark:text-stone-200 mb-1.5 transition-all duration-300 ${activeVerse === 2 ? 'bg-[#f0f4ed]/50 dark:bg-[#2c4c3b]/20 -mx-2 px-2 py-1 rounded' : ''}`}>
            <span className="text-[#2c4c3b] dark:text-[#a5c2a5] font-semibold mr-1.5">2</span>
            Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.
          </p>
          
          {/* Highlighted Verse with Commentary Animation */}
          <div className={`my-1.5 p-2 transition-all duration-500 ${isHighlighted ? 'bg-[#f0f4ed] dark:bg-[#2c4c3b]/30 rounded-lg border-l-4 border-[#3a6349] dark:border-[#3a6349]' : ''}`}>
            <p className="font-serif text-sm sm:text-base text-stone-800 dark:text-stone-200">
              <span className="text-[#2c4c3b] dark:text-[#a5c2a5] font-semibold mr-1.5">3</span>
              And God said, "<span className={`relative inline-block ${isHighlighted ? 'text-[#3a6349] dark:text-[#a5c2a5] font-medium' : ''}`}>Let there be light</span>," and there was light.
            </p>
            
            {/* Commentary Popup - Animated */}
            <div className={`mt-2 p-2 bg-white dark:bg-gray-800 rounded shadow-md border border-[#d8e5d2] dark:border-[#2c4c3b] transition-all duration-500 ${showCommentary ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
              <div className="flex items-center mb-1">
                <div className="h-3 w-3 rounded-full bg-[#3a6349] dark:bg-[#3a6349] mr-1.5"></div>
                <span className="text-xs font-medium text-[#2c4c3b] dark:text-[#a5c2a5]">
                  {activeLens === 'E' ? 'Evangelical Perspective' : 
                   activeLens === 'C' ? 'Catholic Perspective' : 
                   'Jewish Perspective'}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {activeLens === 'E' 
                  ? "This powerful declaration demonstrates God's creative power through His spoken word, establishing His authority over creation."
                  : activeLens === 'C' 
                    ? "The creation of light represents the first step in God's ordering of chaos, symbolizing divine wisdom illuminating the darkness."
                    : "The Hebrew 'yehi or' (let there be light) is the first creative utterance, reflecting God's ability to bring forth existence through speech."}
              </p>
            </div>
          </div>
          
          <p className={`font-serif text-sm sm:text-base text-stone-800 dark:text-stone-200 mb-1.5 transition-all duration-300 ${activeVerse === 4 ? 'bg-[#f0f4ed]/50 dark:bg-[#2c4c3b]/20 -mx-2 px-2 py-1 rounded' : ''}`}>
            <span className="text-[#2c4c3b] dark:text-[#a5c2a5] font-semibold mr-1.5">4</span>
            God saw that the light was good, and he separated the light from the darkness.
          </p>
          
          <p className={`font-serif text-sm sm:text-base text-stone-800 dark:text-stone-200 mb-1.5 transition-all duration-300 ${activeVerse === 5 ? 'bg-[#f0f4ed]/50 dark:bg-[#2c4c3b]/20 -mx-2 px-2 py-1 rounded' : ''}`}>
            <span className="text-[#2c4c3b] dark:text-[#a5c2a5] font-semibold mr-1.5">5</span>
            God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.
          </p>
        </div>
        
        {/* Lens Switcher */}
        <div className="absolute bottom-3 right-3 flex bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-md transition-all duration-300 hover:shadow-lg">
          <div 
            className={`h-6 w-6 rounded-full text-xs flex items-center justify-center text-center font-medium transition-all duration-300 cursor-pointer ${activeLens === 'E' ? 'bg-[#e8efe5] dark:bg-[#2c4c3b] text-[#2c4c3b] dark:text-[#a5c2a5]' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
            onClick={() => setActiveLens('E')}
          >E</div>
          <div 
            className={`h-6 w-6 rounded-full text-xs flex items-center justify-center text-center font-medium ml-1 transition-all duration-300 cursor-pointer ${activeLens === 'C' ? 'bg-[#e8efe5] dark:bg-[#2c4c3b] text-[#2c4c3b] dark:text-[#a5c2a5]' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
            onClick={() => setActiveLens('C')}
          >C</div>
          <div 
            className={`h-6 w-6 rounded-full text-xs flex items-center justify-center text-center font-medium ml-1 transition-all duration-300 cursor-pointer ${activeLens === 'J' ? 'bg-[#e8efe5] dark:bg-[#2c4c3b] text-[#2c4c3b] dark:text-[#a5c2a5]' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
            onClick={() => setActiveLens('J')}
          >J</div>
        </div>
        
        {/* Floating Action Buttons */}
        <div className="absolute top-1/2 right-1 transform -translate-y-1/2 flex flex-col space-y-1.5">
          <div className="h-7 w-7 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/60 text-[#2c4c3b] dark:text-[#a5c2a5] flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-300">
            <Bookmark className="h-3 w-3" />
          </div>
          <div className="h-7 w-7 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/60 text-[#2c4c3b] dark:text-[#a5c2a5] flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-300">
            <MessageCircle className="h-3 w-3" />
          </div>
        </div>
        
        {/* Hovering Tags Decoration - Subtle animation */}
        <div className="absolute top-[25%] left-[40%] bg-[#f0f4ed] dark:bg-[#2c4c3b]/30 text-[10px] px-1.5 py-0.5 rounded-full text-[#2c4c3b] dark:text-[#a5c2a5] opacity-70 animate-float-reverse">CREATION</div>
        <div className="absolute top-[55%] left-[15%] bg-[#f0f4ed] dark:bg-[#2c4c3b]/30 text-[10px] px-1.5 py-0.5 rounded-full text-[#2c4c3b] dark:text-[#a5c2a5] opacity-70 animate-float animation-delay-1500">LIGHT</div>
      </div>
    </div>
  );
}

