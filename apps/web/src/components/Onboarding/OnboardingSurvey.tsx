import React, { useState, useCallback } from 'react';
import { Box, Text, Button, Flex, Select } from '@wraft/ui';

import { useAuth } from 'contexts/AuthContext';
import { putAPI } from 'utils/models';

const ROLE_OPTIONS = [
  { label: 'Developer', value: 'developer' },
  { label: 'Manager', value: 'manager' },
  { label: 'Product Manager', value: 'product_manager' },
  { label: 'Designer', value: 'designer' },
  { label: 'Legal / Compliance', value: 'legal' },
  { label: 'Other', value: 'other' },
];

const TEAM_SIZE_OPTIONS = [
  { label: 'Just me', value: '1' },
  { label: '2-10', value: '2-10' },
  { label: '11-50', value: '11-50' },
  { label: '51-200', value: '51-200' },
  { label: '201+', value: '201+' },
];

const GOAL_OPTIONS = [
  { label: 'Create Documentation', value: 'documentation' },
  { label: 'Automate Contracts', value: 'contracts' },
  { label: 'Manage Knowledge Base', value: 'knowledge_base' },
  { label: 'API Integration', value: 'api' },
  { label: 'Other', value: 'other' },
];

const TOTAL_STEPS = 3;

const OnboardingSurvey = () => {
  const { userProfile, updateUserData } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ role: '', team_size: '', goal: '' });
  const [loading, setLoading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const shouldShow =
    !isDismissed && userProfile?.onboarding_status === 'not_started';

  const dismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => setIsDismissed(true), 300);
  }, []);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await putAPI('profiles', { onboarding_data: data });
      await putAPI('users/onboarding_status', {
        onboarding_status: 'survey_completed',
      });
      updateUserData({
        ...userProfile,
        onboarding_status: 'survey_completed',
        profile: { ...userProfile.profile, onboarding_data: data },
      });
      dismiss();
    } catch (e) {
      console.error('Onboarding submission failed', e);
      try {
        await putAPI('users/onboarding_status', {
          onboarding_status: 'survey_completed',
        });
        updateUserData({
          ...userProfile,
          onboarding_status: 'survey_completed',
        });
      } catch {
        // silent
      }
      dismiss();
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await putAPI('users/onboarding_status', {
        onboarding_status: 'survey_completed',
      });
      updateUserData({
        ...userProfile,
        onboarding_status: 'survey_completed',
      });
    } catch {
      // silent
    }
    setLoading(false);
    dismiss();
  };

  if (!shouldShow) return null;

  const stepContent = [
    {
      title: 'Welcome to Wraft',
      subtitle:
        'Tell us a bit about yourself so we can personalize your experience.',
      field: (
        <Box>
          <Text fontWeight="bold" mb="xs" fontSize="sm">
            What is your role?
          </Text>
          <Select
            options={ROLE_OPTIONS}
            value={ROLE_OPTIONS.find((o) => o.value === data.role)}
            onChange={(opt: any) => setData({ ...data, role: opt.value })}
            placeholder="Select your role"
          />
        </Box>
      ),
      canProceed: !!data.role,
    },
    {
      title: 'Tell us about your team',
      subtitle: 'How many people are in your organization?',
      field: (
        <Box>
          <Text fontWeight="bold" mb="xs" fontSize="sm">
            Company Size
          </Text>
          <Select
            options={TEAM_SIZE_OPTIONS}
            value={TEAM_SIZE_OPTIONS.find((o) => o.value === data.team_size)}
            onChange={(opt: any) => setData({ ...data, team_size: opt.value })}
            placeholder="Select company size"
          />
        </Box>
      ),
      canProceed: !!data.team_size,
    },
    {
      title: 'What brings you here?',
      subtitle: "We'll help you get started with the right templates.",
      field: (
        <Box>
          <Text fontWeight="bold" mb="xs" fontSize="sm">
            Primary Goal
          </Text>
          <Select
            options={GOAL_OPTIONS}
            value={GOAL_OPTIONS.find((o) => o.value === data.goal)}
            onChange={(opt: any) => setData({ ...data, goal: opt.value })}
            placeholder="Select your goal"
          />
        </Box>
      ),
      canProceed: !!data.goal,
    },
  ];

  const current = stepContent[step];
  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(8px)',
        opacity: isExiting ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}
    >
      <Box
        style={{
          width: '100%',
          maxWidth: '440px',
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {/* Step indicator */}
        <Flex justify="center" mb="lg" gap="sm">
          {stepContent.map((_, i) => (
            <Box
              key={i}
              style={{
                width: i === step ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: i === step ? '#2563EB' : '#D1D5DB',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </Flex>

        {/* Content card */}
        <Box
          bg="background-primary"
          borderRadius="md"
          border="1px solid"
          borderColor="border"
          p="xl"
          style={{
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Text fontSize="xl" fontWeight="heading" mb="xs">
            {current.title}
          </Text>
          <Text color="text-secondary" mb="lg" fontSize="sm">
            {current.subtitle}
          </Text>

          <Box mb="lg">{current.field}</Box>

          <Flex justify="space-between" alignItems="center">
            {step > 0 ? (
              <Button variant="ghost" onClick={handleBack} size="sm">
                Back
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleSkip}
                size="sm"
                disabled={loading}
              >
                Skip
              </Button>
            )}

            {isLastStep ? (
              <Button
                onClick={handleSubmit}
                loading={loading}
                disabled={!current.canProceed || loading}
                size="sm"
              >
                Get Started
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!current.canProceed}
                size="sm"
              >
                Next
              </Button>
            )}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default OnboardingSurvey;
