import { PageHeader } from '@/components/layout/PageHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TermsOfService() {
  const lastUpdated = 'May 15, 2025';
  
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <PageHeader
        title="Terms of Service"
        description="Agreement governing your use of Leavn Bible Study"
        breadcrumbs={[
          { label: 'Legal', href: '/legal' },
          { label: 'Terms of Service' }
        ]}
      />

      <div className="space-y-8">
        <div className="prose prose-emerald max-w-none">
          <p className="text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>
          
          <p className="lead">
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Leavn Bible Study application ("the Application") operated by Leavn ("us", "we", or "our").
          </p>
          
          <p>
            Your access to and use of the Application is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Application.
          </p>
          
          <p>
            By accessing or using the Application, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Application.
          </p>
          
          <h2 className="mt-8">Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
          
          <p>
            You are responsible for safeguarding the password that you use to access the Application and for any activities or actions under your password.
          </p>
          
          <p>
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="intellectual-property">
            <AccordionTrigger className="text-lg font-semibold">Intellectual Property</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>
                The Application and its original content, features, and functionality are and will remain the exclusive property of Leavn and its licensors. The Application is protected by copyright, trademark, and other laws.
              </p>
              
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Leavn.
              </p>
              
              <h4>Bible Text Copyright</h4>
              <p>
                The Bible texts provided in the Application are from various sources:
              </p>
              <ul>
                <li>
                  <strong>King James Version (KJV)</strong>: The text of the King James Version (KJV) is in the public domain.
                </li>
                <li>
                  <strong>World English Bible (WEB)</strong>: The World English Bible is in the public domain.
                </li>
                <li>
                  Other Bible translations may be subject to copyright by their respective publishers. Any use of copyrighted material is done under fair use for personal study or in accordance with licensing agreements.
                </li>
              </ul>
              
              <h4>User-Generated Content</h4>
              <p>
                You retain the rights to any content you submit, post, or display on or through the Application, such as notes, highlights, and comments. By submitting such content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute it in connection with the Application.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="use-restrictions">
            <AccordionTrigger className="text-lg font-semibold">Use Restrictions</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>
                Your use of the Application is subject to the following restrictions:
              </p>
              <ul>
                <li>
                  You may not use the Application in any way that violates any applicable national or international law or regulation.
                </li>
                <li>
                  You may not use the Application to transmit any material that is defamatory, offensive, or otherwise objectionable.
                </li>
                <li>
                  You may not attempt to gain unauthorized access to any portion of the Application, other accounts, or any other systems or networks connected to the Application.
                </li>
                <li>
                  You may not use the Application to collect or harvest any personal data of other users.
                </li>
                <li>
                  You may not use the Application for any commercial purposes without our explicit consent.
                </li>
                <li>
                  You may not replicate, duplicate, copy, sell, resell, or exploit any portion of the Application without express written permission.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="ai-features">
            <AccordionTrigger className="text-lg font-semibold">AI-Generated Content</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>
                Our Application incorporates AI-generated content, including but not limited to:
              </p>
              <ul>
                <li>
                  <strong>Theological Commentary</strong>: AI-generated interpretations and insights from various theological traditions and perspectives.
                </li>
                <li>
                  <strong>Narrative Transformations</strong>: AI-powered conversions of biblical text into narrative prose.
                </li>
                <li>
                  <strong>Contextual Answers</strong>: AI-generated responses to questions about Scripture.
                </li>
                <li>
                  <strong>Visual Art</strong>: AI-generated illustrations related to biblical content.
                </li>
              </ul>
              
              <p>
                By using these features, you acknowledge and agree to the following:
              </p>
              <ul>
                <li>
                  AI-generated content is provided for study and reflection purposes and should not be regarded as authoritative theological guidance.
                </li>
                <li>
                  While we strive for accuracy, AI-generated content may contain errors, inconsistencies, or statements that do not align with particular theological traditions.
                </li>
                <li>
                  Users should exercise critical thinking and discernment when engaging with AI-generated content.
                </li>
                <li>
                  You will not present AI-generated content from our Application as your own work or as official doctrine of any religious organization.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cancellation">
            <AccordionTrigger className="text-lg font-semibold">Termination and Account Cancellation</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              
              <p>
                Upon termination, your right to use the Application will immediately cease. If you wish to terminate your account, you may simply discontinue using the Application or follow the account deletion process within the Application.
              </p>
              
              <p>
                All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="disclaimers">
            <AccordionTrigger className="text-lg font-semibold">Disclaimers and Limitations</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <h4>Disclaimer of Warranties</h4>
              <p>
                The Application is provided on an "AS IS" and "AS AVAILABLE" basis. Leavn and its suppliers and licensors hereby disclaim all warranties of any kind, express or implied, including, without limitation, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              
              <p>
                Neither Leavn nor its suppliers and licensors makes any warranty that the Application will be error-free or that access to it will be continuous or uninterrupted.
              </p>
              
              <h4>Limitation of Liability</h4>
              <p>
                In no event shall Leavn, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ol>
                <li>Your access to or use of or inability to access or use the Application;</li>
                <li>Any conduct or content of any third party on the Application;</li>
                <li>Any content obtained from the Application; and</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="theological-neutrality">
            <AccordionTrigger className="text-lg font-semibold">Theological Neutrality Statement</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>
                Leavn Bible Study strives to provide multiple theological perspectives to facilitate biblical study across different traditions. Our multi-lens approach includes perspectives from Evangelical, Catholic, Jewish, and other traditions, as well as contemporary interpretations.
              </p>
              
              <p>
                We make efforts to present each theological perspective in a fair and accurate manner, but we do not endorse any particular theological position or religious denomination. The inclusion of a particular perspective does not imply endorsement, and the exclusion of a perspective does not imply rejection.
              </p>
              
              <p>
                Users are encouraged to engage with the Application in accordance with their own faith traditions and to exercise discernment when considering different theological interpretations.
              </p>
              
              <p>
                When interacting with AI-generated content, users should be aware that while we train our systems to represent perspectives accurately, AI-generated commentary should not be considered a substitute for the teachings of faith communities or religious authorities.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="governing-law">
            <AccordionTrigger className="text-lg font-semibold">Governing Law</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States of America, without regard to its conflict of law provisions.
              </p>
              
              <p>
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="changes">
            <AccordionTrigger className="text-lg font-semibold">Changes to Terms</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
              </p>
              
              <p>
                What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Application after those revisions become effective, you agree to be bound by the revised Terms.
              </p>
              
              <p>
                If you do not agree to the new Terms, please stop using the Application.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="prose prose-emerald max-w-none">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          
          <address className="not-italic mt-4 mb-8">
            <p><strong>Leavn Bible Study</strong></p>
            <p>Email: terms@leavn.com</p>
            <p>Address: 123 Faith Way, Scripture Valley, CA 90210</p>
          </address>
          
          <p className="text-center text-muted-foreground text-sm border-t pt-6 mt-8">
            © {new Date().getFullYear()} Leavn Bible Study. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}