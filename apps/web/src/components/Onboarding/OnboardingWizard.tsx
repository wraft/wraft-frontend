import { useState, useEffect, useRef } from 'react';
import { useTour } from '@reactour/tour';

import { useAuth } from 'contexts/AuthContext';
import { putAPI } from 'utils/models';

export const steps = [
  {
    selector: '[data-tour="dashboard"]',
    content:
      'This is your dashboard. Get an overview of your documents, approvals, and activity at a glance.',
  },
  {
    selector: '[data-tour="documents"]',
    content:
      'Find all your documents here. Create, edit, and manage documents from templates.',
  },
  {
    selector: '[data-tour="templates"]',
    content:
      'Templates let you define reusable document structures. Start with one of ours or create your own.',
  },
  {
    selector: '[data-tour="manage"]',
    content:
      'Manage your organization settings, team members, roles, and permissions here.',
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
