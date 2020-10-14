import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop/types";
import { Box, Slider, Flex, Button, Image } from "theme-ui";
import { getCroppedImg } from "../utils/imgCrop";

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
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        0
      );
      console.log("donee", { croppedImage });
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
    console.log("__e", _e);
    setZoom(_e.target.value);
  };

  return (
    <Box
      sx={
        {
          // width: "400px",
          // height: "100%",
        }
      }
    >
      { croppedImg && <Image src={String(croppedImg)}/> }
      <Box
        sx={{
          position: "relative",
          zIndex: 5000,
          // minWidth: "100%",
          height: "100%",
          // bg: "black",
          // p: 4,
        }}
      >
        <Box
          sx={{
            // position: "fixed",
            left: 0,
            right: 0,
            top: 0,
            bottom: 2,
            zIndex: 8000,
          }}
        >
          {image && (
            <Box
              sx={{
                bg: "white",
                width: "200px",
                height: "200px",
                minHeight: "100%",
                top: "0%",
                position: "relative",
                margin: "auto",
              }}
            >
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
            // zIndex: 10000,
            position: "relative",
            // left: 0,
            // right: 0,
            // bottom: 0,
            p: 0,
            width: '100%',
            bg: "gray.1",
          }}
        >
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(zoom: any) => changeZoom(zoom)}
          />
          <Box sx={{ ml: 1}}>
            <Button type="button" onClick={showCroppedImage}>
              Save
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default ImageEdit;
