import { Text, Flex } from 'theme-ui';
import { LockSimple } from '@phosphor-icons/react';

export const LockedBadge = () => {
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
        color: 'text',
        bg: 'green.a400',
      }}>
      <LockSimple size={10} />
      <Text
        sx={{
          textTransform: 'uppercase',
          letterSpacing: '-0.01rem',
        }}>
        Locked
      </Text>
    </Flex>
  );
};
