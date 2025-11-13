import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';

const FAQ = () => {
  const faqs = [
    { q: 'What is ModelChain?', a: 'ModelChain is a decentralized marketplace for AI models powered by blockchain technology.' },
    { q: 'How do I upload a model?', a: 'Navigate to the Developer section and click "Upload Model". Follow the step-by-step wizard.' },
    { q: 'What tokens does ModelChain use?', a: 'We use MCT (ModelChain Token) for all transactions on the platform.' },
    { q: 'How do I become a validator?', a: 'Stake minimum 10,000 MCT tokens and run a validator node. See our Node Setup guide.' },
    { q: 'Are models secure?', a: 'All models go through rigorous validation and security checks before being listed.' }
  ];

  return (
    <div className="min-h-screen bg-dark-surface-primary py-12">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center text-dark-text-secondary mb-4">
            <Link to="/" className="hover:text-primary-400">Home</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-dark-text-primary">FAQ</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Frequently Asked
            </span> Questions
          </h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} variant="elevated" className="p-6">
              <div className="flex items-start gap-4">
                <QuestionMarkCircleIcon className="h-6 w-6 text-primary-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-dark-text-primary mb-2">{faq.q}</h3>
                  <p className="text-dark-text-secondary">{faq.a}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
