import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { ApproveTickIcon, CloudUploadIcon, CloseIcon } from '@wraft/icon';
import { Accept, useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Box, Flex, Input, Text } from 'theme-ui';
import { Button } from '@wraft/ui';

import LayoutScaling from 'components/Layout/LayoutScaling';
import { IAsset } from 'utils/types';

import ProgressBar from './ProgressBar';

const DEFAULT_MARGINS = {
  top: 2.54,
  right: 2.54,
  bottom: 2.54,
  left: 2.54,
};

const A4_DIMENSIONS = {
  width: 21.0,
  height: 29.7,
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
  mode?: 'layout' | 'theme';
  initialMargins?: typeof DEFAULT_MARGINS;
  isEdit?: boolean;
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
  mode = 'layout',
  initialMargins = DEFAULT_MARGINS,
}: DropzoneProps) => {
  const { setValue, watch, register } = useFormContext();
  const [margins, setMargins] = useState(initialMargins);
  const files = watch('file');

  const stablePdfUrlRef = useRef<string>('');
  const marginsRef = useRef(initialMargins);
  const isUpdatingMarginsRef = useRef(false);

  useEffect(() => {
    if (!isUpdatingMarginsRef.current) {
      marginsRef.current = initialMargins;
      setMargins(initialMargins);
    }
  }, [initialMargins]);

  const convertFileToDataUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  useEffect(() => {
    if (files && files.length > 0) {
      setIsSubmit((prev: boolean) => !prev);

      if (mode === 'layout' && files[0].type === 'application/pdf') {
        const fileName = files[0].name;

        if (!pdfPreview || pdfPreview.name !== fileName) {
          convertFileToDataUrl(files[0])
            .then((dataUrl) => {
              stablePdfUrlRef.current = dataUrl;
              setPdfPreview?.({
                name: fileName,
                file: dataUrl,
                type: files[0].type,
              });
            })
            .catch((error) => {
              console.error('Error converting file to data URL:', error);
            });
        }
      }
    }
  }, [
    files,
    setIsSubmit,
    mode,
    setPdfPreview,
    convertFileToDataUrl,
    pdfPreview,
  ]);

  const marginsChangeTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMarginsChange = useCallback(
    (newMargins: typeof DEFAULT_MARGINS) => {
      console.log('Dropzone: Margins changing to:', newMargins);

      isUpdatingMarginsRef.current = true;
      setMargins(newMargins);
      marginsRef.current = newMargins;

      if (marginsChangeTimeoutRef.current) {
        clearTimeout(marginsChangeTimeoutRef.current);
      }

      marginsChangeTimeoutRef.current = setTimeout(() => {
        if (onMarginsChange) {
          console.log('Dropzone: Calling onMarginsChange with:', newMargins);
          onMarginsChange(newMargins);
        }
        isUpdatingMarginsRef.current = false;
      }, 150);
    },
    [onMarginsChange],
  );

  useEffect(() => {
    return () => {
      if (marginsChangeTimeoutRef.current) {
        clearTimeout(marginsChangeTimeoutRef.current);
      }
    };
  }, []);

  const onDrop = useCallback(
    (droppedFiles: any) => {
      setValue('file', droppedFiles, { shouldValidate: true });
      if (mode === 'layout') {
        const resetMargins = DEFAULT_MARGINS;
        setMargins(resetMargins);
        marginsRef.current = resetMargins;
        if (onMarginsChange) {
          onMarginsChange(resetMargins);
        }
      }
    },
    [setValue, mode, onMarginsChange],
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

  const handleDeleteFile = useCallback(() => {
    setValue('file', undefined);
    setPdfPreview?.(undefined);
    setDeleteAssets?.((prev: boolean) => !prev);
    stablePdfUrlRef.current = '';

    if (mode === 'layout') {
      const resetMargins = DEFAULT_MARGINS;
      setMargins(resetMargins);
      marginsRef.current = resetMargins;
      if (onMarginsChange) {
        onMarginsChange(resetMargins);
      }
    }
  }, [setValue, setPdfPreview, setDeleteAssets, mode, onMarginsChange]);

  const getCurrentPdfUrl = useCallback(() => {
    if (mode === 'layout' && pdfPreview?.file) {
      return pdfPreview.file;
    }
    if (assets && assets.length > 0) {
      return assets[assets.length - 1].file;
    }
    return null;
  }, [mode, pdfPreview, assets]);

  const currentPdfUrl = useMemo(() => getCurrentPdfUrl(), [getCurrentPdfUrl]);

  const hasFile = useMemo(() => {
    return mode === 'layout'
      ? pdfPreview ||
          (assets && assets.length > 0) ||
          (files && files.length > 0)
      : files && files.length > 0;
  }, [mode, pdfPreview, assets, files]);

  const showLayoutScaling = useMemo(() => {
    return (
      mode === 'layout' &&
      hasFile &&
      currentPdfUrl &&
      (accept?.['application/pdf'] ||
        (files && files[0]?.type === 'application/pdf') ||
        pdfPreview?.type === 'application/pdf')
    );
  }, [mode, hasFile, currentPdfUrl, accept, files, pdfPreview]);

  const layoutScalingComponent = useMemo(() => {
    if (!showLayoutScaling || !currentPdfUrl) return null;

    return (
      <Box paddingY="sm" mr="xxl">
        <LayoutScaling
          pdfUrl={currentPdfUrl}
          containerWidth={350}
          containerHeight={350}
          initialMargins={margins}
          onMarginsChange={handleMarginsChange}
          pdfDimensions={A4_DIMENSIONS}
          key={`layout-scaling-${currentPdfUrl}`}
        />
      </Box>
    );
  }, [showLayoutScaling, currentPdfUrl, margins, handleMarginsChange]);

  return (
    <Box
      sx={{
        width: '100%',
        borderColor: 'neutral.200',
        borderRadius: '4px',
      }}>
      {showLayoutScaling && (
        <Box
          sx={{
            width: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          {layoutScalingComponent}

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 'xxl',
              gap: 'md',
            }}>
            <Text
              variant="pM"
              sx={{
                fontWeight: 'heading',
                color: '#475569',
                fontSize: '12px',
              }}>
              Replace the Current File with New File
            </Text>
            <Button
              size="md"
              variant="tertiary"
              onClick={(e) => {
                e.preventDefault();
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
          <>
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
          </>
        )}

        {hasFile && !showLayoutScaling && (
          <Flex sx={{ alignItems: 'center' }}>
            <Text variant="pM" sx={{ flexShrink: 0 }}>
              {pdfPreview?.name ||
                (assets && assets.length > 0
                  ? assets[assets.length - 1]?.asset_name
                  : '') ||
                (files && files[0]?.name)}
            </Text>
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
          </Flex>
        )}

        {progress && progress > 0 && !noChange && (
          <Box mt={3}>
            <ProgressBar progress={progress} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dropzone;
