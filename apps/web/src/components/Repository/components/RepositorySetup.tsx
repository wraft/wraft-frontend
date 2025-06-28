import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Button, InputText } from '@wraft/ui';
import { FolderSimplePlus } from '@phosphor-icons/react';

import { useAuth } from 'contexts/AuthContext';

// Utility function to get workspace name from auth context
const getWorkspaceName = (userProfile: any): string => {
  // Get workspace name from userProfile.currentOrganisation.name
  if (userProfile?.currentOrganisation?.name) {
    return userProfile.currentOrganisation.name;
  }

  // Fallback to "Wraft" as default
  return 'Wraft';
};

interface RepositorySetupProps {
  onSetup: (data: { name: string; description?: string }) => Promise<void>;
  onUpload: () => void;
  isLoading?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export const RepositorySetup: React.FC<RepositorySetupProps> = ({
  onSetup,
  onUpload,
  isLoading = false,
  isOpen = false,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userProfile } = useAuth();

  // Set default repository name based on workspace name from auth context
  useEffect(() => {
    if (!name) {
      if (userProfile?.currentOrganisation?.name) {
        const workspaceName = getWorkspaceName(userProfile);
        setName(`${workspaceName} Repository`);
      } else {
        // Fallback while userProfile is loading
        setName('Wraft Repository');
      }
    }
  }, [name, userProfile]);

  const handleSetup = async () => {
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await onSetup({ name: name.trim() });
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Setup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSetup();
    }
  };

  const content = (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      h="300px"
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

      <Box w="100%" maxW="400px">
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb="xs" display="block">
            Repository Name *
          </Text>
          <InputText
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter repository name"
            disabled={isLoading || isSubmitting}
          />
        </Box>
      </Box>

      <Flex gap="sm" flexWrap="wrap" justifyContent="center">
        <Button
          variant="primary"
          size="md"
          onClick={handleSetup}
          disabled={!name.trim() || isLoading || isSubmitting}
          loading={isSubmitting}>
          <FolderSimplePlus weight="regular" size={16} />
          Set Up Repository
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={onUpload}
          disabled={isLoading || isSubmitting}>
          Upload Files
        </Button>
      </Flex>
    </Flex>
  );

  // If modal mode, return just the content
  if (isOpen !== undefined) {
    return content;
  }

  // Otherwise, return the full page layout (for backward compatibility)
  return <Box>{content}</Box>;
};
