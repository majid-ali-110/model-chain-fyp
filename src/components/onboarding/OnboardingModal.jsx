import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  UserIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  CpuChipIcon,
  DocumentCheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Loading from '../ui/Loading';

const OnboardingModal = ({
  isOpen = false,
  onClose,
  onComplete,
  walletAddress,
  isLoading = false
}) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    website: '',
    twitter: '',
    github: '',
    expertise: [],
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});

  const roles = [
    {
      id: 'buyer',
      name: 'Buyer',
      description: 'Browse and purchase AI models from the marketplace',
      icon: UserIcon,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30 hover:border-blue-400',
      features: [
        'Access to all marketplace models',
        'Secure blockchain transactions',
        'Usage history & receipts',
        'Rate and review models'
      ],
      benefits: 'Perfect for businesses and individuals looking to integrate AI into their projects.'
    },
    {
      id: 'developer',
      name: 'Developer',
      description: 'Upload and sell your AI models on the marketplace',
      icon: CodeBracketIcon,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30 hover:border-purple-400',
      features: [
        'All Buyer features included',
        'Upload unlimited models',
        'Set your own pricing',
        'Earn MATIC from sales',
        'Analytics dashboard'
      ],
      benefits: 'Ideal for AI researchers and developers who want to monetize their work.'
    },
    {
      id: 'validator',
      name: 'Validator',
      description: 'Validate models and earn rewards for quality assurance',
      icon: ShieldCheckIcon,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30 hover:border-green-400',
      features: [
        'All Buyer features included',
        'Stake MATIC to validate',
        'Earn validation rewards',
        'Build reputation score',
        'Priority access to new models'
      ],
      benefits: 'Great for experts who want to contribute to quality assurance and earn rewards.',
      requiresStake: true,
      minStake: '0.1 MATIC'
    }
  ];

  const expertiseOptions = [
    'Natural Language Processing',
    'Computer Vision',
    'Machine Learning',
    'Deep Learning',
    'Generative AI',
    'Reinforcement Learning',
    'Data Science',
    'MLOps',
    'Other'
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleExpertiseToggle = (expertise) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1 && !selectedRole) {
      newErrors.role = 'Please select a role';
    }

    if (step === 2) {
      if (!formData.displayName.trim()) {
        newErrors.displayName = 'Display name is required';
      } else if (formData.displayName.length < 3) {
        newErrors.displayName = 'Display name must be at least 3 characters';
      }
    }

    if (step === 3 && !formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    if (!validateStep()) return;

    const profileData = {
      ...formData,
      role: selectedRole,
      walletAddress,
      createdAt: new Date().toISOString(),
      version: '1.0'
    };

    await onComplete?.(profileData);
  };

  const resetModal = () => {
    setStep(1);
    setSelectedRole(null);
    setFormData({
      displayName: '',
      bio: '',
      website: '',
      twitter: '',
      github: '',
      expertise: [],
      acceptTerms: false
    });
    setErrors({});
  };

  const handleClose = () => {
    resetModal();
    onClose?.();
  };

  // Step 1: Role Selection
  const renderRoleSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 mb-4">
          <SparklesIcon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-dark-text-primary mb-2">
          Welcome to ModelChain!
        </h3>
        <p className="text-dark-text-secondary">
          Choose how you want to participate in the marketplace
        </p>
      </div>

      <div className="space-y-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={clsx(
                'w-full p-5 rounded-xl border-2 transition-all duration-200 text-left',
                'hover:shadow-lg hover:shadow-primary-500/10',
                isSelected
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-dark-surface-elevated hover:border-dark-surface-hover bg-dark-surface-primary'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={clsx(
                  'flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r',
                  role.color
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-dark-text-primary text-lg">
                      {role.name}
                    </h4>
                    {role.requiresStake && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                        Requires {role.minStake} stake
                      </span>
                    )}
                    {isSelected && (
                      <CheckCircleIcon className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                  <p className="text-dark-text-secondary text-sm mb-3">
                    {role.description}
                  </p>
                  <ul className="space-y-1">
                    {role.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-dark-text-tertiary">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {errors.role && (
        <p className="text-red-400 text-sm text-center">{errors.role}</p>
      )}
    </div>
  );

  // Step 2: Profile Details
  const renderProfileDetails = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-dark-text-primary mb-2">
          Set Up Your Profile
        </h3>
        <p className="text-dark-text-secondary text-sm">
          This information will be stored on IPFS (decentralized storage)
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">
            Display Name *
          </label>
          <Input
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            placeholder="Enter your display name"
            error={errors.displayName}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-dark-surface-elevated border border-dark-surface-hover 
                     text-dark-text-primary placeholder-dark-text-tertiary
                     focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
                     transition-all duration-200 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Website
            </label>
            <Input
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Twitter
            </label>
            <Input
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              placeholder="@username"
            />
          </div>
        </div>

        {(selectedRole === 'developer' || selectedRole === 'validator') && (
          <>
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                GitHub
              </label>
              <Input
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                placeholder="github.com/username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                Areas of Expertise
              </label>
              <div className="flex flex-wrap gap-2">
                {expertiseOptions.map((expertise) => (
                  <button
                    key={expertise}
                    type="button"
                    onClick={() => handleExpertiseToggle(expertise)}
                    className={clsx(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      formData.expertise.includes(expertise)
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-surface-elevated text-dark-text-secondary hover:bg-dark-surface-hover'
                    )}
                  >
                    {expertise}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Step 3: Confirmation
  const renderConfirmation = () => {
    const selectedRoleData = roles.find(r => r.id === selectedRole);
    const Icon = selectedRoleData?.icon;

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-dark-text-primary mb-2">
            Confirm Your Profile
          </h3>
          <p className="text-dark-text-secondary text-sm">
            Review your information before creating your account
          </p>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-dark-surface-elevated rounded-xl p-5 border border-dark-surface-hover">
          <div className="flex items-start gap-4 mb-4">
            <div className={clsx(
              'flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r',
              selectedRoleData?.color
            )}>
              {Icon && <Icon className="w-7 h-7 text-white" />}
            </div>
            <div>
              <h4 className="font-semibold text-dark-text-primary text-lg">
                {formData.displayName || 'Anonymous'}
              </h4>
              <p className="text-primary-400 text-sm capitalize">
                {selectedRole}
              </p>
              <p className="text-dark-text-tertiary text-xs font-mono mt-1">
                {walletAddress?.slice(0, 10)}...{walletAddress?.slice(-8)}
              </p>
            </div>
          </div>

          {formData.bio && (
            <p className="text-dark-text-secondary text-sm mb-4">
              {formData.bio}
            </p>
          )}

          {formData.expertise.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {formData.expertise.map((exp) => (
                <span
                  key={exp}
                  className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 text-xs"
                >
                  {exp}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Storage Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <GlobeAltIcon className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-400 text-sm">Decentralized Storage</h5>
              <p className="text-dark-text-tertiary text-xs mt-1">
                Your profile will be stored on IPFS with the content hash recorded on the Polygon blockchain.
                This ensures your data is censorship-resistant and owned by you.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            className="mt-1 w-4 h-4 rounded border-dark-surface-hover bg-dark-surface-elevated 
                     text-primary-500 focus:ring-primary-500/30"
          />
          <span className="text-dark-text-secondary text-sm">
            I agree to the{' '}
            <a href="/legal/terms" className="text-primary-400 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/legal/privacy" className="text-primary-400 hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-red-400 text-sm">{errors.acceptTerms}</p>
        )}

        {selectedRole === 'validator' && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CurrencyDollarIcon className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h5 className="font-medium text-yellow-400 text-sm">Validator Stake Required</h5>
                <p className="text-dark-text-tertiary text-xs mt-1">
                  After registration, you'll need to stake at least 0.1 MATIC to activate your validator status.
                  You can do this from your dashboard.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Step 4: Success
  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
        <CheckCircleIcon className="w-10 h-10 text-green-400" />
      </div>
      <h3 className="text-2xl font-bold text-dark-text-primary mb-2">
        Welcome to ModelChain!
      </h3>
      <p className="text-dark-text-secondary mb-6">
        Your profile has been created and stored on the blockchain.
      </p>
      <div className="flex justify-center gap-3">
        <Button onClick={handleClose}>
          Start Exploring
        </Button>
      </div>
    </div>
  );

  // Progress Steps
  const renderProgress = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={clsx(
            'h-2 rounded-full transition-all duration-300',
            s === step ? 'w-8 bg-primary-500' : s < step ? 'w-2 bg-primary-500' : 'w-2 bg-dark-surface-hover'
          )}
        />
      ))}
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-dark-bg-primary border border-dark-surface-elevated shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-dark-surface-elevated">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500">
                      <CpuChipIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-dark-text-primary">
                        Create Your Profile
                      </h2>
                      <p className="text-xs text-dark-text-tertiary">
                        Step {step} of 3
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-dark-surface-elevated transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-dark-text-tertiary" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {renderProgress()}
                  
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loading size="lg" />
                      <p className="text-dark-text-secondary mt-4">
                        Creating your profile on the blockchain...
                      </p>
                    </div>
                  ) : (
                    <>
                      {step === 1 && renderRoleSelection()}
                      {step === 2 && renderProfileDetails()}
                      {step === 3 && renderConfirmation()}
                    </>
                  )}
                </div>

                {/* Footer */}
                {!isLoading && (
                  <div className="flex items-center justify-between p-5 border-t border-dark-surface-elevated">
                    <Button
                      variant="ghost"
                      onClick={step > 1 ? handleBack : handleClose}
                      disabled={isLoading}
                    >
                      {step > 1 ? (
                        <>
                          <ArrowLeftIcon className="w-4 h-4 mr-2" />
                          Back
                        </>
                      ) : (
                        'Cancel'
                      )}
                    </Button>

                    <Button
                      onClick={step < 3 ? handleNext : handleComplete}
                      disabled={isLoading}
                    >
                      {step < 3 ? (
                        <>
                          Continue
                          <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          <DocumentCheckIcon className="w-4 h-4 mr-2" />
                          Create Profile
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OnboardingModal;
