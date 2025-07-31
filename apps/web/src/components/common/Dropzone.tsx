import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { ApproveTickIcon, CloudUploadIcon } from '@wraft/icon';
import { Accept, useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Box, Flex, Input, Text } from 'theme-ui';
import { Button } from '@wraft/ui';

import LayoutScaling from 'components/Layout/LayoutScaling';
import { Asset } from 'utils/types';

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
  assets?: Asset[];
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

const Dropzone = React.forwardRef<any, DropzoneProps>(
  (
    {
      accept,
      progress,
      assets,
      setPdfPreview,
      setIsSubmit,
      multiple = false,
      noChange = false,
      onMarginsChange,
      pdfPreview,
      mode = 'layout',
      initialMargins = DEFAULT_MARGINS,
    },
    ref,
  ) => {
    const { setValue, watch, register } = useFormContext();
    const [editFormMargins, setEditFormMargins] = useState(initialMargins);
    const files = watch('file');
    const stablePdfUrlRef = useRef<string>('');
    const marginsRef = useRef(initialMargins);
    const isUpdatingMarginsRef = useRef(false);

    useEffect(() => {
      if (!isUpdatingMarginsRef.current) {
        marginsRef.current = initialMargins;
        setEditFormMargins(initialMargins);
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
    const handleEditFormMarginsChange = useCallback(
      (newMargins: typeof DEFAULT_MARGINS, isReset = false) => {
        console.log(
          'Dropzone (Edit Form): Internal margins changing to:',
          newMargins,
        );

        isUpdatingMarginsRef.current = true;
        setEditFormMargins(newMargins);
        marginsRef.current = newMargins;

        if (marginsChangeTimeoutRef.current) {
          clearTimeout(marginsChangeTimeoutRef.current);
        }

        if (isReset && onMarginsChange) {
          onMarginsChange(newMargins);
        }

        marginsChangeTimeoutRef.current = setTimeout(() => {
          isUpdatingMarginsRef.current = false;
        }, 150);
      },
      [],
    );

    const propagateMarginsToParent = useCallback(() => {
      if (onMarginsChange) {
        console.log(
          'Dropzone: Propagating final margins to parent:',
          editFormMargins,
        );
        onMarginsChange(editFormMargins);
      }
    }, [onMarginsChange, editFormMargins]);

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
          setEditFormMargins(resetMargins);
          marginsRef.current = resetMargins;
        }
      },
      [setValue, mode],
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
            initialMargins={editFormMargins}
            onMarginsChange={handleEditFormMarginsChange}
            pdfDimensions={A4_DIMENSIONS}
            key={`edit-form-scaling-${currentPdfUrl}`}
          />
        </Box>
      );
    }, [
      showLayoutScaling,
      currentPdfUrl,
      editFormMargins,
      handleEditFormMarginsChange,
    ]);

    React.useImperativeHandle(ref, () => ({
      getCurrentMargins: () => editFormMargins,
      propagateMargins: propagateMarginsToParent,
    }));

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
              <Flex sx={{ gap: 'md' }}>
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
                <Button
                  size="md"
                  variant="tertiary"
                  onClick={(e) => {
                    e.preventDefault();
                    const resetMargins = DEFAULT_MARGINS;
                    setEditFormMargins(resetMargins);
                    marginsRef.current = resetMargins;
                    if (onMarginsChange) {
                      onMarginsChange(resetMargins);
                    }
                  }}>
                  Reset Margins
                </Button>
              </Flex>
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
                <Text variant="capM">
                  {types || 'All'} - Max file size 10MB
                </Text>
              </Flex>
            </>
          )}

          {hasFile && !showLayoutScaling && (
            <Flex sx={{ alignItems: 'center' }}>
              <Text variant="pM" sx={{ flexShrink: 0 }}>
                {pdfPreview?.name ||
                  (assets && assets.length > 0
                    ? assets[assets.length - 1]?.name
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
  },
);

Dropzone.displayName = 'Dropzone';

export default Dropzone;
