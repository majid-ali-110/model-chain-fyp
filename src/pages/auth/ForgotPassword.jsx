import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement password reset logic
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  if (sent) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Check your email</Card.Title>
          <Card.Description>
            We've sent a password reset link to {email}
          </Card.Description>
        </Card.Header>
        
        <div className="text-center">
          <p className="text-secondary-600 mb-4">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <Button variant="outline" onClick={() => setSent(false)}>
            Try again
          </Button>
        </div>
        
        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">
            Back to sign in
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Reset your password</Card.Title>
        <Card.Description>
          Enter your email address and we'll send you a link to reset your password.
        </Card.Description>
      </Card.Header>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Button type="submit" className="w-full" loading={loading}>
          Send reset link
        </Button>
      </form>
      
      <div className="text-center mt-6">
        <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">
          Back to sign in
        </Link>
      </div>
    </Card>
  );
};

export default ForgotPassword;