import { Text, Box, Flex } from 'theme-ui';
import { Focusable } from '@ariakit/react';
import { Check, Circle } from '@phosphor-icons/react';

import { BackArrowIcon } from 'components/Icons';
import { FlowStateBlockProps } from 'utils/types/content';

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
      return 'gray.200';
    }
    return 'green.400';
  };

  return (
    <Flex
      as={Focusable}
      sx={{
        alignItems: 'center',
        ':last-child': {
          '.arrowicon': {
            display: 'none',
          },
          minWidth: 'fit-content',
        },
      }}>
      <Box
        sx={{
          fontSize: 'xxs',
          width: '18px',
          height: '18px',
          borderRadius: '9rem',
          bg: getBgColor(),
          border: '1px solid',
          borderColor: activeState ? 'gray.300' : 'gray.500',
          color: activeState
            ? checked
              ? 'green.1200'
              : 'green.400'
            : 'green.1200',
          textAlign: 'center',
          mr: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          '.circlced': {
            color: 'orange.300',
          },
          p: 1,
        }}>
        {/* {nextState?.order} */}
        {!checked && !activeState && <>{num}</>}
        {activeState && <Circle size={16} weight="fill" className="circlced" />}
        {checked && <Check size={16} weight="bold" />}
      </Box>
      <Text
        sx={{ fontSize: '13px', textTransform: 'capitalize', fontWeight: 500 }}>
        {state}
      </Text>
      <Box
        sx={{
          paddingLeft: 1,
          paddingRight: 0,
        }}>
        <BackArrowIcon className="arrowicon" width={20} size={20} stroke={1} />
      </Box>
    </Flex>
  );
};
