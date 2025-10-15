import React, { useCallback, useEffect, useState } from 'react';
import { TickIcon, ApproveTickIcon, CloudUploadIcon } from '@wraft/icon';
import { Accept, useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Box, Flex, Text } from '@wraft/ui';

import ProgressBar from 'components/common/ProgressBar';
import { Asset } from 'utils/types';

import UrlUploader from './UrlDropZone';

type DropzoneProps = {
  accept?: Accept;
  progress?: number;
  assets?: Asset[];
  setPdfPreview?: (e: any) => void;
  setIsSubmit: any;
  setDeleteAssets?: any;
  multiple?: boolean;
  noChange?: boolean;
  onDropped?: (e: any) => void;
  onUpload?: (data: any) => void;
};

const Dropzone = ({
  accept,
  progress,
  assets,
  setIsSubmit,
  multiple = false,
  noChange = false,
  onDropped,
  onUpload,
}: DropzoneProps) => {
  const { setValue, watch, register } = useFormContext();
  const [error, setError] = useState<string | null>(null);

  const files = watch('file');

  useEffect(() => {
    if (files && files.length > 0) {
      setIsSubmit((prev: boolean) => !prev);
    }
  }, [files]);

  const onDrop = useCallback(
    (droppedFiles: any, fileRejections: any) => {
      if (fileRejections && fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors[0].code === 'file-too-large') {
          setError('File size exceeds 2MB limit');
        } else if (rejection.errors[0].code === 'file-invalid-type') {
          const types = Object.keys(accept || {})
            .map((type) => type.split('/')[1].toUpperCase())
            .join(', ');
          setError(`Invalid file type. Please upload a ${types} file`);
        } else {
          setError('Error uploading file. Please try again.');
        }
        return;
      }
      setError(null);
      onDropped && onDropped(droppedFiles);
      setValue('file', droppedFiles, { shouldValidate: true });
    },
    [setValue, onDropped, accept],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      maxSize: 2 * 1024 * 1024, //2MB in bytes
      multiple: multiple,
      accept: accept || { '*': [] },
    });

  register('file');

  return (
    <Box
      bg="background-primary"
      w="100%"
      minWidth="556px"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.400"
      p="xl">
      <Box mb="xl" display="flex" justifyContent="center">
        <Box w="100%" maxWidth="600px">
          <Box
            border="1px dashed"
            borderColor={isDragReject ? 'error' : 'neutral.200'}
            borderRadius="4px"
            bg={isDragActive ? 'grayA35' : 'transparent'}
            transition="all 0.2s ease">
            <Box
              {...getRootProps()}
              w="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              borderRadius="4px"
              h="100%"
              py="40px"
              px="md"
              cursor="pointer">
              <input
                type="file"
                name="file"
                style={{ display: 'none' }}
                {...getInputProps({})}
              />

              {!assets && (
                <Box
                  h="52px"
                  w="52px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="4px">
                  <CloudUploadIcon width={32} height={32} />
                </Box>
              )}

              {assets && assets.length > 0 ? (
                <Box
                  w="100%"
                  display="flex"
                  alignItems="center"
                  borderRadius="6px"
                  justifyContent="space-between">
                  <Flex as="div" alignItems="center" pl={2}>
                    <Text fontWeight="medium">
                      {assets[assets.length - 1].name}
                    </Text>
                    <Box
                      bg="green.700"
                      h="16px"
                      w="16px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="44px"
                      ml={2}>
                      <TickIcon
                        color="white"
                        height={12}
                        width={12}
                        viewBox="0 0 24 24"
                      />
                    </Box>
                  </Flex>
                  <Flex as="div" gap={3} pr={1}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}>
                      Change File
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}>
                      Remove
                    </button>
                  </Flex>
                </Box>
              ) : (
                <>
                  {(!files || noChange) && (
                    <Flex
                      as="div"
                      flexDirection="column"
                      alignItems="center"
                      mt="12px">
                      <Text fontWeight="bold">
                        Drag & drop or upload valid <a href="#">Wraft</a> files
                      </Text>
                      <Text fontSize="sm" color="text-secondary">
                        A valid structure file is a zip contains a valid
                        wraft.json
                      </Text>
                    </Flex>
                  )}
                  {files && files[0] && !noChange && (
                    <Flex as="div" alignItems="center">
                      <Text flexShrink={0}>{files[0].name}</Text>
                      {assets && assets.length > 0 && (
                        <Box
                          color="green.700"
                          ml="12px"
                          justifyContent="center"
                          alignItems="center"
                          display="flex">
                          <ApproveTickIcon />
                        </Box>
                      )}
                    </Flex>
                  )}
                </>
              )}

              {error && (
                <Text color="error" mt={2} fontSize="sm">
                  {error}
                </Text>
              )}

              {progress && progress > 0 && !noChange ? (
                <Box mt={3}>
                  <ProgressBar progress={progress} />
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Box>

      <Flex alignItems="center" mb="lg" justifyContent="center">
        <Box flex="1" maxWidth="600px" display="flex" alignItems="center">
          <Box flex={1} h="1px" bg="border" />
          <Text fontSize="sm" fontWeight="medium" px="md">
            OR
          </Text>
          <Box flex="1" h="1px" bg="border" />
        </Box>
      </Flex>

      <Box display="flex" justifyContent="center">
        <Box w="100%" maxWidth="600px">
          {onUpload && <UrlUploader onUpload={onUpload} />}
        </Box>
      </Box>
    </Box>
  );
};

export default Dropzone;
