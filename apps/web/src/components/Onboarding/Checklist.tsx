import React from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import { CheckCircle, Circle } from '@phosphor-icons/react';
import { useTour } from '@reactour/tour';

import { useAuth } from 'contexts/AuthContext';
import { steps } from './OnboardingWizard';

const ChecklistItem = ({
  label,
  isCompleted,
  onClick,
}: {
  label: string;
  isCompleted: boolean;
  onClick?: () => void;
}) => (
  <Flex
    alignItems="center"
    gap="sm"
    mb="sm"
    onClick={!isCompleted ? onClick : undefined}
    style={{ cursor: !isCompleted && onClick ? 'pointer' : 'default' }}
  >
    {isCompleted ? (
      <CheckCircle size={20} weight="fill" style={{ color: '#10B981' }} />
    ) : (
      <Circle size={20} style={{ color: '#9CA3AF' }} />
    )}
    <Text
      color={isCompleted ? 'text-secondary' : 'text-primary'}
      fontSize="sm"
      style={{
        textDecoration: isCompleted ? 'line-through' : 'none',
      }}
    >
      {label}
    </Text>
  </Flex>
);

interface ChecklistProps {
  totalDocuments: number;
}

const Checklist = ({ totalDocuments }: ChecklistProps) => {
  const { userProfile, organisations } = useAuth();
  const { setIsOpen, setSteps, setCurrentStep } = useTour();

  const hasCompletedTour = userProfile?.onboarding_status === 'completed';
  const hasCreatedDocument = totalDocuments > 0;

  const onboardingData = userProfile?.profile?.onboarding_data || {};
  const teamSize = onboardingData.team_size || '1';

  const showInviteTask = teamSize !== '1';
  const hasInvitedMember = (organisations?.[0]?.users?.length || 1) > 1;

  const handleStartTour = () => {
    if (setSteps && setCurrentStep && setIsOpen) {
      setSteps(steps);
      setCurrentStep(0);
      setIsOpen(true);
    }
  };

  const allCompleted =
    hasCompletedTour &&
    hasCreatedDocument &&
    (!showInviteTask || hasInvitedMember);

  // Don't show if user hasn't started onboarding or all tasks are done
  if (userProfile?.onboarding_status === 'not_started' || allCompleted) {
    return null;
  }

  return (
    <Box
      border="1px solid"
      borderColor="border"
      borderRadius="md"
      p="lg"
      mb="lg"
      bg="background-primary"
    >
      <Text as="h3" fontSize="md" fontWeight="heading" mb="md">
        Getting Started
      </Text>
      <ChecklistItem
        label="Complete the welcome tour"
        isCompleted={hasCompletedTour}
        onClick={handleStartTour}
      />
      {showInviteTask && (
        <ChecklistItem
          label="Invite a team member"
          isCompleted={hasInvitedMember}
        />
      )}
      <ChecklistItem
        label="Create your first document"
        isCompleted={hasCreatedDocument}
      />
    </Box>
  );
};

export default Checklist;
