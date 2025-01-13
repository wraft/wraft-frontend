import React, { useCallback, useEffect } from 'react';
import { TickIcon, ApproveTickIcon, CloudUploadIcon } from '@wraft/icon';
import { Accept, useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Button, Flex, Input, useThemeUI } from 'theme-ui';
import { SystemProps, x } from '@xstyled/emotion';

import ProgressBar from 'components/common/ProgressBar';
import { Box } from 'common/Box';
import { Text } from 'common/Text';
import { Asset } from 'utils/types';

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
};

const Dropzone = ({
  accept,
  progress,
  assets,
  setIsSubmit,
  multiple = false,
  noChange = false,
  onDropped,
}: DropzoneProps) => {
  const { setValue, watch, register } = useFormContext();

  const files = watch('file');
  const themeui = useThemeUI();

  useEffect(() => {
    if (files && files.length > 0) {
      setIsSubmit((prev: boolean) => !prev);
    }
  }, [files]);

  const onDrop = useCallback(
    (droppedFiles: any) => {
      onDropped && onDropped(droppedFiles);
      setValue('file', droppedFiles, { shouldValidate: true });
    },
    [setValue, onDropped],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 1 * 1024 * 1024, //1MB in bytes
    multiple: multiple,
    accept: accept || { '*': [] },
  });

  const types = Object.keys(accept || {})
    .map((type) => type.split('/')[1].toUpperCase())
    .join(', ');

  register('file');

  return (
    <Box border="1px dashed" borderColor="neutral.200" borderRadius="4px">
      <Box
        {...getRootProps()}
        w="100%"
        bg={isDragActive ? 'grayA35' : 'white'}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        borderRadius="4px"
        h="100%"
        py="18px"
        px={3}>
        <Input
          type="file"
          name="file"
          sx={{ display: 'none' }}
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
            <Flex
              sx={{
                alignItems: 'center',
                pl: 2,
              }}>
              <Text>{assets[assets.length - 1].name}</Text>
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
                  color={themeui?.theme?.colors?.white as string}
                  height={12}
                  width={12}
                  viewBox="0 0 24 24"
                />
              </Box>
            </Flex>
            <Flex sx={{ gap: 3, pr: 1 }}>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                }}>
                Change File
              </Button>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                }}>
                Remove
              </Button>
            </Flex>
          </Box>
        ) : (
          <>
            {(!files || noChange) && (
              <Flex
                sx={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  mt: '12px',
                }}>
                <Text fontSize="sm" fontWeight="bold" mb={0} color="gray.1100">
                  Drag & drop or upload valid <a href="#">Wraft</a> files
                </Text>
                <Text fontSize="xs" mt={1} color="gray.900">
                  A valid structure file is a zip contains a valid wraft.json
                  {/* {types || 'All'} - Max file size 1MB */}
                </Text>
              </Flex>
            )}
            {files && files[0] && !noChange && (
              <Flex sx={{ alignItems: 'center' }}>
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
        {progress && progress > 0 && !noChange ? (
          <Box mt={3}>
            <ProgressBar progress={progress} />
          </Box>
        ) : (
          <Box />
        )}
      </Box>
    </Box>
  );
};

export default Dropzone;
