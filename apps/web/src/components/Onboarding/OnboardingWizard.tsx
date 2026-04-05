import { useState, useEffect, useRef, useCallback } from 'react';
import { useTour } from '@reactour/tour';
import { Box, Button, Text, Flex } from '@wraft/ui';
import { X, Check } from '@phosphor-icons/react';

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
  const { isOpen, setIsOpen, setSteps, setCurrentStep, currentStep } =
    useTour();
  const [hasStarted, setHasStarted] = useState(false);
  const startedRef = useRef(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const dark =
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(dark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  const updateStatus = useCallback(
    async (status: string) => {
      try {
        await putAPI('users/onboarding_status', { onboarding_status: status });
        if (userProfile) {
          updateUserData({ ...userProfile, onboarding_status: status });
        }
      } catch (err) {
        console.error('Failed to update onboarding status:', err);
      }
    },
    [userProfile, updateUserData],
  );

  useEffect(() => {
    if (isOpen && userProfile?.onboarding_status === 'survey_completed') {
      updateStatus('in_progress');
    }
  }, [isOpen, userProfile?.onboarding_status, updateStatus]);

  useEffect(() => {
    if (
      userProfile?.onboarding_status === 'survey_completed' &&
      !startedRef.current &&
      !isOpen &&
      setSteps &&
      setCurrentStep &&
      setIsOpen
    ) {
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

  useEffect(() => {
    if (hasStarted && !isOpen) {
      updateStatus('completed');
    }
  }, [isOpen, hasStarted, updateStatus]);

  const handleSkip = useCallback(async () => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleComplete = useCallback(async () => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleClose = useCallback(async () => {
    setIsOpen(false);
  }, [setIsOpen]);

  if (!isOpen) return null;

  const currentStepData = steps[currentStep] || steps[0];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const colors = {
    background: isDarkMode ? '#1a1a2e' : '#ffffff',
    text: isDarkMode ? '#e4e4e7' : '#18181b',
    textSecondary: isDarkMode ? '#a1a1aa' : '#71717a',
    border: isDarkMode ? '#3f3f46' : '#e4e4e7',
    primary: '#BF3088',
    primaryHover: '#9e2870',
    buttonBg: isDarkMode ? '#27272a' : '#f4f4f5',
    buttonText: isDarkMode ? '#e4e4e7' : '#18181b',
  };

  return (
    <>
      <style>{`
        @keyframes tourFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .tour-overlay {
          animation: tourFadeIn 0.2s ease-out;
        }
        .tour-tooltip {
          background: ${colors.background} !important;
          color: ${colors.text} !important;
          border: 1px solid ${colors.border} !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                      0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        .tour-arrow {
          color: ${colors.background} !important;
        }
        .tour-highlight {
          outline: 2px solid ${colors.primary} !important;
          outline-offset: 2px !important;
          border-radius: 4px !important;
        }
      `}</style>

      <Box
        className="tour-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
        }}
        onClick={handleClose}
      />

      <Box
        className="tour-tooltip"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '480px',
          padding: '20px',
          zIndex: 9999,
          backgroundColor: colors.background,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}>
        <Flex justify="space-between" alignItems="flex-start" mb="md">
          <Box style={{ flex: 1, paddingRight: '12px' }}>
            <Text
              fontWeight="heading"
              fontSize="md"
              style={{ color: colors.text }}>
              {currentStepData.content.split('.')[0]}
            </Text>
          </Box>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            style={{
              padding: '4px',
              minWidth: 'auto',
              color: colors.textSecondary,
            }}>
            <X size={18} />
          </Button>
        </Flex>

        <Text
          fontSize="sm"
          mb="lg"
          style={{ color: colors.textSecondary, lineHeight: 1.5 }}>
          {currentStepData.content}
        </Text>

        <Flex justify="space-between" alignItems="center">
          <Flex gap="sm">
            {!isFirstStep && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep((s: number) => s - 1)}
                style={{ color: colors.textSecondary }}>
                Back
              </Button>
            )}
          </Flex>

          <Flex alignItems="center" gap="sm">
            <Text fontSize="xs" style={{ color: colors.textSecondary }}>
              {currentStep + 1} / {steps.length}
            </Text>

            {isLastStep ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  style={{ color: colors.textSecondary }}>
                  Skip
                </Button>
                <Button
                  size="sm"
                  onClick={handleComplete}
                  style={{
                    backgroundColor: colors.primary,
                    color: '#ffffff',
                  }}>
                  <Check
                    size={16}
                    weight="bold"
                    style={{ marginRight: '4px' }}
                  />
                  Complete
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  style={{ color: colors.textSecondary }}>
                  Skip
                </Button>
                <Button
                  size="sm"
                  onClick={() => setCurrentStep((s: number) => s + 1)}
                  style={{
                    backgroundColor: colors.primary,
                    color: '#ffffff',
                  }}>
                  Next
                </Button>
              </>
            )}
          </Flex>
        </Flex>

        <Flex justify="center" gap="xs" mt="md">
          {steps.map((_, idx) => (
            <Box
              key={idx}
              style={{
                width: idx === currentStep ? '20px' : '8px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor:
                  idx === currentStep ? colors.primary : colors.border,
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </Flex>
      </Box>
    </>
  );
};

export default OnboardingWizard;
