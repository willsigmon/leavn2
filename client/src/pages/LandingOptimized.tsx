import React, { useState, Suspense } from 'react';
import { Link } from 'wouter';
import { CTAButton } from '@/components/CTAButton';
import { WaitlistModal } from '@/components/WaitlistModal';
import { ScrollHeader } from '@/components/ScrollHeader';
import { Play } from 'lucide-react';
import Footer from '@/components/layout/Footer';
const Benefits = React.lazy(() => import('@/components/Benefits3Up'));
const FAQ = React.lazy(() => import('@/components/FAQAccordion'));

export default function LandingOptimized() {
  const [open, setOpen] = useState(false);

  return (
    <main className="mx-auto max-w-7xl px-4 relative min-h-screen">
      {/* Scroll Header */}
      <ScrollHeader onOpenWaitlist={() => setOpen(true)} />
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="bg-circle w-64 h-64 top-10 right-1/3 bg-[#2c4c3b]"></div>
        <div className="bg-circle w-96 h-96 bottom-40 -right-20 bg-[#2c4c3b]"></div>
        <div className="bg-circle w-80 h-80 top-1/2 -left-10 bg-[#2c4c3b]"></div>
      </div>
      
      {/* Hero */}
      <section className="grid lg:grid-cols-2 gap-10 items-center py-16">
        <div>
          <span className="inline-block rounded-full bg-[#e8efe5] dark:bg-[#2c4c3b]/60 px-3 py-1 text-xs font-medium text-[#2c4c3b] dark:text-[#a5c2a5]">
            AI-guided insights
          </span>
          <h1 className="mt-6 text-4xl/tight font-semibold text-[#2c4c3b] dark:text-white sm:text-5xl">
            Unlock <span className="bg-gradient-to-r from-[#2c4c3b] to-[#3a6349] dark:from-[#3a6349] dark:to-[#4d7a5e] bg-clip-text text-transparent">context-rich</span> Bible
            study&nbsp;in&nbsp;seconds.
          </h1>
          <p className="mt-4 max-w-md text-base text-slate-600 dark:text-slate-300">
            AI lenses reveal maps, traditions &amp; kid-friendly translations—instantly.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <CTAButton onClick={() => setOpen(true)} data-ab="hero-cta">Join waitlist</CTAButton>
            <Link href="/reader">
              <CTAButton variant="ghost" size="sm" icon={Play}>
                Try demo
              </CTAButton>
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-8 flex items-center gap-6 grayscale hover:grayscale-0 transition">
            {['/media/church-logo-1.svg', '/media/church-logo-2.svg', '/media/church-logo-3.svg'].map(src => (
              <img key={src} src={src} alt="Church logo" className="h-6 w-auto" />
            ))}
          </div>
        </div>

        {/* Hero video */}
        <div className="relative">
          <div className="backdrop-blur-xl bg-white/30 dark:bg-black/20 rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/5">
            <video
              className="aspect-video w-full rounded-xl opacity-0 transition-opacity duration-300"
              src="/media/landing-demo.mp4"
              poster="/media/poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={e => e.currentTarget.classList.remove('opacity-0')}
            />
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
          <video
            className="w-full"
            src="/media/landing-demo.mp4"
            poster="/media/poster.jpg"
            controls
            preload="none"
          />
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