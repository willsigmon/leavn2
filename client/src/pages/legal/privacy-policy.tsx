import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function PrivacyPolicy() {
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
        
        <h1 className="text-3xl font-bold text-primary">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: May 15, {currentYear}</p>
        
        <Separator className="my-2" />
        
        <div className="prose prose-emerald max-w-none">
          <p className="lead">
            At Leavn, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Bible study platform.
          </p>
          
          <h2>1. Information We Collect</h2>
          <h3>1.1 Personal Information</h3>
          <p>
            We may collect personally identifiable information, such as:
          </p>
          <ul>
            <li>Your name and email address when you create an account</li>
            <li>Your profile information and preferences</li>
            <li>Authentication information when you log in using third-party services</li>
          </ul>
          
          <h3>1.2 Usage Information</h3>
          <p>
            We may collect non-personal information about how you use our service, including:
          </p>
          <ul>
            <li>Reading patterns and history</li>
            <li>Notes, highlights, and annotations you create</li>
            <li>Preferences for theological perspectives and study features</li>
            <li>Interaction with reading plans and other content</li>
          </ul>
          
          <h3>1.3 Device Information</h3>
          <p>
            We may collect information about the device you use to access Leavn, such as:
          </p>
          <ul>
            <li>Device type, operating system, and browser information</li>
            <li>IP address and general location information</li>
            <li>Unique device identifiers</li>
          </ul>
          
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Personalize your experience based on your preferences and usage patterns</li>
            <li>Process your subscriptions and transactions</li>
            <li>Send you updates, security alerts, and support messages</li>
            <li>Analyze usage trends to enhance our platform</li>
            <li>Develop new features based on user interactions</li>
            <li>Protect against unauthorized access and potential abuse of our services</li>
          </ul>
          
          <h2>3. Sharing Your Information</h2>
          <p>
            We may share your information in the following circumstances:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> We may share your information with third-party vendors who help us provide and improve our services, such as cloud hosting providers and payment processors.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</li>
            <li><strong>Business Transfers:</strong> If Leavn is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
          </ul>
          <p>
            We will never sell your personal information to third parties for marketing purposes.
          </p>
          
          <h2>4. AI and Data Processing</h2>
          <p>
            Leavn uses artificial intelligence to enhance your Bible study experience. Here's how we handle data in relation to our AI features:
          </p>
          <ul>
            <li>The content you create (notes, highlights, questions) may be processed by our AI systems to provide personalized insights and recommendations.</li>
            <li>Biblical content analysis is performed to provide theological perspectives and contextual information.</li>
            <li>We may use aggregated, anonymized data to improve our AI models and features.</li>
          </ul>
          <p>
            You can control AI-assisted features through your account settings.
          </p>
          
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul>
            <li>Encryption of transmitted data</li>
            <li>Regular security assessments</li>
            <li>Restricted access to personal information</li>
            <li>Secure data storage practices</li>
          </ul>
          <p>
            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
          
          <h2>6. Your Data Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul>
            <li><strong>Access:</strong> You may request access to the personal information we hold about you.</li>
            <li><strong>Correction:</strong> You may request that we correct inaccurate or incomplete information.</li>
            <li><strong>Deletion:</strong> You may request that we delete your personal information.</li>
            <li><strong>Portability:</strong> You may request a copy of your data in a structured, commonly used format.</li>
            <li><strong>Restriction:</strong> You may request that we restrict the processing of your information.</li>
            <li><strong>Objection:</strong> You may object to our processing of your information.</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information in the "Contact Us" section.
          </p>
          
          <h2>7. Children's Privacy</h2>
          <p>
            Leavn is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete that information.
          </p>
          
          <h2>8. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than the one in which you reside. These countries may have different data protection laws than your country of residence.
          </p>
          <p>
            When we transfer your information to other countries, we will protect it as described in this Privacy Policy and in accordance with applicable data protection laws.
          </p>
          
          <h2>9. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
          </p>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
          </p>
          
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
          
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <p>
            <strong>Email:</strong> privacy@leavn.com<br />
            <strong>Mail:</strong> Leavn Privacy Team, 123 Faith Avenue, Anytown, USA 12345
          </p>
        </div>
      </div>
    </div>
  );
}