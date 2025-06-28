import React from 'react';
import { Box, Flex, Text, Button, Modal } from '@wraft/ui';
import { X, Download, Share } from '@phosphor-icons/react';

import PdfViewer from 'common/PdfViewer';

import { FilePreviewProps } from '../types';

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onClose,
  onDownload,
  onShare,
}) => {
  if (!file) return null;

  const renderPreview = () => {
    if (file.mime_type === 'application/pdf') {
      return (
        <Box as="div" h="calc(100vh - 200px)" w="100%">
          <PdfViewer url={file.url} height="100%" />
        </Box>
      );
    }

    // For images
    if (file.mime_type?.startsWith('image/')) {
      return (
        <Box
          as="div"
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="calc(100vh - 200px)"
          w="100%">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={file.url}
            alt={file.name}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      );
    }

    // For other file types, show a placeholder
    return (
      <Flex
        as="div"
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="calc(100vh - 200px)"
        gap="md">
        <Text fontSize="lg" fontWeight="medium">
          {file.name}
        </Text>
        <Text color="text-secondary">
          {file.mime_type || 'Unknown file type'}
        </Text>
      </Flex>
    );
  };

  return (
    <Modal
      open={!!file}
      onClose={onClose}
      size="lg"
      ariaLabel={`Preview ${file.name}`}>
      <Box as="div" p="lg">
        <Flex
          as="div"
          justifyContent="space-between"
          alignItems="center"
          mb="lg">
          <Text fontSize="lg" fontWeight="medium">
            {file.name}
          </Text>
          <Flex as="div" gap="sm">
            {onDownload && (
              <Button variant="ghost" onClick={() => onDownload(file)}>
                <Flex as="div" alignItems="center" gap="sm">
                  <Download size={20} />
                  <Text>Download</Text>
                </Flex>
              </Button>
            )}
            {onShare && (
              <Button variant="ghost" onClick={() => onShare(file)}>
                <Flex as="div" alignItems="center" gap="sm">
                  <Share size={20} />
                  <Text>Share</Text>
                </Flex>
              </Button>
            )}
            <Button variant="ghost" onClick={onClose}>
              <Flex as="div" alignItems="center" gap="sm">
                <X size={20} />
              </Flex>
            </Button>
          </Flex>
        </Flex>
        {renderPreview()}
      </Box>
    </Modal>
  );
};
