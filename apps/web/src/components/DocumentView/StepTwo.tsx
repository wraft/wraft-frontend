import React from 'react';
import { Flex, Text } from '@wraft/ui';
import { Focusable } from '@ariakit/react';
import { CheckIcon, CircleIcon } from '@phosphor-icons/react';
import styled from '@xstyled/emotion';

import { IconFrame } from 'common/Atoms';
import { FlowStateBlockProps } from 'utils/types/content';

// Reuse the existing FlowProgressContainer styling from FlowProgressBar.tsx
const FlowProgressContainer = styled(Flex)`
  min-width: fit-content;
  padding-left: 2px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 16px;
  &:last-child {
    border-right: 0;
    .arrowicon {
      display: none;
    }
  }

  .circlced {
    color: ${({ theme }: { theme: any }) => theme?.colors?.orange?.['300']};
  }
`;

// Reuse the existing step indicator styling from FlowProgressBar.tsx
const StepIndicator = styled(Flex)<{
  $isActive?: boolean;
  $isCompleted?: boolean;
  $isPending?: boolean;
}>`
  align-items: center;
  justify-content: center;
  color: ${({ $isActive, $isCompleted }) => {
    if ($isActive) return $isCompleted ? 'green.1200' : 'green.400';
    return 'green.1200';
  }};
  border: 1px solid;
  border-radius: 50%;
  border-color: ${({ $isActive }) => ($isActive ? 'gray.300' : 'gray.500')};
  padding: xxs;
  background-color: ${({ $isActive, $isCompleted }) => {
    if ($isActive) return $isCompleted ? 'teal.100' : 'orange.100';
    if (!$isCompleted && !$isActive) return 'background-secondary';
    return 'teal.400';
  }};
`;

// Clean step line following StateProgress pattern
const StepLine = styled.div<{ $isCompleted: boolean }>`
  min-width: 20px;
  height: 1px;
  background-color: ${({ $isCompleted }) =>
    $isCompleted ? '#22c55e' : '#d1d5db'};
`;

// Alternative card-based design
const CardStepContainer = styled(Flex)<{
  $isActive: boolean;
  $isCompleted: boolean;
  $isPending: boolean;
}>`
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: ${({ $isActive, $isCompleted }) => {
    if ($isCompleted) return '#f0fdf4';
    if ($isActive) return '#fff7ed';
    return '#f9fafb';
  }};
  border: 1px solid
    ${({ $isActive, $isCompleted }) => {
      if ($isCompleted) return '#bbf7d0';
      if ($isActive) return '#fed7aa';
      return '#e5e7eb';
    }};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

// Card step dot
const CardStepDot = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  width: 20px;
  height: 20px;
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background-color: ${({ $isActive, $isCompleted }) => {
    if ($isCompleted) return '#22c55e';
    if ($isActive) return '#f97316';
    return '#9ca3af';
  }};
  border: 1px solid
    ${({ $isActive, $isCompleted }) => {
      if ($isCompleted) return '#16a34a';
      if ($isActive) return '#ea580c';
      return '#6b7280';
    }};
`;

// Main FlowProgressBar component (drop-in replacement) - reusing existing styling
export const FlowProgressBar = ({
  state,
  id,
  num,
  nextState,
  currentActiveIndex,
}: FlowStateBlockProps) => {
  const checked = currentActiveIndex >= num;
  const activeState = nextState && id === nextState?.id;

  return (
    <FlowProgressContainer
      as={Focusable}
      align="center"
      className="step-holder-item"
      gap="sm"
      // borderRight="solid 1px"
      // borderColor="border"
      overflow="hidden"
      // bg={activeState ? 'orange.50' : 'gray.200'}
      theme={[]}>
      <StepIndicator
        $isActive={activeState}
        $isCompleted={checked}
        $isPending={!checked && !activeState}>
        {!checked && !activeState && (
          <>
            <IconFrame color="gray.600" p="2px">
              <CircleIcon
                size={10}
                weight="fill"
                color="inherit"
                className="main-icon"
              />
            </IconFrame>
          </>
        )}
        {activeState && (
          <IconFrame color="orange.500" p="2px">
            <CircleIcon
              size={10}
              weight="fill"
              color="inherit"
              className="main-icon"
            />
          </IconFrame>
        )}
        {checked && (
          <IconFrame color="green.500" p="2px">
            <CheckIcon size={10} weight="bold" className="main-icon" />
          </IconFrame>
        )}
      </StepIndicator>
      <Text fontWeight="heading" fontSize="sm2" textTransform="capitalize">
        {state}
      </Text>
    </FlowProgressContainer>
  );
};

// Alternative card-based design
export const FlowProgressBarCard = ({
  state,
  id,
  num,
  nextState,
  currentActiveIndex,
}: FlowStateBlockProps) => {
  const checked = currentActiveIndex >= num;
  const activeState = nextState && id === nextState?.id;
  const isPending = !checked && !activeState;

  return (
    <CardStepContainer
      as={Focusable}
      $isActive={activeState}
      $isCompleted={checked}
      $isPending={isPending}
      className="step-holder-item"
      role="button"
      tabIndex={0}
      aria-label={`Step ${num}: ${state} - ${checked ? 'completed' : activeState ? 'active' : 'pending'}`}
      aria-current={activeState ? 'step' : undefined}>
      <CardStepDot $isActive={activeState} $isCompleted={checked}>
        {checked ? (
          <CheckIcon size={12} weight="bold" color="white" />
        ) : activeState ? (
          <CircleIcon size={12} weight="fill" color="white" />
        ) : (
          <Text fontSize="xs" fontWeight="600" color="white">
            {num}
          </Text>
        )}
      </CardStepDot>
      <Text
        fontSize="sm"
        fontWeight={activeState || checked ? '600' : '500'}
        color={activeState ? 'orange.700' : checked ? 'green.700' : 'gray.600'}
        textTransform="capitalize">
        {state}
      </Text>
    </CardStepContainer>
  );
};

// Minimal design following StateProgress pattern exactly
export const FlowProgressBarMinimal = ({
  state,
  id,
  num,
  nextState,
  currentActiveIndex,
}: FlowStateBlockProps) => {
  const checked = currentActiveIndex >= num;
  const activeState = nextState && id === nextState?.id;

  return (
    <FlowProgressContainer
      as={Focusable}
      className="step-holder-item"
      role="button"
      tabIndex={0}
      aria-label={`Step ${num}: ${state} - ${checked ? 'completed' : activeState ? 'active' : 'pending'}`}
      aria-current={activeState ? 'step' : undefined}>
      <StepIndicator
        $isActive={activeState}
        $isCompleted={checked}
        $isPending={!checked && !activeState}>
        {checked ? (
          <CheckIcon size={8} weight="bold" color="white" />
        ) : activeState ? (
          <CircleIcon size={8} weight="fill" color="white" />
        ) : (
          <Text fontSize="xs" fontWeight="600" color="gray.600">
            {num}
          </Text>
        )}
      </StepIndicator>
    </FlowProgressContainer>
  );
};

// Flow container with steps and lines
export const FlowContainer = ({
  children,
  showLines = true,
}: {
  children: React.ReactNode;
  showLines?: boolean;
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <Flex align="center" gap={0}>
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {showLines && index < childrenArray.length - 1 && (
            <StepLine $isCompleted={false} />
          )}
        </React.Fragment>
      ))}
    </Flex>
  );
};

// Export the default as the main component for drop-in replacement
export default FlowProgressBar;
