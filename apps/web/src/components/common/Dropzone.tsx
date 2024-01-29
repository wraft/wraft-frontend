import React, { useCallback, useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Document, Page } from 'react-pdf';
import { Box, Flex, Input, Text } from 'theme-ui';

import { Close, CloudUploadIcon } from '../Icons';

import Button from './Button';
import ProgressBar from './ProgressBar';

type DropzoneProps = {
  filetype?: 'layout' | 'theme';
  progress?: number;
  pdfPreview?: string | undefined;
  setPdfPreview?: (e: any) => void;
  deleteAsset?: any;
  onChange?: any;
};

const Dropzone = ({
  filetype,
  progress,
  pdfPreview,
  setPdfPreview,
  // deleteAsset,
  onChange,
}: DropzoneProps) => {
  const [accept, setAccept] = useState<any>({ '*': [] });
  const { setValue, watch, register } = useFormContext();

  const files = watch('file');

  useEffect(() => {
    console.log('🥋', pdfPreview);
  }, [pdfPreview]);

  useEffect(() => {
    if (filetype === 'layout') {
      setAccept({
        'application/pdf': [],
      });
    } else if (filetype === 'theme') {
      setAccept({
        'font/ttf': ['.ttf'],
        'font/otf': ['.otf'],
      });
    }
  }, []);

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
    accept: accept, //based on acceptedFormat
  });

  register('file', { required: 'File is required' });

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
          {...getInputProps({ onChange })}
          onChange={onChange}
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
        {files && files[0] ? (
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text variant="pM" sx={{ flexShrink: 0 }}>
              {files[0].name}
            </Text>
            {pdfPreview && (
              <Box>
                <Button>Re-upload</Button>
              </Box>
            )}
          </Flex>
        ) : (
          <div />
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
