import React, { useCallback, useEffect } from 'react';
import { TickIcon } from '@wraft/icon';
import { Accept, useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button, Flex, Input, Text, useThemeUI } from 'theme-ui';

import { Asset } from '../../utils/types';
import { ApproveTick, Close, CloudUploadIcon } from '../Icons';
import ProgressBar from './ProgressBar';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type DropzoneProps = {
  accept?: Accept;
  progress?: number;
  assets?: Asset[];
  setPdfPreview?: (e: any) => void;
  setIsSubmit: any;
  setDeleteAssets?: any;
  multiple?: boolean;
  noChange?: boolean;
};

const Dropzone = ({
  accept,
  progress,
  assets,
  setPdfPreview,
  setIsSubmit,
  setDeleteAssets,
  multiple = false,
  noChange = false,
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
      setValue('file', droppedFiles, { shouldValidate: true });
    },
    [setValue],
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
    <Box
      sx={{
        width: '100%',
        border: '1px dashed',
        borderColor: 'neutral.200',
        borderRadius: '4px',
      }}>
      {assets && assets.length > 0 && (
        <Box
          sx={{
            width: '100%',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bg: 'background',
            py: '24px',
          }}>
          <Box
            onClick={() => {
              setValue('file', undefined);
              setPdfPreview && setPdfPreview(undefined);
              setDeleteAssets((prev: boolean) => !prev);
            }}
            sx={{
              position: 'absolute',
              top: 3,
              right: 3,
              cursor: 'pointer',
            }}>
            <Close width={24} height={24} />
          </Box>
          <Document file={assets[assets.length - 1].file}>
            <Page pageNumber={1} width={251} />
          </Document>
        </Box>
      )}
      <Box
        {...getRootProps()}
        sx={{
          width: '100%',
          bg: isDragActive ? 'grayA35' : 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '4px',
          height: '100%',
          py: '18px',
          px: 3,
        }}>
        <Input
          type="file"
          name="file"
          sx={{ display: 'none' }}
          {...getInputProps({})}
        />
        {!assets && (
          <Box
            sx={{
              height: '52px',
              width: '52px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '4px',
            }}>
            <CloudUploadIcon width={32} height={32} />
          </Box>
        )}
        {assets && assets.length > 0 ? (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Flex
              sx={{
                alignItems: 'center',
              }}>
              <Text variant="pM">{assets[assets.length - 1].name}</Text>
              <Box
                sx={{
                  height: '16px',
                  width: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bg: 'green.700',
                  borderRadius: '44px',
                  ml: 2,
                }}>
                <TickIcon
                  color={themeui?.theme?.colors?.white as string}
                  height={12}
                  width={12}
                  viewBox="0 0 24 24"
                />
              </Box>
            </Flex>
            <Button
              variant="buttonSmall"
              onClick={(e) => {
                e.preventDefault();
              }}>
              re-upload
            </Button>
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
                <Text variant="pM" sx={{ mb: 1 }}>
                  Drag & drop or upload files
                </Text>
                <Text variant="capM">{types || 'All'} - Max file size 1MB</Text>
              </Flex>
            )}
            {files && files[0] && !noChange && (
              <Flex sx={{ alignItems: 'center' }}>
                <Text variant="pM" sx={{ flexShrink: 0 }}>
                  {files[0].name}
                </Text>
                {assets && assets.length > 0 && (
                  <Box
                    sx={{
                      color: 'green.700',
                      ml: '12px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                    }}>
                    <ApproveTick />
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
          <div />
        )}
      </Box>
    </Box>
  );
};

export default Dropzone;
