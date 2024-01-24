import React, { useCallback, useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';
import { Box, Text } from 'theme-ui';

type DropzoneProps = {
  files: File[] | null;
  setFiles: (f: any) => void;
  filetype?: 'layout' | 'theme';
};

const Dropzone = ({ files, setFiles, filetype }: DropzoneProps) => {
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
          border: isDragActive ? 'dashed 3px green' : 'dashed 2px #ccc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '4px',
          height: '100%',
        }}>
        <input {...getInputProps()} />
        <Text>Click here to choose file</Text>
      </Box>
      <Box>
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
      </Box>
      {filetype && filetype === 'layout' && (
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
      )}
    </Box>
  );
};

export default Dropzone;
