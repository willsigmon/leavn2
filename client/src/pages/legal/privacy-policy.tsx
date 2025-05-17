import { PageHeader } from '@/components/layout/PageHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PrivacyPolicy() {
  const lastUpdated = 'May 15, 2025';
  
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <PageHeader
        title="Privacy Policy"
        description="How we collect, use, and protect your information"
        breadcrumbs={[
          { label: 'Legal', href: '/legal' },
          { label: 'Privacy Policy' }
        ]}
      />

      <div className="space-y-8">
        <div className="prose prose-emerald max-w-none">
          <p className="text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>
          
          <p className="lead">
            At Leavn Bible Study ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our application.
          </p>
          
          <h2 className="mt-8">Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our application, including:
          </p>
          <ul>
            <li>
              <strong>Personal Data</strong>: We may collect personal identification information (such as your name, email address, and profile picture) when you register for an account, sign in via social authentication providers, or contact us.
            </li>
            <li>
              <strong>Usage Data</strong>: We automatically collect information about how you interact with our application, including pages visited, features used, time spent on the application, and other analytics data.
            </li>
            <li>
              <strong>Study Data</strong>: We collect and store information related to your Bible study activities, such as notes, highlights, reading progress, and preferences.
            </li>
            <li>
              <strong>Device Information</strong>: We may collect information about the device you use to access our application, including device type, operating system, unique device identifiers, IP address, and mobile network information.
            </li>
          </ul>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="how-we-use">
            <AccordionTrigger className="text-lg font-semibold">How We Use Your Information</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>We use the information we collect for various purposes, including:</p>
              <ul>
                <li>
                  <strong>Providing and Improving the Application</strong>: To operate, maintain, and enhance our application and its features, including personalized recommendations, multi-lens Bible commentary, and AI-generated insights.
                </li>
                <li>
                  <strong>Personalization</strong>: To remember your preferences and customize your experience, including saved study materials, theological lens preferences, and user interface settings.
                </li>
                <li>
                  <strong>Communication</strong>: To respond to your inquiries, provide customer support, and send you transactional and informational emails related to the application.
                </li>
                <li>
                  <strong>Analytics</strong>: To understand how users interact with our application, identify usage trends, and improve our services.
                </li>
                <li>
                  <strong>Legal Compliance</strong>: To comply with applicable laws, regulations, and legal processes.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="data-sharing">
            <AccordionTrigger className="text-lg font-semibold">Data Sharing and Disclosure</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>We may share your personal information in the following situations:</p>
              <ul>
                <li>
                  <strong>With Service Providers</strong>: We may share your information with third-party vendors, service providers, and contractors who perform services on our behalf and need access to your information to provide these services.
                </li>
                <li>
                  <strong>With Your Consent</strong>: We may share your information when you have given us consent to do so, such as when you choose to share your notes or insights with other users.
                </li>
                <li>
                  <strong>For Legal Reasons</strong>: We may disclose your information if required to do so by law or in response to valid legal requests, including from public and government authorities.
                </li>
                <li>
                  <strong>Business Transfers</strong>: If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
                </li>
              </ul>
              
              <p>
                We do not sell or rent your personal information to third parties for marketing purposes.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="ai-usage">
            <AccordionTrigger className="text-lg font-semibold">AI and Data Processing</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>
                Our application uses artificial intelligence (AI) to provide features such as multi-lens commentary, narrative mode, and contextual answers. Here's how we use AI with your data:
              </p>
              <ul>
                <li>
                  <strong>AI-Generated Content</strong>: We use AI models to generate biblical commentary, insights, and interpretations tailored to your preferences and queries.
                </li>
                <li>
                  <strong>Query Processing</strong>: When you ask questions or request specific theological perspectives, we process these queries through AI services to provide relevant responses.
                </li>
                <li>
                  <strong>Content Personalization</strong>: We may use AI to analyze your usage patterns and preferences to provide more relevant study materials and recommendations.
                </li>
              </ul>
              
              <p>
                While we use AI services from reputable providers (including OpenAI and Anthropic), we take measures to limit the personal information shared with these services. We primarily send biblical text and contextual queries rather than your personal data.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="data-security">
            <AccordionTrigger className="text-lg font-semibold">Data Security</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, use, disclosure, alteration, or destruction. These measures include:
              </p>
              <ul>
                <li>
                  <strong>Encryption</strong>: We use industry-standard encryption to protect data in transit and at rest.
                </li>
                <li>
                  <strong>Access Controls</strong>: We limit access to personal information to authorized personnel who need it to perform their job functions.
                </li>
                <li>
                  <strong>Regular Security Assessments</strong>: We conduct regular security reviews and assessments of our systems and practices.
                </li>
                <li>
                  <strong>Third-Party Security</strong>: We ensure that our third-party service providers maintain adequate security measures.
                </li>
              </ul>
              
              <p>
                While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="user-rights">
            <AccordionTrigger className="text-lg font-semibold">Your Rights and Choices</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul>
                <li>
                  <strong>Access</strong>: You can request access to the personal information we hold about you.
                </li>
                <li>
                  <strong>Correction</strong>: You can request that we correct inaccurate or incomplete information.
                </li>
                <li>
                  <strong>Deletion</strong>: You can request that we delete your personal information.
                </li>
                <li>
                  <strong>Restriction</strong>: You can request that we restrict the processing of your information.
                </li>
                <li>
                  <strong>Data Portability</strong>: You can request a copy of your information in a structured, commonly used, and machine-readable format.
                </li>
                <li>
                  <strong>Objection</strong>: You can object to the processing of your personal information.
                </li>
              </ul>
              
              <p>
                To exercise these rights, please contact us at privacy@leavn.com. We will respond to your request within the timeframe required by applicable law.
              </p>
              
              <p>
                <strong>Account Settings</strong>: You can update certain personal information and preferences directly within your account settings in the application.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="children">
            <AccordionTrigger className="text-lg font-semibold">Children's Privacy</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>
                Our application is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately at privacy@leavn.com, and we will take appropriate measures to investigate and remove such information from our records.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="international">
            <AccordionTrigger className="text-lg font-semibold">International Data Transfers</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>
                We are based in the United States, and your information may be processed, stored, and transferred to countries where we operate, which may have different data protection laws than your country of residence.
              </p>
              
              <p>
                If you are located in the European Economic Area (EEA), the United Kingdom, or Switzerland, we ensure that any transfer of your personal information to countries outside these regions is made in accordance with applicable data protection laws, using appropriate safeguards such as Standard Contractual Clauses.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="changes">
            <AccordionTrigger className="text-lg font-semibold">Changes to This Privacy Policy</AccordionTrigger>
            <AccordionContent className="prose prose-emerald max-w-none">
              <p>
                We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new privacy policy on this page and updating the "Last Updated" date.
              </p>
              
              <p>
                We encourage you to review this privacy policy periodically to stay informed about how we are protecting your information.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="prose prose-emerald max-w-none">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          
          <address className="not-italic mt-4 mb-8">
            <p><strong>Leavn Bible Study</strong></p>
            <p>Email: privacy@leavn.com</p>
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