import React, { useState } from "react";
import Dropzone from "react-dropzone-uploader";

import { Box, Button, Flex, Image } from "theme-ui";

import ImageEdit from "./ImageEdit";

const UploaderContext = React.createContext({
  image: null,
  attachImage: (_e: any) => {
    console.log("x", _e);
  },
});

interface LayoutProps {
  input: any;
  previews: any;
  submitButton: any;
  dropzoneProps: any;
  files: any;
  extra: any;
}

const Layout = ({
  input,
  previews,
  submitButton,
  dropzoneProps,
  files,
  extra,
}: LayoutProps) => {
  return (
    <Box
      sx={{
        p: 2,
        border: "dotted 1px",
        borderColor: "pink.8",
        fontFamily: "body",
        bg: "pink.0",
      }}
    >
      <Flex sx={{ flexWrap: "wrap" }}>{previews}</Flex>

      <Box {...dropzoneProps} sx={{ p: 0, m: 0 }}>
        {files.length < extra.maxFiles && input}
      </Box>

      {files.length > 0 && submitButton}
    </Box>
  );
};

interface IPreviewProps {
  meta: any;
}

interface IMetaModel {
  name: string;
  previewUrl: string;
  percent: any;
  status: any;
}

const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

interface ItoggleProps {
  image?: any;
  attachImage?: any;
}

const Preview = ({ meta }: IPreviewProps) => {
  const { previewUrl }: IMetaModel = meta;

  const [prevImage, setPrevImage] = useState<any>(null);
  const [prevImageFile, setPrevImageFile] = useState<File | boolean>(false);
  const [hideUpload, sethHideUpload] = useState<boolean>(false);

  const imageUpdate = (_x: any) => {
    setPrevImageFile(_x);
    getBase64(_x).then((_f: any) => {
      setPrevImage(_f);
      sethHideUpload(true);
    });
  };

  const toggleUpload = ({ attachImage }: ItoggleProps) => {
    // sethHideUpload(!hideUpload);
    prevImage && attachImage({ prevImage, prevImageFile });
  };

  return (
    <Box>
      <UploaderContext.Consumer>
        {(_props: any) => (
          <Box
          // onClick={toggleTheme}
          // style={{ backgroundColor: theme.background }}
          >
            {prevImage && hideUpload && (
              <Image sx={{ maxWidth: "100%" }} src={prevImage} />
            )}

            {previewUrl && !hideUpload && (
              <ImageEdit image={previewUrl} onUpdate={imageUpdate} />
            )}
            {/* <Image sx={{ maxWidth: "100%" }} src={previewUrl} /> */}
            <Button
              variant="small"
              type="button"
              onClick={() => toggleUpload(_props)}
              sx={{ mt: 3 }}
            >
              Save
              {/* {hideUpload ? "Save" : "Change Image"} */}
            </Button>
          </Box>
        )}
      </UploaderContext.Consumer>
    </Box>
  );
};

interface MyUploaderProps {
  parent?: string;
  onComplete?: any;
  onFileSubmit?: any;
}

interface handleChangeStatus {
  meta?: any;
  remove?: any;
  status?: string;
}

interface IattachImage {
  prevImage?: string;
  prevImageFile?: File;
}
const ImageCropper = ({ onFileSubmit }: MyUploaderProps) => {
  const [image, setImage] = useState<File | boolean>(false);
  const [imagePrev, setImagePrev] = useState<string|boolean>(false);

  const attachImage = ({ prevImage, prevImageFile }: IattachImage) => {
    prevImage && setImagePrev(prevImage);
    prevImageFile && setImage(prevImageFile);
    onFileSubmit({ prevImage, prevImageFile });
  };

  const handleChangeStatus = ({ meta, remove, status }: handleChangeStatus) => {
    if (status === "headers_received") {
      console.log(`${meta.name} uploaded!`);
      remove();
    } else if (status === "aborted") {
      console.log(`${meta.name}, upload failed...`);
    }
  };
  const handleSubmit = (_files: any) => {
    // onFileSubmit(parent, files);
  };

  return (
    <React.Fragment>
      <UploaderContext.Provider value={{ image, attachImage }}>
        <Box>
          {imagePrev && <Image src={imagePrev} />}
          {!image && (
            <Dropzone
              // getUploadParams={getUploadParams}
              PreviewComponent={Preview}
              LayoutComponent={Layout}
              onChangeStatus={handleChangeStatus}
              onSubmit={handleSubmit}
              maxFiles={1}
              multiple={false}
              canCancel={true}
              inputContent="Drop A Image"
              styles={{
                dropzone: {
                  width: "100%",
                  height: "auto",
                  border: 0,
                  overflow: "auto",
                },
                dropzoneActive: { borderColor: "green" },
              }}
              accept="image/*"
            />
          )}
        </Box>
      </UploaderContext.Provider>
    </React.Fragment>
  );
};

export default ImageCropper;
