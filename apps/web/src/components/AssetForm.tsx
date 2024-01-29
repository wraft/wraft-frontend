import React, { useState } from 'react';

import Dropzone from '@wraft-ui/Dropzone';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Button, Label, Select, Spinner, Text } from 'theme-ui';

import { postAPI } from '../utils/models';
import { Asset } from '../utils/types';

interface AssetFormProps {
  setAsset?: any;
  onUpload?: any;
  filetype?: 'layout' | 'theme';
  pdfPreview?: string | undefined;
  setPdfPreview?: any;
  deleteAsset?: any;
}

type FormProps = {
  filetype: 'layout' | 'theme';
};

type FormValues = {
  file: FileList;
  name?: string;
};

const AssetForm = ({
  onUpload,
  setAsset,
  filetype = 'layout',
  pdfPreview,
  setPdfPreview,
  // deleteAsset,
}: AssetFormProps) => {
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const methods = useForm<FormValues>({ mode: 'onBlur' });

  const onImageUploaded = (data: any) => {
    setLoading(false);
    console.log('📸', data);
    const mData: Asset = data;
    onUpload(mData);
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setFileError(null);
    console.log('file: 🔥', data);

    if (!data.file || data.file === undefined || data.file.length < 1) {
      setFileError('Please select a file');
      setLoading(false);
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
        onImageUploaded(data);
        setUploadProgress(0);
        return `Successfully created ${filetype == 'theme' ? 'font' : 'field'}`;
      },
      error: (error) => {
        setLoading(false);
        console.log(error);
        setFileError(
          error.errors.file[0] || error.message || 'There is an error',
        );
        return `Failed to create ${filetype == 'theme' ? 'font' : 'field'}`;
      },
    });

    if (filetype === 'theme') setAsset();
  };

  return (
    <FormProvider {...methods}>
      <Box as="form" onSubmit={methods.handleSubmit(onSubmit)} mt={4}>
        <Box mx={-2} mb={3}>
          <Form filetype={filetype} />
          <Dropzone
            onChange={(e: any) => {
              e.target.value;
              console.log('onChange 😇', e.target.value);
              methods.handleSubmit(onSubmit);
            }}
            filetype={filetype}
            progress={uploadProgress}
            pdfPreview={pdfPreview}
            setPdfPreview={setPdfPreview}
            // deleteAsset={deleteAsset}
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
        <Flex>
          <Button
            type="submit"
            variant="buttonPrimary"
            // disabled={!!(isLoading && files && files.length > 0)}
            sx={{
              // display: 'none',
              ':disabled': {
                bg: 'gray.100',
                color: 'gray.500',
              },
            }}>
            Upload {''}
            {isLoading && <Spinner color="white" width={18} height={18} />}
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
};
export default AssetForm;

const Form = ({ filetype }: FormProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  return (
    <Box>
      {filetype === 'theme' && (
        <Box>
          <Label htmlFor="name" mb={1}>
            Font Weight
          </Label>
          <Select
            id="flow_id"
            defaultValue=""
            {...register('name', { required: true })}>
            <option value="Regular" key="regular">
              Regular
            </option>
            <option value="Italic" key="italic">
              Italic
            </option>
            <option value="Bold" key="bold">
              Bold
            </option>
          </Select>
          {errors.name && errors.name.message && (
            <Text variant="error">{errors.name.message} </Text>
          )}
        </Box>
      )}
      {errors.file && <Text variant="error">{errors.file.message}</Text>}
    </Box>
  );
};
