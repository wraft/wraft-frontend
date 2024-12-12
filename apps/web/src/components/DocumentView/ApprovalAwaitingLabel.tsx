import { Text, Flex } from 'theme-ui';
import { Triangle } from '@phosphor-icons/react';

export const ApprovalAwaitingLabel = () => {
  return (
    <Flex
      sx={{
        px: 1,
        py: '2px',
        gap: 1,
        alignItems: 'center',
        verticalAlign: 'center',
        borderRadius: '6px',
        fontSize: 'xs',
        color: 'orange.800',
        bg: 'orange.100',
      }}>
      <Triangle size={10} />
      <Text
        sx={{
          textTransform: 'uppercase',
          letterSpacing: '-0.01rem',
        }}>
        Waiting for approval
      </Text>
    </Flex>
  );
};
