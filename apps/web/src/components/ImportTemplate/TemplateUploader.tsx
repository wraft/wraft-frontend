'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box } from '@wraft/ui';

import { postAPI } from 'utils/models';
import { Asset } from 'utils/types';

import { Alert } from './Alert';
import FileDropzone from './FileDropzone';

type FormValues = {
  zip_file: FileList;
  name?: string;
};

interface HandleTemplateProps {
  onUpload?: any;
  filetype?: 'template_asset';
  assets?: Asset[];
  setPdfPreview?: any;
  setDeleteAssets?: any;
  onDrop?: any;
  formDate?: any;
}
///
interface ErrorComponentProps {
  fileError?: any;
}
/**
 * Handle Errors
 * @param param0
 * @returns
 */
const ErrorComponent = ({ fileError }: ErrorComponentProps) => {
  if (typeof fileError === 'string') {
    return <Alert variant="error">{fileError}</Alert>;
  }
  return <Alert variant="error">Uploaded file is not a valid zip file.</Alert>;
};

const HandleTemplate = ({
  onUpload,
  assets,
  formDate,
}: HandleTemplateProps) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const setDeleteAssets = () => {};
  const methods = useForm<FormValues>({ mode: 'onBlur' });

  const [fileError, setFileError] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  /**
   * When upload is completed
   * @param data
   */
  const onAssetUploaded = (data: any) => {
    const mData: Asset = data;

    onUpload(mData);
  };

  /**
   * Create Template Asset
   */
  const createTemplateAsset = (f: File) => {
    const formData = new FormData();
    formData.append('file', f);
    formData.append('name', f.name.substring(0, f.name.lastIndexOf('.')));

    formDate(formData);
    postAPI(`global_asset/pre_import`, formData, (progress) => {
      setUploadProgress(progress);
    })
      .then((res) => {
        onAssetUploaded(res);
        setUploadProgress(0);
      })
      .catch((error: any) => {
        setUploadProgress(0);
        setFileError(error.errors || error.message || 'There is an error');
      });
  };
  /**
   * When files are dropped
   * @param data
   * @returns
   */

  const onDropped = (files: File[]) => {
    if (files.length === 0) {
      setFileError('There is an error');
      return;
    }

    const formData = new FormData();
    const file: File = files[0];
    formData.append('zip_file', files[0]);
    formData.append('name', 'Bol');
    createTemplateAsset(file);
  };

  const onSubmit = async (data: FormValues) => {
    setFileError(null);

    if (
      !data.zip_file ||
      data.zip_file === undefined ||
      data.zip_file.length < 1
    ) {
      return;
    }
    const files = Array.from(data.zip_file);

    files.map((f: File) => {
      createTemplateAsset(f);
    });
  };

  useEffect(() => {
    methods.handleSubmit(onSubmit)();
  }, [isSubmit]);

  return (
    <FormProvider {...methods}>
      <Box as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <Box>
          <FileDropzone
            accept={{
              'application/zip': ['.zip'],
              'application/x-zip': ['.zip'],
              'application/x-zip-compressed': ['.zip'],
              'application/octet-stream': ['.zip'],
            }}
            onDropped={onDropped}
            progress={uploadProgress}
            assets={assets}
            setIsSubmit={setIsSubmit}
            setDeleteAssets={setDeleteAssets}
            multiple={false}
            noChange={false}
          />
        </Box>
        {assets && assets.length > 0 && (
          <ErrorComponent fileError={fileError} />
        )}
      </Box>
    </FormProvider>
  );
};

export default HandleTemplate;
