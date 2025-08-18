import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Text } from '@wraft/ui';

import FontList from 'components/Theme/FontList';
import Dropzone from 'common/Dropzone';
import { postAPI } from 'utils/models';
import { Asset } from 'utils/types';

interface AssetFormProps {
  onUpload?: any;
  filetype?: 'layout' | 'theme';
  assets?: Asset[];
  setPdfPreview?: any;
  setDeleteAssets?: any;
}

type FormValues = {
  file: FileList;
  name?: string;
};

interface UploadingFile {
  name: string;
  progress: number | null;
  success: boolean | null;
}

const AssetForm = ({
  onUpload,
  filetype = 'layout',
  assets,
  setDeleteAssets,
}: AssetFormProps) => {
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [currentUploadProgress, setCurrentUploadProgress] = useState<number>(0);
  const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>();

  const methods = useForm<FormValues>({ mode: 'onBlur' });

  useEffect(() => {
    methods.handleSubmit(handleFormSubmit)();
  }, [shouldSubmit]);

  const handleSuccessfulUpload = (uploadedAsset: any) => {
    const assetData: Asset = uploadedAsset;
    onUpload(assetData);
  };

  const handleFormSubmit = async (formData: FormValues) => {
    setUploadError(null);

    if (
      !formData.file ||
      formData.file === undefined ||
      formData.file.length < 1
    ) {
      return;
    }
    const selectedFiles = Array.from(formData.file);

    const filesWithUploadState = selectedFiles.map((file: any) => ({
      ...file,
      name: file.name,
      progress: null,
      success: null,
    }));
    setUploadingFiles(filesWithUploadState);

    selectedFiles.map((file: any, fileIndex: number) => {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append(
        'name',
        file.name.substring(0, file.name.lastIndexOf('.')),
      );
      uploadFormData.append('type', filetype);

      postAPI(`assets`, uploadFormData, (progress) => {
        setCurrentUploadProgress(progress);
        setUploadingFiles((previousFiles: any) => [
          ...previousFiles.slice(0, fileIndex),
          { ...previousFiles[fileIndex], progress: progress },
          ...previousFiles.slice(fileIndex + 1),
        ]);
      })
        .then((response) => {
          handleSuccessfulUpload(response);
          setCurrentUploadProgress(0);
          setUploadingFiles((previousFiles: any) => [
            ...previousFiles.slice(0, fileIndex),
            { ...previousFiles[fileIndex], success: true, progress: null },
            ...previousFiles.slice(fileIndex + 1),
          ]);
        })
        .catch((error: any) => {
          setCurrentUploadProgress(0);
          setUploadError(
            error.errors.file[0] || error.message || 'There is an error',
          );
          setUploadingFiles((previousFiles: any) => [
            ...previousFiles.slice(0, fileIndex),
            { ...previousFiles[fileIndex], success: false, progress: null },
            ...previousFiles.slice(fileIndex + 1),
          ]);
        });
    });
  };

  return (
    <FormProvider {...methods}>
      <Box as="form" onSubmit={methods.handleSubmit(handleFormSubmit)} mt="md">
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
            progress={currentUploadProgress}
            assets={assets}
            setIsSubmit={setShouldSubmit}
            setDeleteAssets={setDeleteAssets}
            multiple={filetype === 'theme'}
            noChange={filetype === 'theme'}
          />
          {uploadError && <Text color="error">{uploadError}</Text>}
          {filetype === 'theme' && (
            <Box
              display="flex"
              my="md"
              p="md"
              backgroundColor="green.200"
              borderWidth="1px"
              borderStyle="solid"
              borderRadius="sm"
              borderColor="green.300">
              <Text fontSize="sm" color="green.900" alignItems="center">
                <strong>Font naming guide:</strong>
                <br />
                • Use lowercase letters and hyphens only
                <br />• Format: <code>fontname-style.ttf</code>
                <br />• Examples: <code>opensans-bold.ttf</code>,{' '}
                <code>roboto-regular.ttf</code>
                <br />
                <strong>Supported styles:</strong>
                <br />• <strong>Bold:</strong> For headings and emphasis
                <br />• <strong>Regular:</strong> For body text and general
                content
                <br />• <strong>Italic:</strong> For quotes, citations, and
                subtle emphasis
                <br />
                <strong>Not supported:</strong> Light, Black, Thin, and other
                variations
              </Text>
            </Box>
          )}
        </Box>

        {filetype === 'theme' &&
          uploadingFiles &&
          uploadingFiles.length > 0 && (
            <Box h="300px" overflowY="scroll">
              <FontList assets={uploadingFiles} />
            </Box>
          )}
      </Box>
    </FormProvider>
  );
};
export default AssetForm;
