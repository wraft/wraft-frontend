import React, { useCallback, useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';
import { Document, Page } from 'react-pdf';
import { Box, Flex, Input, Text } from 'theme-ui';

import { Close, CloudUploadIcon } from '../Icons';

import ProgressBar from './ProgressBar';

type DropzoneProps = {
  files: File[] | null;
  setFiles: (f: any) => void;
  filetype?: 'layout' | 'theme';
  progress?: number;
};

const Dropzone = ({ files, setFiles, filetype, progress }: DropzoneProps) => {
  const [accept, setAccept] = useState<any>({ '*': [] });
  const [previewResult, setPreviewResult] = useState<string | undefined>(
    undefined,
  );
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
    (acceptedFiles: any[]) => {
      const updatedFiles = acceptedFiles.map((file) => {
        return new Promise((resolve) => {
          const fileReader = new FileReader();
          fileReader.onloadend = () => {
            setPreviewResult(fileReader.result as string);
            resolve(
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              }),
            );
          };
          fileReader.readAsDataURL(file);
        });
      });

      Promise.all(updatedFiles).then((files) => {
        setFiles(files);
      });
    },
    [setFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024, //1MB in bytes
    multiple: false,
    accept: accept, //based on acceptedFormat
  });

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '1px dashed',
          borderColor: isDragActive ? 'green.500' : 'neutral.300',
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
        <Input sx={{ display: 'none' }} {...getInputProps()} />
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
        {!files && (
          <Flex
            sx={{ flexDirection: 'column', alignItems: 'center', mt: '12px' }}>
            <Text variant="pM" sx={{ mb: 1 }}>
              Drag & drop or upload files
            </Text>
            <Text variant="capM">PDF - Max file size 1MB</Text>
          </Flex>
        )}
        {files && files[0] ? (
          <Text variant="pM">{files[0].name}</Text>
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
      <Box sx={{ objectFit: 'contain', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
          <Close width={24} height={24} />
        </Box>
        <Document file={previewResult}>
          <Page pageNumber={1} />
        </Document>
      </Box>
    </Box>
  );
};

export default Dropzone;
