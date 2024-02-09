import React, { useEffect, useState } from 'react';

import Dropzone from '@wraft-ui/Dropzone';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Button, Text } from 'theme-ui';

import { postAPI } from '../utils/models';
import { Asset } from '../utils/types';

interface AssetFormProps {
  onUpload?: any;
  filetype?: 'layout' | 'theme';
  pdfPreview?: string | undefined;
  setPdfPreview?: any;
  setDeleteAssets?: any;
}

type FormValues = {
  file: FileList;
  name?: string;
};

const AssetForm = ({
  onUpload,
  filetype = 'layout',
  pdfPreview,
  setPdfPreview,
  setDeleteAssets,
}: AssetFormProps) => {
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const methods = useForm<FormValues>({ mode: 'onBlur' });

  useEffect(() => {
    methods.handleSubmit(onSubmit)();
  }, [isSubmit]);

  const onAssetUploaded = (data: any) => {
    console.log('uploading asset from AssetForm', data);
    const mData: Asset = data;
    onUpload(mData);
  };

  const onSubmit = async (data: FormValues) => {
    setFileError(null);
    console.log('file: 🔥', data);

    if (!data.file || data.file === undefined || data.file.length < 1) {
      return;
    }

    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append(
      'name',
      data.file[0].name.substring(0, data.file[0].name.lastIndexOf('.')),
    );
    formData.append('type', filetype);

    const assetsRequest = postAPI(`assets`, formData, (progress) => {
      setUploadProgress(progress);
    });

    toast.promise(assetsRequest, {
      loading: 'Loading...',
      success: (data) => {
        onAssetUploaded(data);
        setUploadProgress(0);
        return `Successfully created ${filetype == 'theme' ? 'font' : 'field'}`;
      },
      error: (error) => {
        setUploadProgress(0);
        console.log(error);
        setFileError(
          error.errors.file[0] || error.message || 'There is an error',
        );
        return `Failed to create ${filetype == 'theme' ? 'font' : 'field'}`;
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <Box as="form" onSubmit={methods.handleSubmit(onSubmit)} mt={4}>
        <Box mb={3}>
          <Dropzone
            accept={
              filetype === 'layout'
                ? {
                    'application/pdf': [],
                  }
                : filetype === 'theme'
                  ? {
                      'font/ttf': ['.ttf'],
                      'font/otf': ['.otf'],
                    }
                  : {
                      '*': [],
                    }
            }
            progress={uploadProgress}
            pdfPreview={pdfPreview}
            setPdfPreview={setPdfPreview}
            setIsSubmit={setIsSubmit}
            setDeleteAssets={setDeleteAssets}
          />
          {fileError && (
            <Box sx={{ maxWidth: '300px' }}>
              <Text variant="error">{fileError}</Text>
              <br />
              {filetype == 'theme' && (
                <Text variant="subR">
                  Your font file should follow the naming convention like
                  filename-filetype.ttf . Currenty the supported filetypes are
                  Bold, Regular and Italic. Other filetypes like Light, Black,
                  etc. are not supported as of now.
                </Text>
              )}
            </Box>
          )}
        </Box>
        <Button type="submit" sx={{ display: 'none' }} />
      </Box>
    </FormProvider>
  );
};
export default AssetForm;
