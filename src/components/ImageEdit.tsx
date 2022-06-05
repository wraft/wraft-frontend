import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { Box, Slider, Flex, Button, Image } from 'theme-ui';
import { getCroppedImg } from '../utils/imgCrop';

interface IImageCopperProps {
  image?: any;
  onUpdate: any;
}

// const EmptyArea:Area = {}

const ImageEdit = ({ image, onUpdate }: IImageCopperProps) => {
  const [crop, setCrop] = useState<any>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<any>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [croppedImg, setCroppedImg] = useState<File>();

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    console.log('croppedArea', croppedArea);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, 0);
      console.log('donee', { croppedImage });
      setCroppedImg(croppedImage);
      onUpdate(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, 0]);

  // const onClose = useCallback(() => {
  //   setCroppedImage(undefined);
  // }, []);

  const changeZoom = (_e: any) => {
    console.log('__e', _e);
    setZoom(_e.target.value);
  };

  return (
    <Box
      sx={{
        p: 0,
        width: '100%',
      }}>
      {croppedImg && <Image src={String(croppedImg)} />}
      <Box
        sx={{
          position: 'relative',
          zIndex: 5000,
          minWidth: '100%',
          width: '100%',
          // bg: "black",
          // p: 4,
        }}>
        <Box bg="gray.4">
          {image && (
            <Box
              sx={{
                // bg: "gray.2",
                width: '180px',
                height: '180px',
                minHeight: '100%',
                top: '0%',
                position: 'relative',
                margin: 'auto',
              }}>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </Box>
          )}
        </Box>
        <Flex
          sx={{
            position: 'relative',
            color: 'gray.3',
            p: 3,
            bg: 'gray.1',
            width: '100%',
            borderTop: 'solid 1px',
            borderBottom: 'solid 1px',
            borderColor: 'gray.4',
          }}>
          <Slider
            value={zoom}
            min={1}
            color="primary"
            max={10}
            step={1}
            aria-labelledby="Zoom"
            onChange={(zoom: any) => changeZoom(zoom)}
          />
        </Flex>
      </Box>
      <Flex sx={{ bg: 'gray.1', p: 3 }}>
        <Box sx={{ ml: 'auto' }}>
          <Button
            type="button"
            sx={{
              border: 'solid 1px',
              borderColor: 'gray.4',
              bg: 'background',
              color: 'gray.7',
              mr: 1,
            }}>
            Clear
          </Button>
          <Button type="button" onClick={showCroppedImage}>
            Save
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default ImageEdit;
