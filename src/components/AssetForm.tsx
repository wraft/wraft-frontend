import React, { useState } from 'react';
import { Box, Flex, Button, Text } from 'theme-ui';
// import { Label, Input } from 'theme-ui';

import { useForm } from 'react-hook-form';
import { Asset } from '../utils/types';
import { Label, Input } from 'theme-ui';
import { useStoreState } from 'easy-peasy';
import { createEntityFile } from '../utils/models';

interface AssetFormProps {
  setAsset?: any;
  onUpload?: any;
}

const AssetForm = ({ onUpload, setAsset }: AssetFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm();
  const token = useStoreState((state) => state.auth.token);
  const [contents, setContents] = useState<Asset>();

  const onImageUploaded = (data: any) => {
    const mData: Asset = data;
    onUpload(mData);
    setContents(data);
  };

  const onSubmit = (data: any) => {
    setAsset(true);
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('name', data.name);
    formData.append('type', 'layout');

    // const formData = new FormData();
    // formData.append('image', data.file[0]);
    // formData.append('tag', 'file');
    createEntityFile(formData, token, 'assets', onImageUploaded);

    // fetch(`${env.api_dev}/api/v1/assets`, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     // 'Content-Type': 'multipart/form-data',
    //     Authorization: `Bearer ${token}`,
    //   },
    //   // headers: {'Content-Type':'multipart/form-data'},
    //   body: formData,
    // })
    //   .then(function(response) {
    //     return response.json();
    //   })
    //   .then(function(data) {
    //     const mData: Asset = data;
    //     console.log('Created Asset', mData);
    //     props.onUpload(mData);
    //     setContents(mData);
    //   });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} mt={4}>
      {/* <Text mb={3}>Upload Files</Text> */}
      {/* {contents && (
        <Box>
          <Text>{contents.name}</Text>
          <Text>{contents.id}</Text>
          <Text>{contents.file}</Text>
        </Box>
      )} */}
      <Box>
        <Label htmlFor="name">File Name</Label>
        <Input
          id="name"
          type="name"
          {...register('name', { required: true })}
        />
        <Label htmlFor="name">File</Label>
        <Input id="file" type="file" {...register('file')} />
      </Box>
      <Flex>
        <Button
          type="submit"
          disabled={!isValid}
          sx={{
            ':disabled': {
              bg: 'gray.0',
              color: 'gray.5',
            },
          }}>
          Upload
        </Button>
      </Flex>
    </Box>
  );
};
export default AssetForm;
