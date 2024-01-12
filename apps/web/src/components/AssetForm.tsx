import React from 'react';

import { useForm } from 'react-hook-form';
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

import { useAuth } from '../contexts/AuthContext';
import { createEntityFile } from '../utils/models';
import { Asset } from '../utils/types';

// import { CloudUploadIcon } from './Icons';
import Error from './Error';

// import Field from './Field';
// import { useDropzone } from 'react-dropzone';

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
  // const [contents, setContents] = React.useState<Asset>();

  const { accessToken } = useAuth();

  const onImageUploaded = (data: any) => {
    setLoading(false);
    console.log('📸', data);
    const mData: Asset = data;
    onUpload(mData);
    // setContents(data);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log('file:', data);
    const formData = new FormData();
    formData.append('file', data.file[0]);
    // formData.append('name', data.name);
    formData.append(
      'name',
      data.file[0].name.substring(0, data.file[0].name.lastIndexOf('.')),
    );
    formData.append('type', filetype);

    await createEntityFile(
      formData,
      accessToken as string,
      'assets',
      onImageUploaded,
    );
    setAsset(true);
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
            {errors.name && <Error text={errors.name.message} />}
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
