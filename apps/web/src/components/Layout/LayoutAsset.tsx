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
import { Box, Flex, Text, Button, InputText } from '@wraft/ui';
import { PDFDocument } from 'pdf-lib';
import toast from 'react-hot-toast';

import LayoutScaling from 'components/Layout/LayoutScaling';
import ProgressBar from 'components/common/ProgressBar';

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

type PdfPreview = {
  name: string;
  file: string;
  type: string;
};

type DropzoneProps = {
  accept?: Accept;
  progress?: number;
  setPdfPreview?: (pdf: PdfPreview) => void;
  setIsSubmit: (value: boolean | ((prev: boolean) => boolean)) => void;
  noChange?: boolean;
  onMarginsChange?: (margins: typeof DEFAULT_MARGINS) => void;
  pdfPreview?: PdfPreview;
  initialMargins?: typeof DEFAULT_MARGINS;
};

// Custom hook for margin management
const useMarginManagement = (
  initialMargins: typeof DEFAULT_MARGINS,
  onMarginsChange?: (margins: typeof DEFAULT_MARGINS) => void,
) => {
  const [editFormMargins, setEditFormMargins] = useState(initialMargins);
  const marginsRef = useRef(initialMargins);
  const isUpdatingMarginsRef = useRef(false);
  const marginsChangeTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isUpdatingMarginsRef.current) {
      marginsRef.current = initialMargins;
      setEditFormMargins(initialMargins);
    }
  }, [initialMargins]);

  const resetMargins = useCallback(() => {
    const resetMargins = DEFAULT_MARGINS;
    setEditFormMargins(resetMargins);
    marginsRef.current = resetMargins;
    if (onMarginsChange) {
      onMarginsChange(resetMargins);
    }
  }, [onMarginsChange]);

  const handleEditFormMarginsChange = useCallback(
    (newMargins: typeof DEFAULT_MARGINS, isReset = false) => {
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
    [onMarginsChange],
  );

  const propagateMarginsToParent = useCallback(() => {
    if (onMarginsChange) {
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

  return {
    editFormMargins,
    resetMargins,
    handleEditFormMarginsChange,
    propagateMarginsToParent,
  };
};

// Utility functions
const convertFileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// New function to validate PDF page count
const validatePdfPageCount = async (file: File): Promise<boolean> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();
    return pageCount === 1;
  } catch (error) {
    console.error('Error validating PDF page count:', error);
    return false;
  }
};

const getFileName = (pdfPreview?: PdfPreview, files?: File[]): string => {
  if (pdfPreview?.name) return pdfPreview.name;
  if (files && files.length > 0) return files[0]?.name || '';
  return '';
};

const getCurrentPdfUrl = (pdfPreview?: PdfPreview): string | null => {
  if (pdfPreview?.file) return pdfPreview.file;
  return null;
};

const isPdfFile = (
  file?: File,
  pdfPreview?: PdfPreview,
  accept?: Accept,
): boolean => {
  return (
    !!accept?.['application/pdf'] ||
    file?.type === 'application/pdf' ||
    pdfPreview?.type === 'application/pdf'
  );
};

const ActionButtons = ({
  onReupload,
  onResetMargins,
}: {
  onReupload: (e: React.MouseEvent) => void;
  onResetMargins: (e: React.MouseEvent) => void;
}) => (
  <Flex gap="md">
    <Button size="md" variant="tertiary" onClick={onReupload}>
      Re-upload file
    </Button>
    <Button size="md" variant="tertiary" onClick={onResetMargins}>
      Reset Margins
    </Button>
  </Flex>
);

const FileUploadArea = ({
  hasFile,
  showLayoutScaling,
  fileName,
  isDragActive,
  getRootProps,
  getInputProps,
  progress,
  noChange,
  validationError,
}: {
  hasFile: boolean;
  showLayoutScaling: boolean;
  fileName: string;
  isDragActive: boolean;
  getRootProps: any;
  getInputProps: any;
  progress?: number;
  noChange?: boolean;
  validationError?: string | null;
}) => (
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
    px="md">
    <InputText type="file" name="file" display="none" {...getInputProps({})} />

    {!hasFile && (
      <>
        <Box
          h="52px"
          w="52px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="4px">
          <CloudUploadIcon width={32} height={32} />
        </Box>
        <Flex flexDirection="column" alignItems="center" mt="12px">
          <Text variant="base" mb={1}>
            Drag & drop or upload PDF file
          </Text>
          <Text variant="xs">
            Single-page PDF files only - Max file size 10MB
          </Text>
        </Flex>
      </>
    )}

    {hasFile && !showLayoutScaling && (
      <Flex alignItems="center">
        <Text variant="base" flexShrink={0}>
          {fileName}
        </Text>
        <Box
          color="green.700"
          ml="12px"
          justifyContent="center"
          alignItems="center"
          display="flex">
          <ApproveTickIcon />
        </Box>
      </Flex>
    )}

    {validationError && (
      <Flex flexDirection="column" alignItems="center" mt="12px">
        <Text variant="sm" color="red.500" textAlign="center">
          {validationError}
        </Text>
      </Flex>
    )}

    {progress && progress > 0 && !noChange && (
      <Box mt={3}>
        <ProgressBar progress={progress} />
      </Box>
    )}
  </Box>
);

const Dropzone = React.forwardRef<any, DropzoneProps>(
  (
    {
      accept,
      progress,
      setPdfPreview,
      setIsSubmit,
      noChange = false,
      onMarginsChange,
      pdfPreview,
      initialMargins = DEFAULT_MARGINS,
    },
    ref,
  ) => {
    const { setValue, watch, register } = useFormContext();
    const files = watch('file');
    const [validationError, setValidationError] = useState<string | null>(null);

    const {
      editFormMargins,
      resetMargins,
      handleEditFormMarginsChange,
      propagateMarginsToParent,
    } = useMarginManagement(initialMargins, onMarginsChange);

    useEffect(() => {
      if (files && files.length > 0) {
        setIsSubmit((prev: boolean) => !prev);
        setValidationError(null);

        const file = files[0];
        if (file && file.type === 'application/pdf') {
          const fileName = file.name;

          if (!pdfPreview || pdfPreview.name !== fileName) {
            validatePdfPageCount(file)
              .then((isSinglePage) => {
                if (isSinglePage) {
                  return convertFileToDataUrl(file);
                } else {
                  const errorMessage =
                    'Only single-page PDF files are supported';
                  setValidationError(errorMessage);
                  toast.error(errorMessage, {
                    duration: 5000,
                    position: 'top-right',
                  });
                  setValue('file', [], { shouldValidate: true });
                  return Promise.reject(
                    new Error('Multi-page PDF not allowed'),
                  );
                }
              })
              .then((dataUrl) => {
                setPdfPreview?.({
                  name: fileName,
                  file: dataUrl,
                  type: file.type,
                });
              })
              .catch((error) => {
                if (error.message !== 'Multi-page PDF not allowed') {
                  console.error('Error processing PDF file:', error);
                  const errorMessage = 'Error processing PDF file';
                  setValidationError(errorMessage);
                  toast.error(errorMessage);
                  setValue('file', [], { shouldValidate: true });
                }
              });
          }
        }
      }
    }, [files, setIsSubmit, setPdfPreview, pdfPreview, setValue]);

    const onDrop = useCallback(
      (droppedFiles: File[]) => {
        const singleFile = droppedFiles.slice(0, 1);
        setValue('file', singleFile, { shouldValidate: true });
        resetMargins();
        setValidationError(null);
      },
      [setValue, resetMargins],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      maxSize: 10 * 1024 * 1024,
      multiple: false,
      accept: accept || { 'application/pdf': ['.pdf'] },
    });

    const types = 'PDF';

    register('file');

    const currentPdfUrl = useMemo(
      () => getCurrentPdfUrl(pdfPreview),
      [pdfPreview],
    );

    const hasFile = useMemo(() => {
      return pdfPreview || (files && files.length > 0);
    }, [pdfPreview, files]);

    const showLayoutScaling = useMemo(() => {
      return (
        hasFile && currentPdfUrl && isPdfFile(files?.[0], pdfPreview, accept)
      );
    }, [hasFile, currentPdfUrl, files, pdfPreview, accept]);

    const fileName = useMemo(
      () => getFileName(pdfPreview, files),
      [pdfPreview, files],
    );

    const layoutScalingComponent = useMemo(() => {
      if (!showLayoutScaling || !currentPdfUrl) return null;

      return (
        <Box as="div" py="sm" mr="xxl">
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

    const handleReupload = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      const inputElement = document.querySelector('input[type="file"]');
      if (inputElement) {
        (inputElement as HTMLElement).click();
      }
    }, []);

    const handleResetMargins = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        resetMargins();
      },
      [resetMargins],
    );

    React.useImperativeHandle(ref, () => ({
      getCurrentMargins: () => editFormMargins,
      propagateMargins: propagateMarginsToParent,
    }));

    return (
      <Box w="100%" borderColor="neutral.200" borderRadius="4px">
        {showLayoutScaling && (
          <Box
            w="100%"
            position="relative"
            display="flex"
            flexDirection="column"
            alignItems="center">
            {layoutScalingComponent}

            <Box
              w="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="xxl"
              gap="md">
              <Text
                variant="base"
                fontWeight="heading"
                color="#475569"
                fontSize="12px">
                Replace the Current PDF with New PDF
              </Text>
              <ActionButtons
                onReupload={handleReupload}
                onResetMargins={handleResetMargins}
              />
            </Box>
          </Box>
        )}

        <FileUploadArea
          hasFile={hasFile}
          showLayoutScaling={showLayoutScaling}
          fileName={fileName}
          isDragActive={isDragActive}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          progress={progress}
          noChange={noChange}
          validationError={validationError}
        />
      </Box>
    );
  },
);

Dropzone.displayName = 'Dropzone';

export default Dropzone;
