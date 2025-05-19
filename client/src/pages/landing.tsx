import React, { useState } from 'react';
import { Link } from "wouter";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ModalWaitlistForm = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError('');

    try {
      // In a real implementation, this would call an API endpoint
      // const response = await joinWaitlist(email);
      
      // Simulating API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      // Track conversion
      // posthog.capture('waitlist_signup', { email });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md backdrop-blur-md bg-white/70 dark:bg-neutral-800/70 border border-brand-100 dark:border-brand-700">
        <DialogHeader>
          <DialogTitle className="text-2xl">Join the Waitlist</DialogTitle>
          <DialogDescription>
            Get early access to Leavn and be the first to experience context-rich Bible study.
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white"
              disabled={isSubmitting}
              data-ab="modal-cta"
            >
              {isSubmitting ? "Submitting..." : "Join Waitlist"}
            </Button>
            <p className="text-xs text-center text-slate-500">
              We respect your privacy and will never share your email.
            </p>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-green-600 dark:text-green-400 mb-2">You're on the list!</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We'll notify you when Leavn is ready. Thank you for your interest!
            </p>
            <Button 
              onClick={() => setIsOpen(false)}
              variant="outline"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const SocialProofStrip = () => {
  return (
    <div className="py-8 border-t border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">Trusted by ministry leaders from:</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <div className="grayscale opacity-70 hover:opacity-100 transition">
            <img src="/media/church-logo-1.svg" alt="Church logo" className="h-8 w-auto" />
          </div>
          <div className="grayscale opacity-70 hover:opacity-100 transition">
            <img src="/media/church-logo-2.svg" alt="Church logo" className="h-8 w-auto" />
          </div>
          <div className="grayscale opacity-70 hover:opacity-100 transition">
            <img src="/media/church-logo-3.svg" alt="Church logo" className="h-8 w-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div className="py-16 bg-brand-50 dark:bg-transparent">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DemoSection = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">See Leavn in Action</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Watch how Leavn transforms Bible study with context, AI insights, and multiple perspectives.
          </p>
        </div>
        
        <div className="relative aspect-video max-w-4xl mx-auto backdrop-blur-sm bg-white/20 dark:bg-black/20 rounded-2xl overflow-hidden shadow-xl">
          <video 
            className="w-full h-full object-cover" 
            poster="/media/poster.jpg"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/media/landing-demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white text-lg">Discover deeper meaning with multiple perspectives</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FAQAccordion = () => {
  return (
    <div className="py-16 bg-brand-50 dark:bg-transparent">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md rounded-xl p-4">
          <AccordionItem value="item-1" className="border-b border-slate-200 dark:border-slate-700">
            <AccordionTrigger className="text-left text-lg font-medium py-4">
              What makes Leavn different from other Bible apps?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-slate-600 dark:text-slate-300">
              Leavn is the only Bible study app that uses AI to provide multiple theological perspectives, historical context, and family-friendly translations in one seamless experience. Our app brings scripture to life with rich context and personalized insights.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-b border-slate-200 dark:border-slate-700">
            <AccordionTrigger className="text-left text-lg font-medium py-4">
              Is Leavn suitable for children and families?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-slate-600 dark:text-slate-300">
              Absolutely! Leavn provides kid-friendly translations and study materials specifically designed for young readers. Parents can share biblical stories with confidence knowing the content is age-appropriate while remaining faithful to scripture.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border-b border-slate-200 dark:border-slate-700">
            <AccordionTrigger className="text-left text-lg font-medium py-4">
              How accurate are the theological perspectives?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-slate-600 dark:text-slate-300">
              Each theological perspective is developed in consultation with scholars and theologians from respective traditions. We strive for accuracy and reverence in presenting diverse viewpoints, helping users understand scripture through different faith lenses.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-b border-slate-200 dark:border-slate-700">
            <AccordionTrigger className="text-left text-lg font-medium py-4">
              Does Leavn require an internet connection?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-slate-600 dark:text-slate-300">
              Basic Bible reading works offline, but AI-powered features like theological perspectives and historical context require an internet connection. We're working on expanded offline capabilities for future releases.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="border-b-0">
            <AccordionTrigger className="text-left text-lg font-medium py-4">
              When will Leavn be available?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-slate-600 dark:text-slate-300">
              We're currently in beta testing with a limited group of users. Join our waitlist to be notified when Leavn becomes available to the public. Early waitlist members will receive priority access.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

const TrustRow = () => {
  return (
    <div className="py-8 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">SSL Secure</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">GDPR Compliant</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">No Ads</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - logo only */}
      <header className="py-6">
        <div className="container mx-auto flex justify-center">
          <div className="text-3xl font-semibold text-brand-700 dark:text-brand-300">Leavn</div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="flex-1 pt-8 pb-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Unlock context-rich Bible study in seconds.
              </h1>
              <p className="text-xl mb-8 text-slate-600 dark:text-slate-300">
                AI lenses reveal maps, traditions & kid-friendly translations—instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-brand-accent hover:bg-brand-accent/90 text-white text-lg px-8 py-6 rounded-xl"
                  onClick={() => setIsWaitlistModalOpen(true)}
                  data-ab="hero-cta"
                >
                  Join Waitlist
                </Button>
                <Link href="/app">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-6 rounded-xl"
                    data-ab="demo-cta"
                  >
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="backdrop-blur-md bg-white/20 dark:bg-black/20 rounded-2xl overflow-hidden shadow-xl">
              <video 
                className="w-full h-full object-cover" 
                poster="/media/poster.jpg"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/media/landing-demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>
      
      {/* Social proof strip */}
      <SocialProofStrip />
      
      {/* Benefits section */}
      <Benefits3Up />
      
      {/* Demo section */}
      <DemoSection />
      
      {/* FAQ section */}
      <FAQAccordion />
      
      {/* Trust indicators */}
      <TrustRow />
      
      {/* CTA repeat */}
      <section className="py-16 bg-gradient-to-b from-brand-700 to-brand-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your Bible study?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of believers experiencing scripture in a whole new way.
          </p>
          <Button 
            size="lg" 
            className="bg-white hover:bg-white/90 text-brand-700 text-lg px-8 py-6 rounded-xl"
            onClick={() => setIsWaitlistModalOpen(true)}
            data-ab="footer-cta"
          >
            Join Waitlist
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-brand-50 dark:bg-neutral-900">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-500">
                &copy; {new Date().getFullYear()} Leavn Bible App. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <Link href="/legal/privacy-policy">
                <span className="text-sm text-slate-500 hover:text-brand-accent">Privacy Policy</span>
              </Link>
              <Link href="/legal/terms-of-service">
                <span className="text-sm text-slate-500 hover:text-brand-accent">Terms of Service</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Waitlist modal */}
      <ModalWaitlistForm 
        isOpen={isWaitlistModalOpen}
        setIsOpen={setIsWaitlistModalOpen}
      />
    </div>
  );
};

export default Landing;