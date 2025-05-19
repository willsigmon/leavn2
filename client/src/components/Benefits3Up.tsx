import React from 'react';

const Benefits3Up = () => {
  const benefits = [
    {
      icon: "✨",
      title: "AI Theological Lenses",
      description: "Explore scripture through Protestant, Catholic, Orthodox & more perspectives."
    },
    {
      icon: "🗺️",
      title: "Historical Context",
      description: "Instantly see maps, timelines, and cultural backgrounds for any passage."
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Family-Friendly",
      description: "Kid-friendly translations and study guides for all ages."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-[#f0f4ed]/80 to-white dark:from-[#1a2920]/80 dark:to-transparent">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/60 text-[#2c4c3b] dark:text-[#a5c2a5] text-sm font-semibold mb-4">
            Key Features
          </div>
          <h2 className="text-3xl font-bold mb-4">Bible Study for <span className="bg-gradient-to-r from-[#2c4c3b] to-[#3a6349] dark:from-[#3a6349] dark:to-[#4d7a5e] bg-clip-text text-transparent">deeper understanding</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <div key={i} className="backdrop-blur-md bg-white/40 dark:bg-black/20 rounded-xl p-6 shadow-lg border border-white/20 dark:border-white/5 text-center hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="text-4xl mb-4 bg-[#e8efe5] dark:bg-[#2c4c3b]/60 w-16 h-16 rounded-full flex items-center justify-center mx-auto">{benefit.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-[#2c4c3b] dark:text-[#a5c2a5]">{benefit.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits3Up;