import React, { useCallback, useEffect } from 'react';

import { Accept, useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Flex, Input, Text } from 'theme-ui';

import { ApproveTick, Close, CloudUploadIcon } from '../Icons';

import ProgressBar from './ProgressBar';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type DropzoneProps = {
  accept?: Accept;
  progress?: number;
  pdfPreview?: string | undefined;
  setPdfPreview?: (e: any) => void;
  setIsSubmit: any;
  setDeleteAssets?: any;
};

const Dropzone = ({
  accept,
  progress,
  pdfPreview,
  setPdfPreview,
  setIsSubmit,
  setDeleteAssets,
}: DropzoneProps) => {
  const { setValue, watch, register } = useFormContext();

  const files = watch('file');

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
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024, //1MB in bytes
    multiple: false,
    accept: accept || { '*': [] },
  });

  register('file');

  return (
    <Box
      sx={{
        width: '100%',
        border: '1px dashed',
        borderColor: 'neutral.200',
        borderRadius: '4px',
      }}>
      {pdfPreview && (
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
          <Document file={pdfPreview}>
            <Page pageNumber={1} width={251} />
          </Document>
        </Box>
      )}
      <Box
        {...getRootProps()}
        sx={{
          widows: '100%',
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
        {!pdfPreview && (
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
        {!files && (
          <Flex
            sx={{
              flexDirection: 'column',
              alignItems: 'center',
              mt: '12px',
            }}>
            <Text variant="pM" sx={{ mb: 1 }}>
              Drag & drop or upload files
            </Text>
            <Text variant="capM">PDF - Max file size 1MB</Text>
          </Flex>
        )}
        {files && files[0] && (
          <Flex sx={{ alignItems: 'center' }}>
            <Text variant="pM" sx={{ flexShrink: 0 }}>
              {files[0].name}
            </Text>
            {pdfPreview && (
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
        {progress && progress > 0 ? (
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
