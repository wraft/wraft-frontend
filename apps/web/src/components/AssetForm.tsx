import React, { useEffect, useState } from 'react';

import Dropzone from '@wraft-ui/Dropzone';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Button, Label, Select, Spinner, Text } from 'theme-ui';

import { postAPI } from '../utils/models';
import { Asset } from '../utils/types';

interface AssetFormProps {
  setAsset?: any;
  onUpload?: any;
  filetype?: string;
}

type FormInputs = {
  file: FileList;
  name: string;
};

const AssetForm = ({
  onUpload,
  setAsset,
  filetype = 'layout',
}: AssetFormProps) => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [fileError, setFileError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({ mode: 'all' });

  useEffect(() => {
    if (files && files.length > 0) {
      handleSubmit(onSubmit)();
    }
  }, [files]);

  const onImageUploaded = (data: any) => {
    setLoading(false);
    console.log('📸', data);
    const mData: Asset = data;
    onUpload(mData);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setFileError(null);
    console.log('file:', data);

    if (!files || files === undefined) {
      setFileError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append(
      'name',
      files[0].name.substring(0, files[0].name.lastIndexOf('.')),
    );
    formData.append('type', filetype);

    const assetsRequest = postAPI(`assets`, formData);

    toast.promise(assetsRequest, {
      loading: 'Loading',
      success: (data) => {
        onImageUploaded(data);
        return `Successfully created ${filetype == 'theme' ? 'font' : 'field'}`;
      },
      error: (error) => {
        setLoading(false);
        console.log(error);
        setFileError(error.message || 'There is an error');
        return `Failed to create ${filetype == 'theme' ? 'font' : 'field'}`;
      },
    });

    if (filetype === 'theme') setAsset();
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} mt={4}>
      <Box mx={-2} mb={3}>
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
            {errors.name && <Text variant="error">{errors.name.message} </Text>}
          </Box>
        )}
        <Dropzone files={files} setFiles={setFiles} />
        {errors.file && <Text variant="error">{errors.file.message}</Text>}
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
          disabled={!!(isLoading && files && files.length > 0)}
          sx={{
            display: 'none',
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
  );
};
export default AssetForm;
