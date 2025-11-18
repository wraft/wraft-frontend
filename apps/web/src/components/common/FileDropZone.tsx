import React, { useCallback, useState, useEffect } from 'react';
import { Box, Flex, Text, Button, Checkbox } from '@wraft/ui';
import { UploadSimpleIcon, XIcon, FileTextIcon } from '@phosphor-icons/react';
import { Accept, useDropzone, FileRejection } from 'react-dropzone';

import PdfViewer from 'common/PdfViewer';

import ProgressBar from './ProgressBar';

export interface FileDropZoneProps {
  onDrop?: (files: File[], options?: { migrateToWraft?: boolean }) => void;
  onClose?: () => void;
  showOpen?: boolean;
  accept?: Accept;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  noChange?: boolean;
  progress?: number;
  isLoading?: boolean;
  assets?: Array<{
    id: string;
    name: string;
    file: string;
    type: string;
  }>;
  setPdfPreview?: (preview: string | null) => void;
  setIsSubmit?: (isSubmit: boolean) => void;
  setDeleteAssets?: (deleteAssets: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  onExtract?: (files: File[]) => void;
  onSkip?: (files: File[]) => void;
  onCheckMark?: (files: File[]) => boolean | void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  preview?: string;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_MAX_FILES = 10;
const DEFAULT_ACCEPT = {
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
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    '.pptx',
  ],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.oasis.opendocument.presentation': ['.odp'],
  'text/plain': ['.txt'],
  'text/rtf': ['.rtf'],
} as const;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getAcceptedFileTypes = (accept: Accept): string => {
  return Object.keys(accept)
    .map((type) => type.split('/')[1].toUpperCase())
    .join(', ');
};

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onDrop = () => {},
  onClose,
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  maxFiles = DEFAULT_MAX_FILES,
  multiple = false,
  noChange = false,
  progress,
  isLoading,
  className,
  style,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [migrateToWraft, setMigrateToWraft] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileRejection = useCallback(
    (fileRejections: FileRejection[]) => {
      if (fileRejections.length === 0) return;
      const rejection = fileRejections[0];
      const rejectionError = rejection.errors[0];
      switch (rejectionError.code) {
        case 'file-too-large':
          setError(`File size exceeds ${formatFileSize(maxSize)} limit`);
          break;
        case 'file-invalid-type':
          setError(
            `Invalid file type. Please upload a ${getAcceptedFileTypes(accept)} file`,
          );
          break;
        case 'too-many-files':
          setError(`Maximum ${maxFiles} files allowed`);
          break;
        default:
          setError('Error uploading file. Please try again.');
      }
    },
    [maxSize, maxFiles, accept],
  );

  const onDropCallback = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      handleFileRejection(fileRejections);
      if (fileRejections.length > 0) return;
      setError(null);
      const newUploadedFiles = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        preview:
          file.type === 'application/pdf'
            ? URL.createObjectURL(file)
            : undefined,
      }));
      setUploadedFiles(newUploadedFiles);
    },
    [handleFileRejection],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: onDropCallback,
      maxSize,
      multiple,
      accept,
      maxFiles,
    });

  const handleUpload = useCallback(() => {
    onDrop(
      uploadedFiles.map((f) => f.file),
      { migrateToWraft },
    );
    setUploadedFiles([]);
    setMigrateToWraft(false);
    onClose?.();
  }, [onDrop, uploadedFiles, migrateToWraft, onClose]);

  const handleCancel = useCallback(() => {
    uploadedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setUploadedFiles([]);
    setMigrateToWraft(false);
    onClose?.();
  }, [uploadedFiles, migrateToWraft, onClose]);

  const handleRemoveFile = useCallback(
    (fileId: string) => {
      const fileToRemove = uploadedFiles.find((f) => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      setUploadedFiles((files) => files.filter((f) => f.id !== fileId));
    },
    [uploadedFiles],
  );

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [uploadedFiles]);

  // Main drop area UI
  return (
    <>
      <Box
        {...getRootProps()}
        border="1px dashed"
        borderColor={
          isDragReject ? 'error' : isDragActive ? 'primary' : 'border'
        }
        borderRadius="md"
        p="xl"
        bg={isDragActive ? 'grayA35' : 'white'}
        className={className}
        style={style}
        tabIndex={0}
        aria-label="File upload dropzone"
        minHeight="200px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        outline="none">
        <Flex
          direction="column"
          align="center"
          gap="md"
          style={{ width: '100%' }}>
          {uploadedFiles.length === 0 && (
            <>
              <Flex direction="column" align="center" gap="md">
                <input {...getInputProps()} />
                <Box
                  h="64px"
                  w="64px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="full"
                  bg="primary-light"
                  color="primary">
                  <UploadSimpleIcon size={32} weight="bold" />
                </Box>
                <Text fontSize="lg" fontWeight="medium">
                  Drop files here or click to browse
                </Text>
                <Text fontSize="sm" color="text-secondary">
                  Supports PDF, Word, Excel, PowerPoint, and text files
                </Text>
              </Flex>
            </>
          )}
          {error && (
            <Text color="error" mt="sm">
              {error}
            </Text>
          )}
          {uploadedFiles.length > 0 && !noChange && (
            <Box style={{ width: '100%', maxWidth: 400, marginTop: '1rem' }}>
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
                  <FileTextIcon size={20} />
                  <Box flex={1} minWidth={0}>
                    <Text fontWeight="medium">{file.name}</Text>
                    <Text fontSize="sm" color="text-secondary">
                      {formatFileSize(file.size)}
                    </Text>
                  </Box>
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file.id);
                    }}
                    style={{ padding: '4px' }}
                    aria-label={`Remove ${file.name}`}>
                    <XIcon size={20} />
                  </Button>
                </Flex>
              ))}
            </Box>
          )}
          {uploadedFiles.length > 0 && (
            <Flex alignItems="left" gap="sm" mt="md">
              <Checkbox
                checked={migrateToWraft}
                onChange={(e) => setMigrateToWraft(e.target.checked)}
                aria-label="Enable Migrate to Wraft Document"
              />
              <Text fontSize="sm">Enable Migrate to Wraft Document</Text>
            </Flex>
          )}
          {uploadedFiles.some((file) => file.type === 'application/pdf') && (
            <Box
              border="1px solid"
              borderColor="border"
              borderRadius="md"
              p="md"
              maxHeight="300px"
              overflowY="auto"
              style={{ width: '100%', maxWidth: 400, marginTop: '1rem' }}>
              <Text fontSize="sm" fontWeight="medium" mb="sm">
                PDF Preview
              </Text>
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
          {progress !== undefined && progress > 0 && !noChange && (
            <Box style={{ marginTop: '1rem', width: '100%', maxWidth: 400 }}>
              <ProgressBar progress={progress} />
            </Box>
          )}
        </Flex>
      </Box>
      <Flex gap="sm" justifyContent="flex-end" mt="md">
        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            handleCancel();
          }}
          disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleUpload();
          }}
          disabled={uploadedFiles.length === 0 || isLoading}
          loading={isLoading}>
          {isLoading
            ? 'Uploading...'
            : `Upload${uploadedFiles.length > 0 ? ` (${uploadedFiles.length})` : ''}`}
        </Button>
      </Flex>
    </>
  );
};

export default FileDropZone;
