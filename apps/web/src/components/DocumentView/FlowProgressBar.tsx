import { Text, Flex } from '@wraft/ui';
import { Focusable } from '@ariakit/react';
import { Check, Circle } from '@phosphor-icons/react';
import styled from '@emotion/styled';
import { BackArrowIcon } from '@wraft/icon';

import { FlowStateBlockProps } from 'utils/types/content';

const FlowProgressContainer = styled(Flex)`
  min-width: fit-content;

  &:last-child {
    .arrowicon {
      display: none;
    }
  }

  .circlced {
    color: ${({ theme }: any) => theme?.colors.orange['300']};
  }
`;

export const FlowProgressBar = ({
  state,
  id,
  num,
  nextState,
  currentActiveIndex,
}: FlowStateBlockProps) => {
  const checked = currentActiveIndex >= num;
  const activeState = nextState && id === nextState?.id;

  const getBgColor = () => {
    if (activeState) {
      return checked ? 'green.100' : 'orange.100';
    }

    if (!checked && !activeState) {
      return 'background-secondary';
    }
    return 'green.400';
  };

  return (
    <FlowProgressContainer as={Focusable} align="center" gap="sm">
      <Flex
        alignItems="center"
        justify="center"
        color={
          activeState ? (checked ? 'green.1200' : 'green.400') : 'green.1200'
        }
        border="1px solid"
        borderRadius="full"
        w="16px"
        h="16px"
        borderColor={activeState ? 'gray.300' : 'gray.500'}
        p="xxs"
        bg={getBgColor()}>
        {!checked && !activeState && (
          <Text fontSize="xs" fontWeight="heading">
            {num}
          </Text>
        )}
        {activeState && (
          <Circle size={12} weight="fill" className="main-icon" />
        )}
        {checked && <Check size={12} weight="bold" className="main-icon" />}
      </Flex>
      <Text fontWeight="heading" fontSize="sm" textTransform="capitalize">
        {state}
      </Text>

      <BackArrowIcon className="main-icon" width={20} />
    </FlowProgressContainer>
  );
};
