import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { motion as m } from 'framer-motion';

const features = [
  {
    title: "Theological Lenses",
    description: "Switch between Catholic, Protestant, Jewish, Academic, and more perspectives with a single click",
    duration: 5000
  },
  {
    title: "Narrative Mode",
    description: "Transform scripture into immersive narrative prose inspired by 'The Chosen'",
    duration: 5000
  },
  {
    title: "Smart Tagging",
    description: "Automatically identify people, places, themes, and connections across scripture",
    duration: 5000
  },
  {
    title: "Contextual Insights",
    description: "Understand historical context, geography, and cultural nuances with AI assistance",
    duration: 5000
  }
];

export function ReaderShowcaseVideo() {
  const [activeFeature, setActiveFeature] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, features[activeFeature].duration);

    return () => clearTimeout(timer);
  }, [activeFeature]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="relative backdrop-blur-xl bg-white/30 dark:bg-black/20 rounded-2xl overflow-hidden border border-white/20 dark:border-white/5">
      {/* Interactive Video Demo */}
      <div className="relative w-full aspect-video">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2c4c3b]/80 to-[#1a2b26]/80 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center px-6 sm:px-10 md:px-16 text-center">
            {/* Feature Indicator */}
            <div className="w-full mb-8">
              <div className="flex justify-between mb-2">
                {features.map((_, index) => (
                  <button 
                    key={index}
                    className={`rounded-full ${
                      index === activeFeature 
                        ? 'bg-white w-3 h-3' 
                        : 'bg-white/40 w-2 h-2'
                    } transition-all duration-300`}
                    onClick={() => setActiveFeature(index)}
                  />
                ))}
              </div>
            </div>
            
            {/* Feature Content */}
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg"
            >
              <h3 className="text-white text-2xl md:text-3xl font-semibold mb-4">
                {features[activeFeature].title}
              </h3>
              <p className="text-white/80 text-base md:text-lg">
                {features[activeFeature].description}
              </p>
            </motion.div>
            
            {/* Demo UI Animation */}
            <div className="mt-8 w-full max-w-md">
              {activeFeature === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center space-x-3"
                >
                  {['Protestant', 'Catholic', 'Jewish', 'Gen-Z', 'Kids'].map((lens, i) => (
                    <motion.div
                      key={lens}
                      initial={{ scale: 0.9, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`px-3 py-1.5 rounded-full ${
                        i === 1 ? 'bg-white text-[#2c4c3b]' : 'bg-white/20 text-white'
                      } cursor-pointer text-sm font-medium`}
                    >
                      {lens}
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              {activeFeature === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white border border-white/20"
                >
                  <p className="text-sm italic leading-relaxed">
                    "Peter's eyes widened as the waves crashed around their small boat. The storm had appeared suddenly, 
                    and now fear gripped his heart. But then he saw Him—Jesus, walking on the water as if it were solid ground..."
                  </p>
                </motion.div>
              )}
              
              {activeFeature === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-wrap justify-center gap-2"
                >
                  {['CREATION', 'LIGHT', 'COVENANT', 'MOSES', 'JERUSALEM', 'FAITH'].map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.15 }}
                      className="px-2 py-1 rounded-full bg-white/20 text-white text-xs"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              )}
              
              {activeFeature === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white border border-white/20"
                >
                  <h4 className="text-sm font-semibold mb-1">Historical Context</h4>
                  <p className="text-xs text-white/80 mb-3">
                    First Century Palestine under Roman occupation shaped Jesus's ministry and teachings.
                  </p>
                  <h4 className="text-sm font-semibold mb-1">Geography</h4>
                  <p className="text-xs text-white/80">
                    The Sea of Galilee sits 700 feet below sea level, causing sudden storms that would have terrified fishermen.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}