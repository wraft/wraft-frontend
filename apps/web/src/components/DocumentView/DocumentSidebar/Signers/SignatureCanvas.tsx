import { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Box, Button, Flex, Text, Tab, useTab } from '@wraft/ui';
import { CloudArrowUp, Check } from '@phosphor-icons/react';
import { useDropzone } from 'react-dropzone';

type ExtendedSignatureCanvas = SignatureCanvas & {
  getCanvas: () => HTMLCanvasElement;
};

interface SignatureCanvasProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const CANVAS_DIMENSIONS = {
  width: 800,
  height: 300,
  aspectRatio: '800/300',
};

const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
const displayWidth = CANVAS_DIMENSIONS.width;
const displayHeight = CANVAS_DIMENSIONS.height;
const scaledWidth = displayWidth * dpr;
const scaledHeight = displayHeight * dpr;

export const SignatureCanvasComponent = ({
  onSave,
  onCancel,
  loading = false,
}: SignatureCanvasProps) => {
  const signatureCanvasRef = useRef<ExtendedSignatureCanvas | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const tabStore = useTab({ defaultSelectedId: 'draw' });

  useEffect(() => {
    if (signatureCanvasRef.current) {
      const canvas = signatureCanvasRef.current.getCanvas();
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.setTransform(1, 0, 0, 1, 0, 0);
          context.scale(dpr, dpr);
        }
      }
    }
  }, [dpr]);

  const handleFileDrop = (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];
    setUploadedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);

    simulateUploadProgress();
  };

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      setUploadProgress(Math.min(progress, 1));

      if (progress >= 1) {
        clearInterval(interval);
        setIsUploadComplete(true);
      }
    }, 100);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileDrop,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  const clearSignature = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
      setHasSignature(false);
    }
  };

  const handleSignatureSave = () => {
    if (!signatureCanvasRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_DIMENSIONS.width;
    canvas.height = CANVAS_DIMENSIONS.height;

    const context = canvas.getContext('2d');
    if (!context) return;

    const signatureDataUrl = signatureCanvasRef.current.toDataURL();
    const signatureImage = new Image();

    signatureImage.onload = () => {
      context.clearRect(
        0,
        0,
        CANVAS_DIMENSIONS.width,
        CANVAS_DIMENSIONS.height,
      );
      context.drawImage(
        signatureImage,
        0,
        0,
        CANVAS_DIMENSIONS.width,
        CANVAS_DIMENSIONS.height,
      );
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      onSave(dataUrl);
    };

    signatureImage.src = signatureDataUrl;
  };

  const handleFileUpload = () => {
    if (previewUrl) {
      onSave(previewUrl);
    }
  };

  const resetFileUpload = () => {
    setUploadedFile(null);
    setPreviewUrl('');
    setUploadProgress(0);
    setIsUploadComplete(false);
  };

  return (
    <Box>
      <Tab.List store={tabStore}>
        <Tab id="draw" store={tabStore}>
          Draw
        </Tab>
        <Tab id="upload" store={tabStore}>
          Upload
        </Tab>
      </Tab.List>

      <Tab.Panel store={tabStore} tabId="draw">
        <Box py="md">
          <Box flexDirection="column" background="white" borderRadius="sm">
            <SignatureCanvas
              ref={signatureCanvasRef}
              penColor="black"
              velocityFilterWeight={0.3}
              minWidth={1 * dpr}
              maxWidth={2 * dpr}
              dotSize={1.5 * dpr}
              canvasProps={{
                width: scaledWidth,
                height: scaledHeight,
                style: {
                  border: '1px solid #ddd',
                  background: 'white',
                  touchAction: 'none',
                  cursor: 'crosshair',
                  display: 'block',
                  width: `${displayWidth}px`,
                  height: `${displayHeight}px`,
                  aspectRatio: CANVAS_DIMENSIONS.aspectRatio,
                },
              }}
              onEnd={() => setHasSignature(true)}
            />
          </Box>

          <Box>
            <Text color="text-secondary" my="md">
              Draw your signature above. You can clear and redraw if needed.
            </Text>

            <Flex justifyContent="space-between" mt="xxl">
              <Box>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={clearSignature}
                  disabled={loading}>
                  Clear
                </Button>
              </Box>
              <Flex gap="sm" direction="row">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onCancel}
                  disabled={loading}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSignatureSave}
                  disabled={!hasSignature || loading}
                  loading={loading}>
                  Accept and sign
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Tab.Panel>
      <Tab.Panel store={tabStore} tabId="upload">
        <Box py="sm" w="500px">
          <Box w="100%" border="1px dashed" borderRadius="sm">
            <Box
              {...getRootProps()}
              w="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              borderRadius="sm"
              h="100%"
              py="lg"
              px="sm"
              style={{ pointerEvents: loading ? 'none' : 'auto' }}>
              <input {...getInputProps()} disabled={loading} />

              {!uploadedFile && (
                <>
                  <Box
                    h="xl"
                    w="xl"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="sm">
                    <CloudArrowUp size={32} />
                  </Box>
                  <Flex flexDirection="column" alignItems="center" mt="md">
                    <Text mb="sm">Drag & drop or upload signature file</Text>
                    <Text>PNG, JPG - Max file size 1MB</Text>
                  </Flex>
                </>
              )}

              {uploadedFile && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between">
                  <Flex alignItems="center">
                    <Text>{uploadedFile.name}</Text>
                    {isUploadComplete && (
                      <Box
                        h="lg"
                        w="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg="green"
                        borderRadius="4xl"
                        ml="xss">
                        <Check color="white" height={12} width={12} />
                      </Box>
                    )}
                  </Flex>
                  <Button
                    variant="tertiary"
                    onClick={resetFileUpload}
                    disabled={loading}>
                    Re-upload
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          <Flex justifyContent="space-between" mt="3xl">
            <Button
              variant="secondary"
              size="sm"
              onClick={onCancel}
              disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleFileUpload}
              disabled={!previewUrl || loading}
              loading={loading}>
              Insert Signature
            </Button>
          </Flex>
        </Box>
      </Tab.Panel>
    </Box>
  );
};
