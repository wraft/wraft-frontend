import React from 'react';
import { Box, Text, Flex, Button } from '@wraft/ui';
import { FolderSimplePlus, UploadSimple } from '@phosphor-icons/react';

interface EmptyRepositoryProps {
  onNewFolder: () => void;
  onUpload: () => void;
}

export const EmptyRepository: React.FC<EmptyRepositoryProps> = ({
  onNewFolder,
  onUpload,
}) => {
  return (
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

      <Box textAlign="center">
        <Text fontSize="xl" fontWeight="semibold" mb="sm">
          Your repository is empty
        </Text>
        <Text color="text-secondary" fontSize="md" mb="lg">
          Start by creating folders or uploading files to organize your
          documents
        </Text>
      </Box>

      <Flex gap="sm">
        <Button variant="primary" size="md" onClick={onNewFolder}>
          <FolderSimplePlus weight="regular" size={16} />
          Create Folder
        </Button>
        <Button variant="ghost" size="md" onClick={onUpload}>
          <UploadSimple weight="regular" size={16} />
          Upload Files
        </Button>
      </Flex>
    </Flex>
  );
};
