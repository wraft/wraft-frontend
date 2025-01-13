import { Text, Flex } from '@wraft/ui';
import { LockSimple } from '@phosphor-icons/react';

export const LockedBadge = () => {
  return (
    <Flex align="center" gap="xs" bg="green.a400" px="sm" borderRadius="md">
      <LockSimple size={12} />
      <Text fontSize="sm">Locked</Text>
    </Flex>
  );
};
