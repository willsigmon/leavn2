import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CTAButton } from '@/components/CTAButton';

export function WaitlistModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
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
      // analytics.capture('waitlist_signup', { email });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/50 dark:bg-neutral-800/40 border border-white/20 dark:border-neutral-700/30 shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-[#2c4c3b] to-[#3a6349] dark:from-[#3a6349] dark:to-[#4d7a5e] bg-clip-text text-transparent font-bold">Join the Waitlist</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-300">
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
                className="w-full backdrop-blur-sm bg-white/70 dark:bg-black/20 border border-[#d8e5d2] dark:border-[#2c4c3b]/50"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <CTAButton 
              type="submit" 
              className="w-full"
              loading={isSubmitting}
              data-ab="modal-cta"
            >
              Join Waitlist
            </CTAButton>
            <p className="text-xs text-center text-slate-500">
              We respect your privacy and will never share your email.
            </p>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#e8efe5] dark:bg-[#2c4c3b]/60 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2c4c3b] dark:text-[#a5c2a5]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-[#2c4c3b] dark:text-[#a5c2a5] mb-2">You're on the list!</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We'll notify you when Leavn is ready. Thank you for your interest!
            </p>
            <CTAButton 
              onClick={onClose}
              variant="ghost"
            >
              Close
            </CTAButton>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}