import React from 'react';
import Card from '../../components/ui/Card';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">Privacy Policy</h1>
        <p className="text-secondary-600">Last updated: January 1, 2024</p>
      </div>

      <Card>
        <Card.Content className="prose prose-secondary max-w-none">
          <h2>1. Introduction</h2>
          <p>
            ModelChain ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information when you use our 
            decentralized AI model marketplace.
          </p>

          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Blockchain Data</h3>
          <p>
            As a blockchain-based platform, certain information is publicly available on the blockchain:
          </p>
          <ul>
            <li>Wallet addresses</li>
            <li>Transaction history</li>
            <li>Model uploads and purchases</li>
            <li>Smart contract interactions</li>
          </ul>

          <h3>2.2 Profile Information</h3>
          <p>
            When you create a profile, we may collect:
          </p>
          <ul>
            <li>Display name or username</li>
            <li>Profile picture</li>
            <li>Bio or description</li>
            <li>Social media links</li>
          </ul>

          <h3>2.3 Technical Information</h3>
          <p>
            We automatically collect certain technical information:
          </p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Usage patterns and preferences</li>
          </ul>

          <h3>2.4 Model Data</h3>
          <p>
            When you upload models, we collect:
          </p>
          <ul>
            <li>Model files and metadata</li>
            <li>Documentation and descriptions</li>
            <li>Performance metrics</li>
            <li>User ratings and reviews</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>
            We use collected information to:
          </p>
          <ul>
            <li>Operate and maintain the platform</li>
            <li>Process transactions and payments</li>
            <li>Validate and review uploaded models</li>
            <li>Provide customer support</li>
            <li>Improve platform functionality</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Information Sharing and Disclosure</h2>
          
          <h3>4.1 Public Information</h3>
          <p>
            Some information is publicly visible on the blockchain and our platform:
          </p>
          <ul>
            <li>Wallet addresses and transaction history</li>
            <li>Model listings and metadata</li>
            <li>Public profile information</li>
            <li>Reviews and ratings</li>
          </ul>

          <h3>4.2 Service Providers</h3>
          <p>
            We may share information with trusted service providers who assist in:
          </p>
          <ul>
            <li>Cloud hosting and storage</li>
            <li>Analytics and performance monitoring</li>
            <li>Customer support tools</li>
            <li>Security and fraud prevention</li>
          </ul>

          <h3>4.3 Legal Requirements</h3>
          <p>
            We may disclose information when required by law or to:
          </p>
          <ul>
            <li>Comply with legal processes</li>
            <li>Protect our rights and property</li>
            <li>Ensure user safety</li>
            <li>Prevent fraud or illegal activities</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your information:
          </p>
          <ul>
            <li>Encryption of sensitive data</li>
            <li>Secure data transmission protocols</li>
            <li>Regular security audits</li>
            <li>Access controls and authentication</li>
            <li>Incident response procedures</li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>
            We retain information for as long as necessary to:
          </p>
          <ul>
            <li>Provide our services</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce our agreements</li>
          </ul>
          <p>
            Note that blockchain data is immutable and cannot be deleted once recorded.
          </p>

          <h2>7. Your Rights and Choices</h2>
          <p>
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of certain data</li>
            <li>Object to data processing</li>
            <li>Data portability</li>
            <li>Withdraw consent</li>
          </ul>

          <h2>8. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to:
          </p>
          <ul>
            <li>Remember user preferences</li>
            <li>Analyze platform usage</li>
            <li>Improve user experience</li>
            <li>Provide personalized content</li>
          </ul>
          <p>
            You can control cookie settings through your browser preferences.
          </p>

          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own.
            We ensure appropriate safeguards are in place to protect your data during international transfers.
          </p>

          <h2>10. Children's Privacy</h2>
          <p>
            ModelChain is not intended for users under 18 years of age. We do not knowingly collect
            personal information from children under 18. If we become aware of such collection,
            we will take steps to delete the information.
          </p>

          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify users of significant changes
            through platform notifications or email. Continued use of the platform after changes
            constitutes acceptance of the updated policy.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <ul>
            <li>Email: privacy@modelchain.ai</li>
            <li>Discord: ModelChain Community</li>
            <li>Address: [Company Address]</li>
          </ul>

          <h2>13. Decentralized Nature Disclaimer</h2>
          <p>
            Please note that ModelChain operates on blockchain technology. While we strive to protect
            your privacy, the decentralized nature of blockchain means that some information is
            inherently public and cannot be modified or deleted once recorded on the blockchain.
          </p>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Privacy;