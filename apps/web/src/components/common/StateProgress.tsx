import React from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import { Check } from '@phosphor-icons/react';
import styled from '@xstyled/emotion';
import { Popover, PopoverAnchor, usePopoverStore } from '@ariakit/react';

import { TimeAgo } from 'common/Atoms';

const StateProgressContainer = styled(Flex)`
  min-width: fit-content;
  gap: 0px;
  align-items: center;
  padding: 4px 8px;
`;

const StateDot = styled.div<{
  $isActive: boolean;
  $isCompleted: boolean;
  $isNextState: boolean;
  $isChecked: boolean;
}>`
  width: 10px;
  height: 10px;
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  min-width: 10px;
  min-height: 10px;
  box-sizing: border-box;
  background-color: ${(props: any) => {
    const { $isCompleted, $isNextState, theme } = props;
    if ($isCompleted) return theme.colors.green[100]; // Faint green for completed
    if ($isNextState) return theme.colors.orange[400];
    return theme.colors.gray[500];
  }};
  color: ${(props: any) => {
    const { $isCompleted, $isNextState, theme } = props;
    if ($isCompleted) return theme.colors.green[800];
    if ($isNextState) return theme.colors.white;
    return theme.colors.gray[900];
  }};
  transition:
    background 0.2s,
    color 0.2s;
`;

const StateLine = styled.div<{ $isCompleted: boolean }>`
  width: 8px;
  height: 1px;
  background-color: ${(props: any) =>
    props.$isCompleted
      ? props.theme.colors.green[600]
      : props.theme.colors.gray[300]};
  border-radius: 1px;
`;

interface StateProgressProps {
  states: Array<{
    id: string;
    state: string;
    order: number;
  }>;
  activeStateId?: string;
  completedStateIds?: string[];
  currentActiveIndex?: number;
  nextState?: {
    id: string;
    state: string;
    order: number;
  } | null;
}

// Reusable popover dot for steps
const StepPopoverDot = ({
  label,
  approvedBy,
  approvedAt,
  extraInfo,
  children,
}: {
  label: string;
  approvedBy?: string;
  approvedAt?: string;
  extraInfo?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const popover = usePopoverStore({ placement: 'top' });
  return (
    <>
      <PopoverAnchor store={popover}>
        <span
          onMouseEnter={() => popover.show()}
          onMouseLeave={() => popover.hide()}
          onFocus={() => popover.show()}
          onBlur={() => popover.hide()}
          style={{ display: 'flex', outline: 'none' }}>
          {children}
        </span>
      </PopoverAnchor>
      <Popover
        store={popover}
        modal={false}
        portal={false}
        gutter={8}
        style={{
          fontSize: 12,
          padding: '4px 10px',
          borderRadius: 4,
          background: 'white',
          color: '#222',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #eee',
          zIndex: 100,
          minWidth: 60,
          textAlign: 'left',
        }}>
        <Box display="flex" flexDirection="column" gap="xs">
          <Text
            as="span"
            flex={1}
            // borderBottom="1px solid #ddd"
            fontSize="sm"
            fontWeight="heading"
            color="text-primary">
            {label}
          </Text>
          <Flex>
            {approvedBy && approvedAt && (
              <>
                <Text
                  as="span"
                  fontSize="xs"
                  color="text-secondary"
                  fontWeight="body">
                  {approvedBy}
                </Text>
                <TimeAgo time={approvedAt} short />
              </>
            )}
          </Flex>
          {extraInfo}
        </Box>
      </Popover>
    </>
  );
};

export const StateProgress: React.FC<StateProgressProps> = ({
  states,
  activeStateId,
  completedStateIds = [],
  currentActiveIndex = 0,
  nextState,
}) => {
  // Sort states by order
  const sortedStates = [...states].sort((a, b) => a.order - b.order);

  return (
    <StateProgressContainer>
      {sortedStates.map((state, index) => {
        const checked = currentActiveIndex >= index + 1;
        const isActive = state.id === activeStateId;
        const isCompleted = completedStateIds.includes(state.id);
        const isLast = index === sortedStates.length - 1;
        const isNextState = nextState && state.id === nextState.id;
        // Support flexible approval info
        const approvedBy = (state as any).approvedBy;
        const approvedAt = (state as any).approvedAt;
        const extraInfo = (state as any).extraInfo;

        return (
          <React.Fragment key={state.id}>
            {isCompleted ? (
              <StepPopoverDot
                label={state.state}
                approvedBy={approvedBy}
                approvedAt={approvedAt}
                extraInfo={extraInfo}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Check size={10} weight="bold" color="#127d5d" />
                </div>
              </StepPopoverDot>
            ) : (
              <StepPopoverDot
                label={state.state}
                approvedBy={approvedBy}
                approvedAt={approvedAt}
                extraInfo={extraInfo}>
                <StateDot
                  $isActive={isActive}
                  $isCompleted={isCompleted}
                  $isNextState={!!isNextState}
                  $isChecked={checked}
                />
              </StepPopoverDot>
            )}
            {!isLast && <StateLine $isCompleted={isCompleted} />}
          </React.Fragment>
        );
      })}
    </StateProgressContainer>
  );
};
