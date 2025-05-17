import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function TermsOfService() {
  const [, navigate] = useLocation();
  const currentYear = new Date().getFullYear();

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold text-primary">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: May 15, {currentYear}</p>
        
        <Separator className="my-2" />
        
        <div className="prose prose-emerald max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Leavn Bible Study platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
          </p>
          
          <h2>2. Description of Service</h2>
          <p>
            Leavn is a digital Bible study platform that provides tools for scripture reading, analysis, and spiritual growth through multiple theological perspectives. The Service includes features such as Bible study tools, theological commentary, personalized notes, reading plans, and AI-assisted analysis.
          </p>
          
          <h2>3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
          </p>
          
          <h2>4. Content</h2>
          <h3>4.1 User Content</h3>
          <p>
            Our Service allows you to create and store certain information, including notes, highlights, and comments ("User Content"). You retain full ownership of your User Content.
          </p>
          <p>
            By posting User Content, you grant Leavn a license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service. This license does not grant us the right to sell your User Content or to use it for any commercial purpose.
          </p>
          
          <h3>4.2 Biblical Content</h3>
          <p>
            The biblical texts available through the Service are either in the public domain (e.g., King James Version, World English Bible) or used with permission from their respective copyright holders.
          </p>
          <p>
            Theological commentaries and other interpretive content provided by Leavn represent various faith traditions and perspectives. This content is provided for educational purposes and does not necessarily reflect the official position of any particular religious organization.
          </p>
          
          <h3>4.3 AI-Generated Content</h3>
          <p>
            Some content on Leavn is generated using artificial intelligence. While we strive to provide accurate information, AI-generated content should be used as a supplement to, not a replacement for, traditional spiritual guidance and scholarship.
          </p>
          
          <h2>5. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding User Content and public domain content), features, and functionality are and will remain the exclusive property of Leavn and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>
          
          <h2>6. Free and Paid Services</h2>
          <p>
            Leavn offers both free and paid features. You are not required to purchase any paid features to use the basic functions of the Service.
          </p>
          <p>
            By selecting a paid subscription, you agree to pay Leavn the monthly or annual subscription fees indicated for your subscription type. Subscription payments will be charged to your credit card through our payment processor at the confirmation of purchase.
          </p>
          
          <h2>7. Limitation of Liability</h2>
          <p>
            In no event shall Leavn, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
          
          <h2>8. Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
          </p>
          
          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </p>
          
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
          
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> support@leavn.com<br />
            <strong>Mail:</strong> Leavn Bible Study, 123 Faith Avenue, Anytown, USA 12345
          </p>
        </div>
      </div>
    </div>
  );
}