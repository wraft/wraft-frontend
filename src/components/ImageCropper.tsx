/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone-uploader';

import { Box, Button, Flex, Input, Image, Label } from 'theme-ui';

// import { getDroppedOrSelectedFiles } from 'html5-file-selector';
import { fromEvent } from 'file-selector';

import ImageEdit from './ImageEdit';

// const UploaderContext = React.createContext({
//   state: "start",
//   attachImage: (_e: any) => {
//     console.log('x', _e);
//   },
//   setState: (_e: any) => {

//   }
// });

export const UploaderContext = React.createContext({
  statex: 'start',
  attachImage: (_p: any) => {},
  setState: (_state: string) => {},
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
  // submitButton,
  dropzoneProps,
  files,
  extra,
}: LayoutProps) => {
  return (
    <Box
      sx={{
        // mt: 3,
        // ml: 3,
        p: 0,
        border: 0,
        boxShadow: 'none',
        // border: "solid 1px",
        // borderRadius: 3,
        // borderColor: "gray.3",
        // fontFamily: "body",
        // bg: "green",
      }}>
      <Flex sx={{ flexWrap: 'wrap', border: 0 }}>{previews}</Flex>

      <Box {...dropzoneProps} sx={{ p: 0, m: 0 }}>
        {files.length < extra.maxFiles && input}
      </Box>

      {/* {files.length > 0 && submitButton} */}
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
    reader.onerror = error => reject(error);
  });
};

interface ItoggleProps {
  image?: any;
  attachImage?: any;
}

const Preview = ({ meta }: IPreviewProps) => {
  const { previewUrl }: IMetaModel = meta;

  const [prevImage, setPrevImage] = useState<any>(null);
  const [prevImageFile, setPrevImageFile] = useState<File>();
  const [hideUpload, sethHideUpload] = useState<boolean>(false);

  // 1. cropped
  const [crop, setCrop] = useState<string>('start');

  const { attachImage, setState } = useContext(UploaderContext);

  const imageUpdate = (_x: any) => {
    setPrevImageFile(_x);
    getBase64(_x).then((_f: any) => {
      setCrop('preview');
      setState('preview');
      setPrevImage(_f);
      sethHideUpload(true);
    });
  };

  const toggleUpload = ({ attachImage }: ItoggleProps) => {
    // sethHideUpload(!hideUpload);
    prevImage && attachImage({ prevImage, prevImageFile });
  };

  useEffect(() => {
    console.log('crop', crop);
    if (crop === 'preview' && prevImage) {
      setState('cropped');
      console.log(
        'prevImage_prevImageFile',
        prevImage.length,
        prevImage,
        prevImageFile,
      );
      prevImage && attachImage({ prevImage, prevImageFile });
    }
  }, [crop, prevImage]);

  useEffect(() => {
    console.log('crop action', prevImage);
    if (crop === 'preview' && prevImage) {
      setState('three');
      console.log('[3] three', prevImage, prevImageFile);
      if (prevImage && prevImageFile) {
        attachImage({ prevImage, prevImageFile });
      }
    }
  }, [prevImage, hideUpload]);

  return (
    <>
      <UploaderContext.Consumer>
        {(_props: any) => (
          <Box   
          sx={{ width: '100%', p: 0 }}         
            // onClick={toggleTheme}
            // style={{ backgroundColor: theme.background }}
          >
            {prevImage && hideUpload && (
              <>
                <Image sx={{ maxWidth: '100%', p: 0 }} src={prevImage} />
                <Button onClick={() => toggleUpload(_props)}>Save</Button>
              </>
            )}

            {previewUrl && !hideUpload && (
              <Box sx={{ width: '100%', p: 0 }}>
                <ImageEdit image={previewUrl} onUpdate={imageUpdate} />
              </Box>
            )}

            {/* <Image sx={{ maxWidth: "100%" }} src={previewUrl} /> */}
          </Box>
        )}
      </UploaderContext.Consumer>
    </>
  );
};

interface IInputBox {
  accept?: any;
  onFiles?: any;
  files?: any;
  getFilesFromEvent?: any;
}

export const InputBox = ({ accept, onFiles, files, getFilesFromEvent }:IInputBox) => {
  const text = files.length > 0 ? 'Add more files' : 'Upload Profile Image';

  return (
    <Label
      sx={{
        bg: 'white',
        color: 'primary',
        cursor: 'pointer',
        border: 'dotted 2px',
        borderRadius: 4,
        borderColor: 'primary',
        p: 3,
        // width: '30%',
      }}>
      {text}
      <Input
        style={{ display: 'none' }}
        type="file"
        accept={accept}
        multiple
        onChange={e => {
          getFilesFromEvent(e).then((chosenFiles: any) => {
            onFiles(chosenFiles);
          });
        }}
      />
    </Label>
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

const ImageCropper = ({ onFileSubmit, onComplete }: MyUploaderProps) => {
  const [image, setImage] = useState<File | boolean>(false);
  const [imagePrev, setImagePrev] = useState<string | boolean>(false);

  const [state, setState] = useState<string>('one');

  const attachImage = ({ prevImage, prevImageFile }: IattachImage) => {
    // console.log('XXX', prevImage)

    prevImage && setImagePrev(prevImage);
    prevImageFile && setImage(prevImageFile);
    onFileSubmit({ prevImage, prevImageFile });
  };

  // doHide

  useEffect(() => {
    if (state == 'three') {
      onComplete(imagePrev);
    }
  }, [state]);

  const handleChangeStatus = ({ meta, remove, status }: handleChangeStatus) => {
    setState('two');
    if (status === 'headers_received') {
      console.log(`${meta.name} uploaded!`);
      remove();
    } else if (status === 'aborted') {
      console.log(`${meta.name}, upload failed...`);
    }
  };

  const handleSubmit = (_files: any) => {
    // onFileSubmit(parent, files);
  };

  // const getFilesFromEvent = e => {
  //   return new Promise(resolve => {
  //     getDroppedOrSelectedFiles(e).then(chosenFiles => {
  //       resolve(chosenFiles.map(f => f.fileObject));
  //     });
  //   });
  // };

  const getFilesFromEvent = (e: any) => {
    return new Promise<any>((resolve: any) => {
      fromEvent(e).then((chosenFiles: any) => {
        console.log('chosenFiles', chosenFiles);
        resolve(chosenFiles.map((f: any) => f));
      });
    });
  };

  return (
    <React.Fragment>
      <UploaderContext.Provider
        value={{ attachImage, statex: state, setState }}>
        <Box sx={{ p: 0}}>
          {!image && (
            <Dropzone
              // getUploadParams={getUploadParams}
              PreviewComponent={Preview}
              LayoutComponent={Layout}
              InputComponent={InputBox}
              onChangeStatus={handleChangeStatus}
              onSubmit={handleSubmit}
              getFilesFromEvent={getFilesFromEvent}
              maxFiles={1}
              multiple={false}
              canCancel={true}
              inputContent="Drop A Image"
              styles={{
                dropzone: {
                  width: 'auto',
                  height: 'auto',
                  overflow: 'auto',
                },
                dropzoneActive: { border: 0 },
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
