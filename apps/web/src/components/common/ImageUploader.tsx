import type { FormEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import styled from '@emotion/styled';
import { Box, InputText, Label, Flex, Text, Button, Modal } from '@wraft/ui';
import { X } from '@phosphor-icons/react';

type FileReaderMethod =
  | 'readAsText'
  | 'readAsDataURL'
  | 'readAsArrayBuffer'
  | 'readAsBinaryString';

type FileReaderHookProps = {
  method: FileReaderMethod;
  onLoad?: (result: unknown) => void;
};

type CropArea = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const MAX_IMAGE_SIZE = 512;

const useFileReader = ({
  method = 'readAsText',
  onLoad,
}: FileReaderHookProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<DOMException | null>(null);
  const [result, setResult] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadstart = () => setIsLoading(true);
    reader.onloadend = () => setIsLoading(false);
    reader.onerror = () => setError(reader.error);
    reader.onload = (e) => {
      const data = e.target?.result ?? null;
      setResult(data);
      if (onLoad) onLoad(data);
    };

    reader[method](file);

    return () => {
      reader.abort();
    };
  }, [file, method, onLoad]);

  return [{ result, error, file, isLoading }, setFile] as const;
};

type ImageUploaderProps = {
  id: string;
  buttonLabel: string;
  onImageChange: (imageSrc: string) => void;
  currentImageSrc?: string;
  targetAlt: string;
  triggerButtonColor?: string;
  uploadInstructions?: string;
  isDisabled?: boolean;
  isModalOpen: boolean;
  onModalClose: () => void;
};

interface FileInputEvent<T = Element> extends FormEvent<T> {
  target: EventTarget & T;
}

const RangeInput = styled(InputText)`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background-color: ${(props: any) => props.theme.colors.primary};
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: -4px;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    // background-color: ${(props: any) => props.theme.colors.primary};
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    background-color: ${(props: any) => props.theme.colors.gray[200]};
    border-radius: 4px;
    border: none;
  }

  &::-moz-range-track {
    width: 100%;
    height: 8px;
    background-color: ${(props: any) => props.theme.colors.gray[200]};
    border-radius: 4px;
    border: none;
  }
`;

const FileUploadBox = styled(Box)`
  border: 2px dashed ${(props: any) => props.theme.colors.gray[500]};
  padding: ${(props: any) => props.theme.space.md};
  margin-bottom: ${(props: any) => props.theme.space.md};
  border-radius: 6px;
  cursor: pointer;
  font-size: ${(props: any) => props.theme.fontSizes.sm};
  font-weight: 500;
  position: relative;
  #avatar-upload {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`;

function ImageCropper({
  onCropComplete,
  imageSrc,
}: {
  imageSrc: string;
  onCropComplete: (croppedAreaPixels: CropArea) => void;
}) {
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZoomLevel(Number(event.target.value));
  };

  return (
    <Box>
      <Box position="relative" w="300px" h="300px">
        <Cropper
          image={imageSrc}
          crop={cropPosition}
          zoom={zoomLevel}
          aspect={1}
          showGrid={true}
          cropShape="round"
          onCropChange={setCropPosition}
          onCropComplete={(_, croppedAreaPixels) =>
            onCropComplete(croppedAreaPixels)
          }
          onZoomChange={setZoomLevel}
          rotation={0}
          minZoom={1}
          maxZoom={10}
          zoomSpeed={1}
          objectFit="contain"
          style={{ containerStyle: { width: '100%', height: '100%' } }}
          classes={{}}
          restrictPosition={true}
          mediaProps={{}}
          cropperProps={{}}
          keyboardStep={1}
        />
      </Box>
      <Box mt="md">
        <Label>Zoom Level</Label>
        <RangeInput
          type="range"
          value={zoomLevel.toString()}
          min="1"
          max="10"
          step="1"
          onChange={handleZoomChange}
          aria-label="Zoom"
        />
      </Box>
    </Box>
  );
}

export default function ImageUploader({
  targetAlt,
  id,
  onImageChange,
  currentImageSrc,
  isModalOpen,
  onModalClose,
}: ImageUploaderProps) {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null,
  );

  const [{ result }, setFile] = useFileReader({
    method: 'readAsDataURL',
  });

  const handleFileInput = (e: FileInputEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }

    const maxFileSize = 5 * 1024 * 1024; // 5MB limit
    const file = e.target.files[0];

    if (file.size > maxFileSize) {
      // TODO: Add proper error handling
      console.error('File size exceeds 5MB limit');
    } else {
      setFile(file);
    }
  };

  const handleCroppedImage = useCallback(
    async (areaPixels: CropArea | null) => {
      try {
        if (!areaPixels) return;
        const croppedImage = await getCroppedImg(result as string, areaPixels);
        onImageChange(croppedImage);
      } catch (error) {
        console.error('Error cropping image:', error);
      }
    },
    [result, onImageChange],
  );

  return (
    <Modal ariaLabel="Change Avatar" open={isModalOpen} onClose={onModalClose}>
      <>
        <Flex justify="end">
          <X size={20} weight="bold" cursor="pointer" onClick={onModalClose} />
        </Flex>
        <Box>
          {!result && (
            <Flex
              justifyContent="center"
              alignItems="center"
              borderRadius="99rem"
              overflow="hidden"
              w="240px"
              h="240px">
              {currentImageSrc ? (
                <Image
                  src={currentImageSrc}
                  alt={targetAlt}
                  width={240}
                  height={240}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '99rem',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Text variant="sm">No image selected</Text>
              )}
            </Flex>
          )}

          {result && (
            <ImageCropper
              imageSrc={result as string}
              onCropComplete={setCroppedAreaPixels}
            />
          )}

          <Box py="md">
            <FileUploadBox data-testid="open-upload-image-filechooser">
              <InputText
                type="file"
                name={id}
                onChange={handleFileInput}
                accept="image/*"
              />
              Click and choose an Image
            </FileUploadBox>

            <Button
              variant="primary"
              onClick={() => handleCroppedImage(croppedAreaPixels)}>
              Save
            </Button>
          </Box>
        </Box>
      </>
    </Modal>
  );
}

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error: any) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CropArea,
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Context is null, this should never happen.');

  const maxSize = Math.max(image.naturalWidth, image.naturalHeight);
  const resizeRatio =
    MAX_IMAGE_SIZE / maxSize < 1 ? Math.max(MAX_IMAGE_SIZE / maxSize, 0.75) : 1;
  // huh, what? - Having this turned off actually improves image quality as otherwise anti-aliasing is applied
  // this reduces the quality of the image overall because it anti-aliases the existing, copied image; blur results
  ctx.imageSmoothingEnabled = false;
  // pixelCrop is always 1:1 - width = height
  canvas.width = canvas.height = Math.min(
    maxSize * resizeRatio,
    pixelCrop.width,
  );

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  // on very low ratios, the quality of the resize becomes awful. For this reason the resizeRatio is limited to 0.75
  if (resizeRatio <= 0.75) {
    // With a smaller image, thus improved ratio. Keep doing this until the resizeRatio > 0.75.
    return getCroppedImg(canvas.toDataURL('image/png'), {
      width: canvas.width,
      height: canvas.height,
      x: 0,
      y: 0,
    });
  }

  return canvas.toDataURL('image/png');
}
