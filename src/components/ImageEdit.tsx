import React, { useCallback, useState } from 'react';

import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { Box, Slider, Flex, Button, Image } from 'theme-ui';

import { useAuth } from '../contexts/AuthContext';
import { getCroppedImg } from '../utils/imgCrop';
import { updateEntityFile } from '../utils/models';

interface IImageCopperProps {
  image?: any;
  onUpdate: any;
  hideModal?: boolean;
  onSavable?: any;
}

// const EmptyArea:Area = {}

const ImageEdit = ({ image, onUpdate, onSavable }: IImageCopperProps) => {
  const [crop, setCrop] = useState<any>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<any>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [croppedImg, setCroppedImg] = useState<File>();

  const { accessToken } = useAuth();

  /**
   * Submit profile image individually
   * @param _file Image File
   */
  const submitImage = (_file: any) => {
    const formData = new FormData();
    formData.append('profile_pic', _file);
    updateEntityFile(`profiles`, formData, accessToken as string, onUpdate);
  };

  const onCropComplete = useCallback(
    (
      croppedArea: any,
      croppedAreaPixels: React.SetStateAction<Area | undefined>,
    ): any => {
      setCroppedAreaPixels(croppedAreaPixels);
      console.log('croppedArea', croppedArea);
    },
    [],
  );

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, 0);
      console.log('donee', { croppedImage });
      onSavable(croppedImage);
      setCroppedImg(croppedImage);
      onUpdate(croppedImage);

      // extra
      submitImage(croppedImage);
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
      {croppedImg && <Image alt="" src={String(croppedImg)} />}
      <Box sx={{ px: 3, py: 2 }}>Edit Profile Image</Box>
      <Box
        sx={{
          position: 'relative',
          zIndex: 5000,
          minWidth: '100%',
          width: '100%',
          // bg: "black",
          // p: 4,
        }}>
        <Box>
          {image && (
            <Box
              sx={{
                // bg: "gray.2",
                width: '280px',
                height: '280px',
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
      <Flex sx={{ bg: 'neutral.0', p: 3 }}>
        <Box sx={{ ml: 'auto' }}>
          {/* <Button
            type="button"
            sx={{
              border: 'solid 1px',
              borderColor: 'gray.4',
              bg: 'background',
              color: 'gray.7',
              mr: 1,
            }}>
            Clear
          </Button> */}
          <Button
            variant="btnSecondary"
            sx={{ width: '100%', fontSize: 1 }}
            type="button"
            onClick={showCroppedImage}>
            Done
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default ImageEdit;
