import { Text, Flex } from '@wraft/ui';
import { Triangle } from '@phosphor-icons/react';

export const ApprovalAwaitingLabel = () => {
  return (
    <Flex
      px="md"
      py="xxs"
      gap="xs"
      alignItems="center"
      justify="center"
      borderRadius="xl"
      color="orange.800"
      bg="orange.100">
      <Triangle size={12} />
      <Text fontSize="sm" fontWeight="heading">
        Waiting for approval
      </Text>
    </Flex>
  );
};
