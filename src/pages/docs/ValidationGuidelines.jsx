import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';

const ValidationGuidelines = () => {
  const validationCriteria = [
    {
      category: 'Model Performance',
      icon: TrophyIcon,
      checks: [
        { name: 'Accuracy meets claimed metrics', required: true },
        { name: 'Consistent results across test cases', required: true },
        { name: 'Reasonable inference time', required: true },
        { name: 'Memory usage within limits', required: false }
      ]
    },
    {
      category: 'Security & Safety',
      icon: ShieldCheckIcon,
      checks: [
        { name: 'No malicious code or backdoors', required: true },
        { name: 'Safe input handling', required: true },
        { name: 'No data leakage risks', required: true },
        { name: 'Complies with content policy', required: true }
      ]
    },
    {
      category: 'Documentation',
      icon: DocumentTextIcon,
      checks: [
        { name: 'Clear model description', required: true },
        { name: 'Usage examples provided', required: true },
        { name: 'Input/output specifications', required: true },
        { name: 'Known limitations documented', required: false }
      ]
    },
    {
      category: 'Technical Quality',
      icon: ClockIcon,
      checks: [
        { name: 'Proper error handling', required: true },
        { name: 'Efficient resource usage', required: false },
        { name: 'Clean code structure', required: false },
        { name: 'Reproducible results', required: true }
      ]
    }
  ];

  const validationProcess = [
    { step: 1, title: 'Submission', description: 'Developer uploads model to platform', duration: 'Instant' },
    { step: 2, title: 'Automated Tests', description: 'System runs security and performance checks', duration: '5-15 min' },
    { step: 3, title: 'Validator Review', description: 'Assigned validators test and verify model', duration: '24-72 hrs' },
    { step: 4, title: 'Community Vote', description: 'Validator consensus on approval', duration: '12-24 hrs' },
    { step: 5, title: 'Approval', description: 'Model goes live on marketplace', duration: 'Instant' }
  ];

  return (
    <div className="min-h-screen bg-dark-surface-primary py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center text-dark-text-secondary mb-4">
            <Link to="/" className="hover:text-primary-400">Home</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-dark-text-primary">Validation Guidelines</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Validation
            </span> Guidelines
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl">
            Comprehensive guidelines for validators to ensure model quality and security.
          </p>
        </div>

        {/* Validation Process */}
        <Card variant="elevated" className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark-text-primary mb-6">Validation Process</h2>
          <div className="space-y-6">
            {validationProcess.map((phase, index) => (
              <div key={phase.step} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 border-2 border-primary-400 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-400">{phase.step}</span>
                  </div>
                </div>
                
                <div className="flex-1 pb-8 border-l-2 border-dark-border pl-6 relative">
                  {index < validationProcess.length - 1 && (
                    <div className="absolute left-0 top-12 bottom-0 w-0.5 bg-dark-border" />
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-dark-text-primary mb-2">{phase.title}</h3>
                      <p className="text-dark-text-secondary mb-2">{phase.description}</p>
                      <div className="flex items-center text-sm text-primary-400">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {phase.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Validation Criteria */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-dark-text-primary mb-6">Validation Criteria</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {validationCriteria.map((category, index) => (
              <Card key={index} variant="elevated" className="p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-500/20 rounded-lg p-3 mr-4">
                    <category.icon className="h-6 w-6 text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold text-dark-text-primary">{category.category}</h3>
                </div>

                <div className="space-y-3">
                  {category.checks.map((check, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {check.required ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-dark-text-secondary">{check.name}</p>
                        {check.required && (
                          <span className="text-xs text-red-400">Required</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Become a Validator CTA */}
        <Card variant="elevated" className="p-8 text-center">
          <ShieldCheckIcon className="h-16 w-16 text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-text-primary mb-4">Become a Validator</h2>
          <p className="text-dark-text-secondary mb-6 max-w-2xl mx-auto">
            Join our validator network to help maintain model quality and earn rewards.
          </p>
          <Link to="/validator">
            <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Validator Dashboard
            </button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default ValidationGuidelines;
