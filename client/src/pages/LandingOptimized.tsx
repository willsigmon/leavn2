import React, { useState, Suspense } from 'react';
import { Link } from 'wouter';
import { CTAButton } from '@/components/CTAButton';
import { WaitlistModal } from '@/components/WaitlistModal';
import { ScrollHeader } from '@/components/ScrollHeader';
import { ReaderPreview } from '@/components/ReaderPreview';

import { Play } from 'lucide-react';
import Footer from '@/components/layout/Footer';
const Benefits = React.lazy(() => import('@/components/Benefits3Up'));
const FAQ = React.lazy(() => import('@/components/FAQAccordion'));

export default function LandingOptimized() {
  const [open, setOpen] = useState(false);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      {/* Scroll Header */}
      <ScrollHeader onOpenWaitlist={() => setOpen(true)} />
      
      {/* Background elements - pushed to the edge */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="bg-circle w-[30vw] h-[30vw] md:w-[500px] md:h-[500px] top-0 right-0 bg-[#2c4c3b] opacity-[0.03] animate-float"></div>
        <div className="bg-circle w-[40vw] h-[40vw] md:w-[600px] md:h-[600px] bottom-40 -right-[10vw] bg-[#2c4c3b] opacity-[0.04] animate-float-reverse animation-delay-2000"></div>
        <div className="bg-circle w-[35vw] h-[35vw] md:w-[550px] md:h-[550px] top-1/2 -left-[5vw] bg-[#2c4c3b] opacity-[0.03] animate-float-reverse animation-delay-1000"></div>
        <div className="bg-circle w-[20vw] h-[20vw] md:w-[300px] md:h-[300px] bottom-[20vh] left-[20vw] bg-[#2c4c3b] opacity-[0.025] animate-float animation-delay-3000"></div>
        <div className="bg-circle w-[15vw] h-[15vw] md:w-[200px] md:h-[200px] top-[30vh] right-[30vw] bg-[#2c4c3b] opacity-[0.02] animate-float-reverse animation-delay-1500"></div>
      </div>
      
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center py-16 md:py-24">
          <div className="text-center lg:text-left">
            <span className="inline-block rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/60 px-3 py-1 text-xs font-medium text-[#2c4c3b] dark:text-[#a5c2a5]">
              AI-guided insights
            </span>
            <h1 className="mt-6 text-4xl/tight md:text-5xl/tight xl:text-6xl/tight font-semibold text-[#2c4c3b] dark:text-white">
              Unlock <span className="bg-gradient-to-r from-[#2c4c3b] to-[#3a6349] dark:from-[#3a6349] dark:to-[#4d7a5e] bg-clip-text text-transparent">context-rich</span> Bible study.
            </h1>
            <p className="mt-4 max-w-md mx-auto lg:mx-0 text-base md:text-lg text-slate-600 dark:text-slate-300">
              AI lenses reveal maps, traditions &amp; kid-friendly translations—instantly.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <CTAButton onClick={() => setOpen(true)} data-ab="hero-cta" className="w-full sm:w-auto">Join waitlist</CTAButton>
              <Link href="/reader">
                <CTAButton variant="ghost" size="sm" icon={Play} className="w-full sm:w-auto">
                  Try demo
                </CTAButton>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 grayscale hover:grayscale-0 transition">
              {['/media/church-logo-1.svg', '/media/church-logo-2.svg', '/media/church-logo-3.svg'].map(src => (
                <img key={src} src={src} alt="Church logo" className="h-5 sm:h-6 w-auto" />
              ))}
            </div>
          </div>

          {/* Animated Reader Preview */}
          <div className="relative mt-10 lg:mt-0 max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-full mx-auto">
            <div className="transform hover:scale-[1.01] transition-transform h-[320px] md:h-[380px] lg:h-[420px]">
              <ReaderPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <Suspense fallback={null}>
        <Benefits />
      </Suspense>

      {/* Demo */}
      <section className="section">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/60 text-[#2c4c3b] dark:text-[#a5c2a5] text-sm font-semibold mb-4">
            See It In Action
          </div>
          <h2 className="text-2xl font-semibold text-[#2c4c3b] dark:text-white">Experience Leavn</h2>
        </div>
        <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl shadow-lg backdrop-blur-xl bg-white/30 dark:bg-black/20 border border-white/20 dark:border-white/5">
          <div className="relative w-full aspect-video">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2c4c3b]/80 to-[#1a2b26]/80 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center px-6 sm:px-10 md:px-16 text-center">
                <h3 className="text-white text-2xl md:text-3xl font-semibold mb-4">
                  Theological Lenses
                </h3>
                <p className="text-white/80 text-base md:text-lg mb-8">
                  Switch between Catholic, Protestant, Jewish, Academic, and more perspectives with a single click
                </p>
                
                <div className="flex justify-center space-x-3">
                  {['Protestant', 'Catholic', 'Jewish', 'Gen-Z', 'Kids'].map((lens, i) => (
                    <div
                      key={lens}
                      className={`px-3 py-1.5 rounded-full ${
                        i === 1 ? 'bg-white text-[#2c4c3b]' : 'bg-white/20 text-white'
                      } cursor-pointer text-sm font-medium`}
                    >
                      {lens}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Suspense fallback={null}>
        <FAQ />
      </Suspense>

      {/* CTA repeat */}
      <section className="py-16 bg-gradient-to-b from-[#2c4c3b] to-[#1a3328] text-white my-16 rounded-2xl relative overflow-hidden">
        {/* Subtle animated background elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-white rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full opacity-10 animate-float animation-delay-2000"></div>
        
        <div className="text-center relative z-10">
          <h3 className="text-xl font-medium">Ready to transform your Bible study?</h3>
          <p className="mt-2 text-white/80">
            Join thousands of believers experiencing scripture in a whole new way.
          </p>
          <CTAButton 
            className="mt-6 backdrop-blur-xl bg-white/90 text-[#2c4c3b] hover:bg-white"
            onClick={() => setOpen(true)}
            data-ab="footer-cta"
          >
            Join waitlist
          </CTAButton>
        </div>
      </section>

      <WaitlistModal open={open} onClose={() => setOpen(false)} />
      
      {/* Footer */}
      <Footer />
    </main>
  );
}