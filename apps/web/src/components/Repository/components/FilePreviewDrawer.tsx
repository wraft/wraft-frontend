import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Drawer,
  useDrawer,
  Skeleton,
} from '@wraft/ui';
import { X, Download, Share, FileText } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

import PdfViewer from 'common/PdfViewer';

import { FilePreviewDrawerProps } from '../types';

export const FilePreviewDrawer: React.FC<FilePreviewDrawerProps> = ({
  file,
  onClose,
  onDownload,
  onShare,
}) => {
  const drawer = useDrawer();
  const [isLoading, setIsLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      setIsLoading(true);
      setPreviewError(null);
      // Simulate loading time for better UX
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [file]);

  const renderPreview = () => {
    if (!file) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}>
          <Flex
            as="div"
            direction="column"
            alignItems="center"
            justifyContent="center"
            h="calc(100vh - 200px)"
            gap="lg">
            <Box
              as="div"
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="64px"
              h="64px"
              borderRadius="full"
              backgroundColor="primary.15"
              color="primary">
              <FileText size={32} />
            </Box>
            <Text fontSize="lg" fontWeight="medium" textAlign="center">
              No file selected
            </Text>
            <Text color="text-secondary" textAlign="center">
              Select a file to preview its contents
            </Text>
          </Flex>
        </motion.div>
      );
    }

    if (isLoading) {
      return (
        <Flex
          as="div"
          direction="column"
          alignItems="center"
          justifyContent="center"
          h="calc(100vh - 200px)"
          gap="lg">
          <Skeleton width="64px" height="64px" />
          <Skeleton width="200px" height="24px" />
          <Skeleton width="300px" height="16px" />
        </Flex>
      );
    }

    if (previewError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}>
          <Flex
            as="div"
            direction="column"
            alignItems="center"
            justifyContent="center"
            h="calc(100vh - 200px)"
            gap="lg">
            <Box
              as="div"
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="64px"
              h="64px"
              borderRadius="full"
              backgroundColor="error.15"
              color="error">
              <FileText size={32} />
            </Box>
            <Text fontSize="lg" fontWeight="medium" textAlign="center">
              Error loading preview
            </Text>
            <Text color="text-secondary" textAlign="center">
              {previewError}
            </Text>
          </Flex>
        </motion.div>
      );
    }

    if (file.mime_type === 'application/pdf') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>
          <Box as="div" h="calc(100vh - 200px)" w="100%">
            {file.url}
            <PdfViewer url={file.url} height="100%" />
          </Box>
        </motion.div>
      );
    }

    // For images
    if (file.mime_type?.startsWith('image/')) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}>
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
              onError={() => setPreviewError('Failed to load image preview')}
            />
          </Box>
        </motion.div>
      );
    }

    // For other file types, show a placeholder
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}>
        <Flex
          as="div"
          direction="column"
          alignItems="center"
          justifyContent="center"
          h="calc(100vh - 200px)"
          gap="md">
          <Box
            as="div"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="64px"
            h="64px"
            borderRadius="full"
            backgroundColor="primary.15"
            color="primary">
            <FileText size={32} />
          </Box>
          <Text fontSize="lg" fontWeight="medium">
            {file.name}
          </Text>
          <Text color="text-secondary">
            {file.mime_type || 'Unknown file type'}
          </Text>
        </Flex>
      </motion.div>
    );
  };

  return (
    <Drawer
      open={!!file}
      store={drawer}
      onClose={onClose}
      placement="right"
      withBackdrop
      aria-label={file ? `Preview ${file.name}` : 'File Preview'}>
      <Box as="div" p="lg">
        {file && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}>
            <Drawer.Header>{file.name}</Drawer.Header>
            <Flex
              as="div"
              justifyContent="space-between"
              alignItems="center"
              mb="lg">
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
          </motion.div>
        )}
        <AnimatePresence mode="wait">{renderPreview()}</AnimatePresence>
      </Box>
    </Drawer>
  );
};
