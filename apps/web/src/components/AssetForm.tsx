import React from 'react';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Box,
  Flex,
  Button,
  Label,
  Input,
  Select,
  Spinner,
  Text,
} from 'theme-ui';

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
  const {
    // watch,
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormInputs>({ mode: 'all' });
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [fileError, setFileError] = React.useState<string | null>(null);
  // const [contents, setContents] = React.useState<Asset>();

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
    const formData = new FormData();
    formData.append('file', data.file[0]);
    // formData.append('name', data.name);
    formData.append(
      'name',
      data.file[0].name.substring(0, data.file[0].name.lastIndexOf('.')),
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
        setFileError(error.errors.file[0]);
        return `Failed to create ${filetype == 'theme' ? 'font' : 'field'}`;
      },
    });

    if (filetype === 'layout') setAsset(true);
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
        {/* {filetype !== 'theme' && (
          <Box>
            <Field
              name="name"
              label="Asset Name"
              defaultValue=""
              register={register}
              error={errors.name}
            />
          </Box>
        )} */}
        <Label htmlFor="file" mb={1}>
          File
        </Label>
        {filetype === 'theme' ? (
          <Input
            id="file"
            type="file"
            accept=".ttf, .otf"
            {...register('file', { required: true })}
          />
        ) : (
          <Input
            id="file"
            type="file"
            accept="application/pdf"
            {...register('file', { required: true })}
          />
        )}
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
          disabled={!isValid || isLoading}
          sx={{
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
