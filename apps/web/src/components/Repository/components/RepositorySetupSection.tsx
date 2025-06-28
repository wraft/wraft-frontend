import React from 'react';
import { Box, Text, Flex, Button } from '@wraft/ui';
import { FolderSimplePlus } from '@phosphor-icons/react';

interface RepositorySetupSectionProps {
  onSetup: () => void;
  isLoading: boolean;
}

export const RepositorySetupSection: React.FC<RepositorySetupSectionProps> = ({
  onSetup,
  isLoading,
}) => {
  return (
    <Box>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="400px"
        gap="lg"
        p="xl">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="80px"
          h="80px"
          borderRadius="full"
          backgroundColor="primary.15"
          color="primary">
          <FolderSimplePlus size={40} />
        </Box>

        <Box textAlign="center" w="100%" maxW="500px">
          <Text fontSize="xl" fontWeight="semibold" mb="sm">
            Set up your document repository
          </Text>
          <Text color="text-secondary" fontSize="md" mb="lg">
            Create a repository to organize and manage your documents
          </Text>
        </Box>

        <Button
          variant="primary"
          size="lg"
          onClick={onSetup}
          disabled={isLoading}>
          <FolderSimplePlus weight="regular" size={20} />
          Setup Repository
        </Button>
      </Flex>
    </Box>
  );
};
