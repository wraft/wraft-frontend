/** @jsxImportSource theme-ui */
import type { FormEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Box, Input, Label, Slider } from 'theme-ui';
import { Button, Modal } from '@wraft/ui';

type ReadAsMethod =
  | 'readAsText'
  | 'readAsDataURL'
  | 'readAsArrayBuffer'
  | 'readAsBinaryString';

type UseFileReaderProps = {
  method: ReadAsMethod;
  onLoad?: (result: unknown) => void;
};

type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const MAX_IMAGE_SIZE = 512;

const useFileReader = (options: UseFileReaderProps) => {
  const { method = 'readAsText', onLoad } = options;
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<DOMException | null>(null);
  const [result, setResult] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    if (!file && result) {
      setResult(null);
    }
  }, [file, result]);

  useEffect(() => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => setLoading(true);
    reader.onloadend = () => setLoading(false);
    reader.onerror = () => setError(reader.error);

    reader.onload = (e: ProgressEvent<FileReader>) => {
      setResult(e.target?.result ?? null);
      if (onLoad) {
        onLoad(e.target?.result ?? null);
      }
    };
    reader[method](file);
  }, [file, method, onLoad]);

  return [{ result, error, file, loading }, setFile] as const;
};

type ImageUploaderProps = {
  id: string;
  buttonMsg: string;
  handleAvatarChange: (imageSrc: string) => void;
  imageSrc?: string;
  target: string;
  triggerButtonColor?: string;
  uploadInstruction?: string;
  disabled?: boolean;
  showModal: boolean;
  onClose: (e: any) => void;
};

interface FileEvent<T = Element> extends FormEvent<T> {
  target: EventTarget & T;
}

// This is separate to prevent loading the component until file upload
function CropContainer({
  onCropComplete,
  imageSrc,
}: {
  imageSrc: string;
  onCropComplete: (croppedAreaPixels: Area) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const changeZoom = (_e: any) => {
    setZoom(_e.target.value);
  };

  return (
    <Box>
      <Box sx={{ position: 'relative', width: '300px', height: '300px' }}>
        {/* @ts-expect-error overload  */}
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          showGrid={true}
          cropShape="round"
          onCropChange={setCrop}
          // @ts-expect-error unused vars
          onCropComplete={(croppedArea, croppedAreaPixels) =>
            onCropComplete(croppedAreaPixels)
          }
          onZoomChange={setZoom}
        />
      </Box>
      <Box sx={{ pb: 4, pl: 4, pr: 4 }}>
        <Slider
          value={zoom}
          min={1}
          color="primary"
          max={10}
          step={1}
          sx={{ bg: 'green.100' }}
          aria-labelledby="Zoom"
          onChange={changeZoom}
        />
      </Box>
    </Box>
  );
}

export default function ImageUploader({
  target,
  id,
  handleAvatarChange,
  imageSrc,
  showModal,
  //   onClose,
}: ImageUploaderProps) {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [{ result }, setFile] = useFileReader({
    method: 'readAsDataURL',
  });

  const onInputFile = (e: FileEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }

    const limit = 5 * 1000000; // max limit 5mb
    const file = e.target.files[0];

    if (file.size > limit) {
      // showToast(t("image_size_limit_exceed"), "error");
    } else {
      setFile(file);
    }
  };

  const showCroppedImage = useCallback(
    async (areaPixels: Area | null) => {
      try {
        if (!areaPixels) return;
        const croppedImage = await getCroppedImg(
          result as string /* result is always string when using readAsDataUrl */,
          areaPixels,
        );
        handleAvatarChange(croppedImage);
      } catch (e) {
        console.error(e);
      }
    },
    [result, handleAvatarChange],
  );

  return (
    <Modal ariaLabel="Change Avatar" open={showModal}>
      <Box>
        {!result && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderRadius: '99rem',
              overflow: 'hidden',
              width: '240px',
              height: '240px',
              img: {
                width: '100%',
                height: '100%',
                padding: '1.5rem',
                borderRadius: '99rem',
              },
              '.x': {
                pb: 1,
                pl: 1,
                pr: 1,
                pt: 2,
              },
              // width: '5rem',
              // height: '5rem',
              // maxHeight: '5rem',
            }}>
            {!imageSrc ? (
              <Box
                as="p"
                sx={{
                  width: '100%',
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  textAlign: 'center',
                  '@media (min-width: 640px)': {
                    fontSize: '0.75rem',
                    lineHeight: '1rem',
                  },
                }}></Box>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                // sx={{ borderRadius: '9999px', width: '5rem', height: '5rem' }}
                src={imageSrc}
                alt={target}
              />
            )}
          </Box>
        )}
        {result && (
          <Box>
            <CropContainer
              imageSrc={result as string}
              onCropComplete={setCroppedAreaPixels}
            />
          </Box>
        )}

        <Box sx={{ pb: 4, pl: 4, pr: 4 }}>
          <Label
            data-testid="open-upload-image-filechooser"
            sx={{
              px: 3,
              py: 2,
              marginTop: 2,
              //   borderRadius: '0.125rem',
              borderWidth: '1px',
              fontSize: 'sm',
              lineHeight: ['1rem', '1rem'],
              fontWeight: 500,
              border: 'dotted 2px #eee',
              borderColor: 'gray.500',
              borderRadius: '6px',
              mb: 2,
              bg: 'green.100',
              cursor: 'pointer',
              ':hover': {},
            }}>
            <Input
              onInput={onInputFile}
              type="file"
              name={id}
              placeholder="Upload Image"
              sx={{
                position: 'absolute',
                marginTop: '1rem',
                pointerEvents: 'none',
                opacity: 0,
                l: 0,
                r: 0,
              }}
              accept="image/*"
            />
            Choose a Image
          </Label>

          <Button
            type="submit"
            onClick={() => showCroppedImage(croppedAreaPixels)}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error: any) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
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
