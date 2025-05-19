import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQAccordion = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#f0f4ed]/80 dark:from-transparent dark:to-[#1a2920]/50 relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute bottom-10 right-10 w-20 h-20 bg-[#c5d5bc] dark:bg-[#2c4c3b] rounded-full opacity-20 animate-slow"></div>
      <div className="absolute top-20 left-20 w-24 h-24 bg-[#d8e5d2] dark:bg-[#345841] rounded-full opacity-20 animate-float-reverse animation-delay-1000"></div>
      
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/60 text-[#2c4c3b] dark:text-[#a5c2a5] text-sm font-semibold mb-4">
            Common Questions
          </div>
          <h2 className="text-3xl font-bold">Frequently Asked <span className="bg-gradient-to-r from-[#2c4c3b] to-[#3a6349] dark:from-[#3a6349] dark:to-[#4d7a5e] bg-clip-text text-transparent">Questions</span></h2>
        </div>
        
        <Accordion type="single" collapsible className="backdrop-blur-xl bg-white/50 dark:bg-black/20 rounded-xl p-6 shadow-lg border border-white/20 dark:border-white/5">
          <AccordionItem value="item-1" className="border-b border-slate-200/50 dark:border-slate-700/50">
            <AccordionTrigger className="text-left text-lg font-medium py-4 text-[#2c4c3b] dark:text-[#a5c2a5]">
              What makes Leavn different from other Bible apps?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-slate-600 dark:text-slate-300">
              Leavn is the only Bible study app that uses AI to provide multiple theological perspectives, historical context, and family-friendly translations in one seamless experience. Our app brings scripture to life with rich context and personalized insights.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-b border-slate-200/50 dark:border-slate-700/50">
            <AccordionTrigger className="text-left text-lg font-medium py-4 text-[#2c4c3b] dark:text-[#a5c2a5]">
              Is Leavn suitable for children and families?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-slate-600 dark:text-slate-300">
              Absolutely! Leavn provides kid-friendly translations and study materials specifically designed for young readers. Parents can share biblical stories with confidence knowing the content is age-appropriate while remaining faithful to scripture.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border-b border-slate-200/50 dark:border-slate-700/50">
            <AccordionTrigger className="text-left text-lg font-medium py-4 text-[#2c4c3b] dark:text-[#a5c2a5]">
              How accurate are the theological perspectives?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-slate-600 dark:text-slate-300">
              Each theological perspective is developed in consultation with scholars and theologians from respective traditions. We strive for accuracy and reverence in presenting diverse viewpoints, helping users understand scripture through different faith lenses.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-b border-slate-200/50 dark:border-slate-700/50">
            <AccordionTrigger className="text-left text-lg font-medium py-4 text-[#2c4c3b] dark:text-[#a5c2a5]">
              Does Leavn require an internet connection?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-slate-600 dark:text-slate-300">
              Basic Bible reading works offline, but AI-powered features like theological perspectives and historical context require an internet connection. We're working on expanded offline capabilities for future releases.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="border-b-0">
            <AccordionTrigger className="text-left text-lg font-medium py-4 text-[#2c4c3b] dark:text-[#a5c2a5]">
              When will Leavn be available?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-slate-600 dark:text-slate-300">
              We're currently in beta testing with a limited group of users. Join our waitlist to be notified when Leavn becomes available to the public. Early waitlist members will receive priority access.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default FAQAccordion;