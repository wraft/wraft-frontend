'use client';
import { Box, Text, Button, Flex, Spinner, Grid } from '@wraft/ui';
import { Modal } from '@wraft/ui';
import { X, Download, FileText, Clock } from '@phosphor-icons/react';

interface Template {
  id: string;
  name: string;
  description: string;
  file_name: string;
  file_size: string;
  thumbnail_url: string;
  zip_file_url: string;
  content?: string; // Template content body when available
  category?: string;
  author?: string;
  version?: string;
  tags?: string[];
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
      ariaLabel="Template Installation"
      size="lg">
      <Box maxWidth="800px" minWidth="600px">
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          p="lg"
          borderBottom="1px solid"
          borderColor="border">
          <Box>
            <Text
              fontSize="xl"
              fontWeight="semibold"
              color="text-primary"
              mb="xs">
              Install Template
            </Text>
            <Text fontSize="sm" color="text-secondary">
              Review template details and confirm installation
            </Text>
          </Box>
          {!isInstalling && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isInstalling}>
              <X size={18} />
            </Button>
          )}
        </Flex>

        {/* Content Body */}
        <Box p="lg">
          {/* Template Header Info */}
          <Box mb="lg">
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color="text-primary"
              mb="xs">
              {template.name}
            </Text>
            <Text fontSize="md" color="text-secondary" mb="sm">
              {template.description}
            </Text>

            {/* Template Meta */}
            <Flex gap="lg" align="center" mb="md">
              <Flex align="center" gap="xs">
                <FileText size={16} color="#6B7280" />
                <Text fontSize="sm" color="text-tertiary">
                  {template.file_name}
                </Text>
              </Flex>
              <Flex align="center" gap="xs">
                <Download size={16} color="#6B7280" />
                <Text fontSize="sm" color="text-tertiary">
                  {template.file_size}
                </Text>
              </Flex>
              {template.version && (
                <Flex align="center" gap="xs">
                  <Clock size={16} color="#6B7280" />
                  <Text fontSize="sm" color="text-tertiary">
                    v{template.version}
                  </Text>
                </Flex>
              )}
            </Flex>

            {/* Tags */}
            {template.tags && template.tags.length > 0 && (
              <Flex gap="xs" mb="md">
                {template.tags.map((tag, index) => (
                  <Box
                    key={index}
                    px="sm"
                    py="xs"
                    bg="gray.100"
                    borderRadius="md"
                    fontSize="xs"
                    color="text-secondary">
                    {tag}
                  </Box>
                ))}
              </Flex>
            )}
          </Box>

          {/* Two Column Layout */}
          <Grid templateColumns="200px 1fr" gap="lg" mb="lg">
            {/* Image Column - Small Width */}
            <Box>
              <Box
                bg="gray.50"
                borderRadius="md"
                border="1px solid"
                borderColor="border"
                overflow="hidden"
                h="150px"
                display="flex"
                alignItems="center"
                justifyContent="center">
                {template.thumbnail_url ? (
                  <img
                    src={template.thumbnail_url}
                    alt={template.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box textAlign="center" p="md">
                    <FileText size={32} color="#9CA3AF" />
                    <Text fontSize="xs" color="text-tertiary" mt="xs">
                      No Preview
                    </Text>
                  </Box>
                )}
              </Box>

              {/* Template Stats */}
              <Box mt="sm" p="sm" bg="gray.50" borderRadius="sm">
                <Text
                  fontSize="xs"
                  color="text-tertiary"
                  mb="xs"
                  fontWeight="medium">
                  Template Details
                </Text>
                {template.author && (
                  <Text fontSize="xs" color="text-secondary" mb="xs">
                    By {template.author}
                  </Text>
                )}
                {template.category && (
                  <Text fontSize="xs" color="text-secondary">
                    Category: {template.category}
                  </Text>
                )}
              </Box>
            </Box>

            {/* Content Column */}
            <Box>
              {template.content ? (
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="text-primary"
                    mb="sm">
                    Template Content
                  </Text>
                  <Box
                    p="md"
                    bg="gray.50"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="border"
                    maxHeight="200px"
                    overflowY="auto">
                    <Text
                      fontSize="sm"
                      color="text-secondary"
                      lineHeight="relaxed"
                      whiteSpace="pre-wrap">
                      {template.content}
                    </Text>
                  </Box>
                </Box>
              ) : (
                <Box
                  p="lg"
                  bg="gray.50"
                  borderRadius="md"
                  border="1px dashed"
                  borderColor="border"
                  textAlign="center">
                  <FileText size={32} color="#9CA3AF" />
                  <Text fontSize="sm" color="text-tertiary" mt="sm">
                    Template content will be available after installation
                  </Text>
                  <Text fontSize="xs" color="text-tertiary" mt="xs">
                    This template includes pre-configured layouts, themes, and
                    content blocks
                  </Text>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Installation Progress */}
          {isInstalling && (
            <Box
              mb="lg"
              p="md"
              bg="blue.50"
              borderRadius="md"
              border="1px solid"
              borderColor="blue.200">
              <Flex align="center" gap="md" mb="sm">
                <Spinner size={20} color="blue.500" />
                <Box>
                  <Text fontSize="sm" color="blue.700" fontWeight="medium">
                    Installing template...
                  </Text>
                  <Text fontSize="xs" color="blue.600">
                    Please wait while we set up your template
                  </Text>
                </Box>
              </Flex>
              <Box bg="blue.100" h="6px" borderRadius="full" overflow="hidden">
                <Box
                  bg="blue.500"
                  h="100%"
                  borderRadius="full"
                  w={`${installProgress}%`}
                  transition="width 0.3s ease-in-out"
                />
              </Box>
              <Text
                fontSize="xs"
                color="blue.600"
                mt="xs"
                textAlign="right"
                fontWeight="medium">
                {Math.round(installProgress)}% complete
              </Text>
            </Box>
          )}
        </Box>

        {/* Footer Actions */}
        <Flex
          justify="flex-end"
          gap="sm"
          p="lg"
          borderTop="1px solid"
          borderColor="border"
          bg="gray.25">
          <Button
            variant="tertiary"
            onClick={handleClose}
            disabled={isInstalling}
            size="md">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onInstall}
            disabled={isInstalling}
            loading={isInstalling}>
            {isInstalling ? 'Installing...' : 'Install Template'}
          </Button>
        </Flex>
      </Box>
    </Modal>
  );
};

export default TemplateInstallModal;
