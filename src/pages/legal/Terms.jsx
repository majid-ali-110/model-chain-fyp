import React from 'react';
import Card from '../../components/ui/Card';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">Terms of Service</h1>
        <p className="text-secondary-600">Last updated: January 1, 2024</p>
      </div>

      <Card>
        <Card.Content className="prose prose-secondary max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using ModelChain, you accept and agree to be bound by the terms and provision of this agreement.
            If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            ModelChain is a decentralized marketplace for AI models built on blockchain technology. Our platform allows users to:
          </p>
          <ul>
            <li>Upload and share AI models</li>
            <li>Purchase and download AI models</li>
            <li>Validate and review models</li>
            <li>Earn cryptocurrency through model sales and validation</li>
          </ul>

          <h2>3. User Accounts</h2>
          <p>
            Users must connect a compatible Web3 wallet to access the platform. You are responsible for:
          </p>
          <ul>
            <li>Maintaining the security of your wallet and private keys</li>
            <li>All activities that occur under your account</li>
            <li>Ensuring your account information is accurate and up-to-date</li>
          </ul>

          <h2>4. Model Uploads and Content</h2>
          <p>
            When uploading models to ModelChain, you represent and warrant that:
          </p>
          <ul>
            <li>You own or have the necessary rights to the model</li>
            <li>The model does not infringe on any third-party rights</li>
            <li>The model complies with all applicable laws and regulations</li>
            <li>You will not upload malicious, harmful, or inappropriate content</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <p>
            Users retain ownership of their uploaded models. By uploading content, you grant ModelChain a license to:
          </p>
          <ul>
            <li>Host and distribute your models through our platform</li>
            <li>Display model information and previews</li>
            <li>Process transactions related to your models</li>
          </ul>

          <h2>6. Payment and Fees</h2>
          <p>
            ModelChain charges a platform fee on all transactions. Current fees are:
          </p>
          <ul>
            <li>5% commission on model sales</li>
            <li>Gas fees for blockchain transactions are paid by users</li>
            <li>Validation rewards are distributed according to platform rules</li>
          </ul>

          <h2>7. Prohibited Activities</h2>
          <p>
            Users may not:
          </p>
          <ul>
            <li>Upload models that violate laws or regulations</li>
            <li>Engage in fraudulent activities or market manipulation</li>
            <li>Attempt to hack or compromise platform security</li>
            <li>Upload models containing biased, harmful, or discriminatory content</li>
            <li>Violate intellectual property rights of others</li>
          </ul>

          <h2>8. Validation and Quality Control</h2>
          <p>
            All models undergo a validation process before being listed on the marketplace. ModelChain reserves the right to:
          </p>
          <ul>
            <li>Reject models that don't meet quality standards</li>
            <li>Remove models that violate platform policies</li>
            <li>Suspend or ban users who repeatedly violate guidelines</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>
            ModelChain is provided "as is" without warranties of any kind. We are not liable for:
          </p>
          <ul>
            <li>Model performance or accuracy</li>
            <li>Financial losses from using the platform</li>
            <li>Technical issues or platform downtime</li>
            <li>Actions of other users on the platform</li>
          </ul>

          <h2>10. Privacy and Data Protection</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect,
            use, and protect your information.
          </p>

          <h2>11. Modifications to Terms</h2>
          <p>
            ModelChain reserves the right to modify these terms at any time. Users will be notified of
            significant changes, and continued use of the platform constitutes acceptance of updated terms.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These terms are governed by the laws of the jurisdiction where ModelChain operates.
            Any disputes will be resolved through arbitration.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            If you have questions about these Terms of Service, please contact us at:
          </p>
          <ul>
            <li>Email: legal@modelchain.ai</li>
            <li>Discord: ModelChain Community</li>
            <li>Twitter: @ModelChainAI</li>
          </ul>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Terms;