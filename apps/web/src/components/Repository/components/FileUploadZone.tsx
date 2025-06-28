import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Flex, Text, Button, Checkbox } from '@wraft/ui';
import { FileText, X, UploadSimple } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@xstyled/emotion';

import PdfViewer from 'common/PdfViewer';

import { UploadedFile } from '../types';

interface FileDropZoneProps {
  onDrop?: (
    files: globalThis.File[],
    options: { migrateToWraft: boolean },
  ) => void;
  showOpen?: boolean;
  onClose?: () => void;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
  maxFiles?: number;
}

const StyledDropZone = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledDropZoneContent = styled(motion.div)`
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  text-align: center;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  min-width: auto;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--colors-background-secondary);
  color: var(--colors-text-primary);
  border: 1px solid var(--colors-border);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--colors-background-tertiary);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onDrop = () => {},
  showOpen = false,
  onClose,
  accept = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      '.docx',
    ],
    'application/msword': ['.doc'],
    'application/vnd.oasis.opendocument.text': ['.odt'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      '.xlsx',
    ],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      ['.pptx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.oasis.opendocument.presentation': ['.odp'],
    'text/plain': ['.txt'],
    'text/rtf': ['.rtf'],
  },
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(showOpen);
  const [dragCount, setDragCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [migrateToWraft, setMigrateToWraft] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDragging(showOpen);
  }, [showOpen]);

  // const handleDragEnter = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragCount((prev) => prev + 1);
  //   setIsDragging(true);
  // };

  // const handleDragLeave = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragCount((prev) => prev - 1);
  //   if (dragCount <= 1) {
  //     setIsDragging(false);
  //   }
  // };

  // const handleDragOver = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  // };

  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragCount(0);

  //   const files: File[] = [];
  //   const items = e.dataTransfer.items;

  //   if (items) {
  //     for (let i = 0; i < items.length; i++) {
  //       const item = items[i];
  //       if (item.kind === 'file') {
  //         const file = item.getAsFile();
  //         if (file) {
  //           files.push(file);
  //         }
  //       }
  //     }
  //   } else {
  //     const droppedFiles = e.dataTransfer.files;
  //     for (let i = 0; i < droppedFiles.length; i++) {
  //       files.push(droppedFiles[i]);
  //     }
  //   }

  //   if (files.length > 0) {
  //     const newUploadedFiles = files.map((file) => ({
  //       id: Math.random().toString(36).substr(2, 9),
  //       name: file.name,
  //       size: file.size,
  //       type: file.type,
  //       file: file,
  //       preview:
  //         file.type === 'application/pdf'
  //           ? URL.createObjectURL(file)
  //           : undefined,
  //     }));
  //     setUploadedFiles(newUploadedFiles);
  //   }
  // };

  const handleUpload = () => {
    onDrop(
      uploadedFiles.map((f) => f.file),
      { migrateToWraft },
    );
    setUploadedFiles([]);
    setMigrateToWraft(false);
    setIsDragging(false);
  };

  const handleCancel = useCallback(() => {
    // Clean up object URLs
    uploadedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setUploadedFiles([]);
    setMigrateToWraft(false);
    setIsDragging(false);
    onClose?.();
  }, [uploadedFiles, onClose]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCancel();
      }
    },
    [handleCancel],
  );

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    },
    [handleCancel],
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isDragging, handleClickOutside, handleEscapeKey]);

  const handleRemoveFile = (fileId: string) => {
    const fileToRemove = uploadedFiles.find((f) => f.id === fileId);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setUploadedFiles((files) => files.filter((f) => f.id !== fileId));
  };

  const validateFiles = (files: globalThis.File[]): string | null => {
    if (files.length > maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    for (const file of files) {
      if (file.size > maxSize) {
        return `File ${file.name} exceeds maximum size of ${formatFileSize(maxSize)}`;
      }

      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const isValidType = Object.entries(accept).some(
        ([mimeType, extensions]) => {
          return file.type === mimeType || extensions.includes(fileExtension);
        },
      );

      if (!isValidType) {
        return `File ${file.name} is not an accepted file type`;
      }
    }

    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validationError = validateFiles(files);

    if (validationError) {
      setError(validationError);
      return;
    }

    const newUploadedFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      preview:
        file.type === 'application/pdf' ? URL.createObjectURL(file) : undefined,
    }));
    setUploadedFiles(newUploadedFiles);
    setError(null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const handleDragEnterGlobal = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCount((prev) => prev + 1);
      setIsDragging(true);
    };

    const handleDragLeaveGlobal = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCount((prev) => prev - 1);
      if (dragCount <= 1) {
        setIsDragging(false);
      }
    };

    const handleDropGlobal = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!uploadedFiles.length) {
        setIsDragging(false);
      }
      setDragCount(0);
    };

    document.addEventListener('dragenter', handleDragEnterGlobal);
    document.addEventListener('dragleave', handleDragLeaveGlobal);
    document.addEventListener('drop', handleDropGlobal);

    return () => {
      document.removeEventListener('dragenter', handleDragEnterGlobal);
      document.removeEventListener('dragleave', handleDragLeaveGlobal);
      document.removeEventListener('drop', handleDropGlobal);
      // Clean up object URLs on unmount
      uploadedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [dragCount, uploadedFiles.length]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isDragging) {
    return (
      <AnimatePresence>
        <StyledDropZone
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <StyledDropZoneContent
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}>
            <CloseButton
              variant="ghost"
              onClick={handleCancel}
              aria-label="Close upload modal">
              <X size={20} />
            </CloseButton>

            <Flex direction="column" gap="lg">
              <Text as="h2" fontSize="xl" fontWeight="medium">
                Upload Files
              </Text>

              {uploadedFiles.length === 0 ? (
                <Flex direction="column" align="center" gap="lg">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept={Object.entries(accept)
                      .map(
                        ([mimeType, extensions]) =>
                          `${mimeType},${extensions.join(',')}`,
                      )
                      .join(',')}
                    multiple
                    style={{ display: 'none' }}
                  />
                  <Box
                    p="xl"
                    borderRadius="full"
                    bg="primary-light"
                    color="primary"
                    onClick={handleClick}
                    style={{ cursor: 'pointer' }}>
                    <UploadSimple size={32} weight="bold" />
                  </Box>
                  <Text as="div" fontSize="lg" fontWeight="medium">
                    Drop files here or click to upload
                  </Text>
                  <Text as="div" color="text-secondary">
                    Drag and drop your files to upload
                  </Text>
                  {error && (
                    <Text as="div" color="error" mt="sm">
                      {error}
                    </Text>
                  )}
                </Flex>
              ) : (
                <Flex direction="column" gap="lg">
                  <Box
                    maxHeight="300px"
                    overflowY="auto"
                    border="1px solid"
                    borderColor="border"
                    borderRadius="md"
                    p="md">
                    {uploadedFiles.map((file) => (
                      <Flex
                        key={file.id}
                        alignItems="center"
                        gap="sm"
                        p="sm"
                        borderBottom={
                          file.id !== uploadedFiles[uploadedFiles.length - 1].id
                            ? '1px solid'
                            : 'none'
                        }
                        borderColor="border">
                        <FileText size={20} />
                        <Box flex={1}>
                          <Text as="div" fontWeight="medium">
                            {file.name}
                          </Text>
                          <Text as="div" fontSize="sm" color="text-secondary">
                            {formatFileSize(file.size)}
                          </Text>
                        </Box>
                        <Button
                          variant="ghost"
                          onClick={() => handleRemoveFile(file.id)}
                          style={{ padding: '4px' }}>
                          <X size={20} />
                        </Button>
                      </Flex>
                    ))}
                  </Box>

                  {uploadedFiles.some(
                    (file) => file.type === 'application/pdf',
                  ) && (
                    <Box
                      border="1px solid"
                      borderColor="border"
                      borderRadius="md"
                      p="md"
                      maxHeight="400px"
                      overflowY="auto">
                      {uploadedFiles.map(
                        (file) =>
                          file.type === 'application/pdf' &&
                          file.preview && (
                            <Box key={file.id} mb="md">
                              <PdfViewer url={file.preview} pageNumber={1} />
                            </Box>
                          ),
                      )}
                    </Box>
                  )}

                  <Flex alignItems="center" gap="sm">
                    <Checkbox
                      checked={migrateToWraft}
                      onChange={(e) => setMigrateToWraft(e.target.checked)}
                    />
                    <Text>Enable Migrate to Wraft Document</Text>
                  </Flex>

                  <Flex gap="sm" justifyContent="flex-end">
                    <Button variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpload}>
                      Upload
                    </Button>
                  </Flex>
                </Flex>
              )}
            </Flex>
          </StyledDropZoneContent>
        </StyledDropZone>
      </AnimatePresence>
    );
  }

  return null;
};
