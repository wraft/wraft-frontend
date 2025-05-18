import { Text, Flex } from '@wraft/ui';
import { Triangle } from '@phosphor-icons/react';

export const ApprovalAwaitingLabel = () => {
  return (
    <Flex
      px="md"
      py="xs"
      gap="xs"
      alignItems="center"
      justify="center"
      borderRadius="xl"
      color="orange.600"
      bg="orange.50">
      <Triangle size={12} />
      <Text fontSize="sm" fontWeight="medium" color="orange.800">
        Waiting Approval
      </Text>
    </Flex>
  );
};
