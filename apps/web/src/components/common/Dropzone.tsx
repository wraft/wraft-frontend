import React, { useCallback, useEffect, useState } from 'react';
import {
  // TickIcon,
  ApproveTickIcon,
  CloudUploadIcon,
  CloseIcon,
} from '@wraft/icon';
import { Accept, useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Box, Flex, Input, Text } from 'theme-ui';
import { Button } from '@wraft/ui';

import LayoutScaling from 'components/Layout/LayoutScaling';
// import PdfViewer from 'common/PdfViewer';
import { IAsset } from 'utils/types';

import ProgressBar from './ProgressBar';

const DEFAULT_MARGINS = {
  top: 2.54,
  right: 2.54,
  bottom: 2.54,
  left: 2.54,
};

const A4_DIMENSIONS = {
  width: 21.0, // cm
  height: 29.7, // cm
};

type DropzoneProps = {
  accept?: Accept;
  progress?: number;
  assets?: IAsset[];
  setPdfPreview?: (e: any) => void;
  setIsSubmit: any;
  setDeleteAssets?: any;
  multiple?: boolean;
  noChange?: boolean;
  onMarginsChange?: (margins: any) => void;
  onPdfDimensionsChange?: (dimensions: any) => void;
  pdfPreview?: any;
  // Add props to distinguish between layout and theme usage
  mode?: 'layout' | 'theme';
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
  onMarginsChange,
  pdfPreview,
  mode = 'layout', // Default to layout mode
}: DropzoneProps) => {
  const { setValue, watch, register } = useFormContext();
  const [margins, setMargins] = useState(DEFAULT_MARGINS);
  const files = watch('file');
  // const themeui = useThemeUI();

  useEffect(() => {
    if (files && files.length > 0) {
      setIsSubmit((prev: boolean) => !prev);
    }
  }, [files, setIsSubmit]);

  useEffect(() => {
    if (onMarginsChange) {
      onMarginsChange(margins);
    }
  }, [margins, onMarginsChange]);

  const onDrop = useCallback(
    (droppedFiles: any) => {
      setValue('file', droppedFiles, { shouldValidate: true });
      // Reset margins to default when a new file is dropped (only for layout mode)
      if (mode === 'layout') {
        setMargins(DEFAULT_MARGINS);
      }
    },
    [setValue, setPdfPreview, mode],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024,
    multiple: multiple,
    accept: accept || { '*': [] },
  });

  const types = Object.keys(accept || {})
    .map((type) => type.split('/')[1].toUpperCase())
    .join(', ');

  register('file');

  const handleDeleteFile = () => {
    setValue('file', undefined);
    setPdfPreview && setPdfPreview(undefined);
    setDeleteAssets && setDeleteAssets((prev: boolean) => !prev);
    if (mode === 'layout') {
      setMargins(DEFAULT_MARGINS); // Reset margins when file is deleted (only for layout)
    }
  };

  const handleMarginsChange = useCallback(
    (newMargins: typeof DEFAULT_MARGINS) => {
      setMargins(newMargins);
      if (onMarginsChange) {
        onMarginsChange(newMargins);
      }
    },
    [onMarginsChange],
  );

  const getCurrentPdfUrl = () => {
    // Only handle pdfPreview for layout mode
    if (mode === 'layout' && pdfPreview && pdfPreview.file) {
      return pdfPreview.file;
    }
    if (assets && assets.length > 0) {
      return assets[assets.length - 1].file;
    }
    if (files && files.length > 0) {
      return URL.createObjectURL(files[0]);
    }
    return null;
  };

  const currentPdfUrl = getCurrentPdfUrl();

  // Different logic for hasFile based on mode
  const hasFile =
    mode === 'layout'
      ? pdfPreview ||
        (assets && assets.length > 0) ||
        (files && files.length > 0)
      : files && files.length > 0; // For theme mode, only check files

  // Only show layout scaling for layout mode and PDF files
  const showLayoutScaling =
    mode === 'layout' &&
    hasFile &&
    (accept?.['application/pdf'] ||
      (files && files[0] && files[0].type === 'application/pdf') ||
      (pdfPreview && pdfPreview.type === 'application/pdf'));

  return (
    <Box
      sx={{
        width: '100%',
        border: '1px dashed',
        borderColor: 'neutral.200',
        borderRadius: '4px',
      }}>
      {hasFile && showLayoutScaling && (
        <Box
          sx={{
            width: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bg: 'background-primary',
          }}>
          <Box
            onClick={handleDeleteFile}
            sx={{
              position: 'absolute',
              top: 3,
              right: 3,
              cursor: 'pointer',
              zIndex: 1000,
            }}>
            <CloseIcon width={24} height={24} />
          </Box>

          <Box>
            <LayoutScaling
              pdfUrl={currentPdfUrl || `${assets?.[assets.length - 1]?.file}`}
              containerWidth={350}
              containerHeight={350}
              initialMargins={margins}
              onMarginsChange={handleMarginsChange}
              pdfDimensions={A4_DIMENSIONS}
            />
          </Box>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: '3xl',
              gap: 'md',
            }}>
            <Text
              variant="pM"
              sx={{
                fontWeight: 'heading',
                color: '#475569',
                fontSize: '14px',
              }}>
              Replace the Current File with New File
            </Text>
            <Button
              variant="tertiary"
              onClick={(e) => {
                e.preventDefault();
                // Programmatically trigger file input click for re-upload
                const inputElement =
                  document.querySelector('input[type="file"]');
                if (inputElement) {
                  (inputElement as HTMLElement).click();
                }
              }}>
              Re-upload file
            </Button>
          </Box>
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
        {!hasFile && (
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
              <Text variant="capM">{types || 'All'} - Max file size 10MB</Text>
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
                  <ApproveTickIcon />
                </Box>
              )}
            </Flex>
          )}
        </>
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
