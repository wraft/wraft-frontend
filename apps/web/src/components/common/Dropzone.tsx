import React, { useCallback, useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';
import { Box, Flex, Input, Text } from 'theme-ui';

import { CloudUploadIcon } from '../Icons';
import ProgressBar from './ProgressBar';

type DropzoneProps = {
  files: File[] | null;
  setFiles: (f: any) => void;
  filetype?: 'layout' | 'theme';
  progress?: number;
};

const Dropzone = ({ files, setFiles, filetype, progress }: DropzoneProps) => {
  const [accept, setAccept] = useState<any>({ '*': [] });
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
            const pdfPreview = document.getElementById(
              'pdfPreview',
            ) as HTMLImageElement;
            if (pdfPreview) {
              pdfPreview.src = fileReader.result as string;
            }
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
        {files && files[0] ? <Text>{files[0].name}</Text> : <div />}
        {progress && progress > 0 ? (
          <ProgressBar progress={progress} />
        ) : (
          <div />
        )}
      </Box>
      {/* <Box>
        {files && files?.length > 0 && (
          <Box>
            <Text>Accepted Files</Text>
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </Box>
        )}
      </Box> */}
      {/* {filetype && filetype === 'layout' && (
        <embed
          id="pdfPreview"
          type="application/pdf"
          width="500"
          height="375"
          style={{
            border: 'none',
            overflow: 'hidden',
            objectFit: 'contain',
          }}
        />
      )} */}
    </Box>
  );
};

export default Dropzone;
