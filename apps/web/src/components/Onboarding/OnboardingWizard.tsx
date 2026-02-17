import { useState, useEffect, useRef } from 'react';
import { useTour } from '@reactour/tour';

import { useAuth } from 'contexts/AuthContext';
import { putAPI } from 'utils/models';

export const steps = [
  {
    selector: '[data-tour="documents"]',
    content:
      'Manage all your active documents, track their status, and collaborate with your team in one place.',
  },
  {
    selector: '[data-tour="variants"]',
    content:
      'Variants allow you to manage different versions or regional adaptations of your content efficiently.',
  },
  {
    selector: '[data-tour="templates"]',
    content:
      'Create reusable document structures with templates to maintain consistency and speed up document creation.',
  },
  {
    selector: '[data-tour="manage"]',
    content:
      'Configure your organization settings, invite team members, and manage roles and permissions.',
  },
];

const OnboardingWizard = () => {
  const { userProfile, updateUserData } = useAuth();
  const { isOpen, setIsOpen, setSteps, setCurrentStep } = useTour();
  const [hasStarted, setHasStarted] = useState(false);
  const startedRef = useRef(false);

  // Sync hasStarted with isOpen
  useEffect(() => {
    if (isOpen) {
      setHasStarted(true);
      
      if (userProfile?.onboarding_status === 'survey_completed') {
        putAPI('users/onboarding_status', {
          onboarding_status: 'in_progress',
        }).catch((err) =>
          console.error('Failed to update status to in_progress', err),
        );
      }
    }
  }, [isOpen, userProfile?.onboarding_status]);

  // Start tour only when survey is completed
  useEffect(() => {
    if (
      userProfile?.onboarding_status === 'survey_completed' &&
      !startedRef.current &&
      !isOpen &&
      setSteps &&
      setCurrentStep &&
      setIsOpen
    ) {
      // Small delay to let the survey exit animation complete
      const timer = setTimeout(() => {
        startedRef.current = true;
        setSteps(steps);
        setCurrentStep(0);
        setIsOpen(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    userProfile?.onboarding_status,
    isOpen,
    setSteps,
    setCurrentStep,
    setIsOpen,
  ]);

  // Handle tour close (finished or skipped)
  useEffect(() => {
    if (hasStarted && !isOpen) {
      putAPI('users/onboarding_status', { onboarding_status: 'completed' })
        .then(() => {
          if (userProfile) {
            updateUserData({
              ...userProfile,
              onboarding_status: 'completed',
            });
          }
        })
        .catch((err) =>
          console.error('Failed to update status to completed', err),
        );
    }
  }, [isOpen, hasStarted]);

  return null;
};

export default OnboardingWizard;
