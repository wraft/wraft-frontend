'use client';
import { Box, Text, Button, Flex, Spinner } from '@wraft/ui';
import { Modal } from '@wraft/ui';

interface Template {
  id: string;
  name: string;
  description: string;
  file_name: string;
  file_size: string;
  thumbnail_url: string;
  zip_file_url: string;
}

interface TemplateInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  isInstalling: boolean;
  installProgress: number;
  onInstall: () => void;
}

const TemplateInstallModal = ({
  isOpen,
  onClose,
  template,
  isInstalling,
  installProgress,
  onInstall,
}: TemplateInstallModalProps) => {
  if (!template) return null;

  const handleClose = () => {
    if (!isInstalling) {
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      ariaLabel="Template Installation">
      <Box p="lg">
        {/* Header */}
        <Flex justify="space-between" align="center" mb="lg">
          <Text fontSize="xl" fontWeight="heading" color="text-primary">
            Install Template
          </Text>
          {!isInstalling && (
            <Button
              variant="tertiary"
              size="sm"
              onClick={handleClose}
              disabled={isInstalling}>
              ✕
            </Button>
          )}
        </Flex>

        {/* Action Buttons */}
        <Flex gap="md" justify="flex-end">
          <Button
            variant="tertiary"
            onClick={handleClose}
            disabled={isInstalling}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onInstall}
            disabled={isInstalling}
            loading={isInstalling}>
            {isInstalling ? 'Installing...' : 'Install Template'}
          </Button>

          {/* Template Preview */}
          <Box mb="lg">
            <Text
              fontSize="md"
              fontWeight="medium"
              color="text-primary"
              mb="md">
              {template.name}
            </Text>

            {/* Template thumbnail */}
            <Box
              bg="gray.100"
              borderRadius="md"
              mb="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              position="relative">
              {template.thumbnail_url ? (
                <img
                  src={template.thumbnail_url}
                  alt={template.name}
                  style={{
                    maxWidth: '40%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Text color="gray.500" fontSize="sm">
                  No Preview Available
                </Text>
              )}
            </Box>

            {/* Template details */}
            <Box p="md" bg="gray.50" borderRadius="md">
              <Text fontSize="sm" color="text-secondary" mb="xs">
                {template.description}
              </Text>
              <Flex justify="space-between" align="center">
                <Text fontSize="xs" color="text-tertiary">
                  File: {template.file_name}
                </Text>
                <Text fontSize="xs" color="text-tertiary">
                  Size: {template.file_size}
                </Text>
              </Flex>
            </Box>
          </Box>

          {/* Installation Progress */}
          {isInstalling && (
            <Box mb="lg">
              <Flex align="center" gap="md" mb="sm">
                <Spinner size={16} />
                <Text fontSize="sm" color="text-primary">
                  Installing template...
                </Text>
              </Flex>
              <Box bg="gray.200" h="4px" borderRadius="full" overflow="hidden">
                <Box
                  bg="primary"
                  h="100%"
                  borderRadius="full"
                  w={`${installProgress}%`}
                  transition="width 0.3s ease-in-out"
                />
              </Box>
              <Text
                fontSize="xs"
                color="text-tertiary"
                mt="xs"
                textAlign="center">
                {Math.round(installProgress)}% complete
              </Text>
            </Box>
          )}
        </Flex>
      </Box>
    </Modal>
  );
};

export default TemplateInstallModal;
