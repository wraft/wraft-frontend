'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Box } from 'common/Box';
import { postAPI } from 'utils/models';
import { Asset } from 'utils/types';

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
    return (
      // sx={{ color: 'red.700', bg: 'red.100', fontSize: 'sm', mt: 3 }}
      <Box>{fileError}</Box>
    );
  }
  return (
    // sx={{ color: 'red.700', bg: 'red.100', fontSize: 'sm', mt: 3 }}
    <Box>Uploaded file is not a valid zip file.</Box>
  );
};

// const HandleTemplate = () => {
const HandleTemplate = ({ onUpload, assets }: HandleTemplateProps) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const setDeleteAssets = () => {};
  const methods = useForm<FormValues>({ mode: 'onBlur' });

  const [fileError, setFileError] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [_filesList, setFilesList] = useState<any>();

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
  const createTemplateAsset = (f: File, idx: number) => {
    const updatedFiles = [
      {
        ...f,
        name: f.name,
        progress: null,
        success: null,
      },
    ];
    setFilesList(updatedFiles);

    const formData = new FormData();
    formData.append('zip_file', f);
    formData.append('name', f.name.substring(0, f.name.lastIndexOf('.')));

    postAPI(`template_assets`, formData, (progress) => {
      setUploadProgress(progress);
      setFilesList((prev: any) => [
        ...prev.slice(0, idx),
        { ...prev[idx], progress: progress },
        ...prev.slice(idx + 1),
      ]);
    })
      .then((res) => {
        onAssetUploaded(res);
        setUploadProgress(0);
        setFilesList((prev: any) => [
          ...prev.slice(0, idx),
          { ...prev[idx], success: true, progress: null },
          ...prev.slice(idx + 1),
        ]);
      })
      .catch((error: any) => {
        setUploadProgress(0);
        setFileError(error.errors || error.message || 'There is an error');
        setFilesList((prev: any) => [
          ...prev.slice(0, idx),
          { ...prev[idx], success: false, progress: null },
          ...prev.slice(idx + 1),
        ]);
      });
  };
  /**
   * When files are dropped
   * @param data
   * @returns
   */

  const onDropped = (files: File[]) => {
    const formData = new FormData();
    const f: File = files[0];
    formData.append('zip_file', files[0]);
    formData.append('name', 'Bol');
    createTemplateAsset(f, 0);
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

    const updatedFiles = files.map((f: any) => ({
      ...f,
      name: f.name,
      progress: null,
      success: null,
    }));

    setFilesList(updatedFiles);
    files.map((f: File, index: number) => {
      createTemplateAsset(f, index);
    });
  };

  useEffect(() => {
    methods.handleSubmit(onSubmit)();
  }, [isSubmit]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box>
          <FileDropzone
            accept={{
              'application/zip': ['.zip'],
              'application/x-zip': ['.zip'],
              'application/x-zip-compressed': ['.zip'],
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
      </form>
    </FormProvider>
  );
};

export default HandleTemplate;
