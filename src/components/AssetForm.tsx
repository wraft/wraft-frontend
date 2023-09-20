import React, { useState } from 'react';
import { Box, Flex, Button, Text, Select } from 'theme-ui';
// import { Label, Input } from 'theme-ui';

import { useForm } from 'react-hook-form';
import { Asset } from '../utils/types';
import { Label, Input } from 'theme-ui';
import { useStoreState } from 'easy-peasy';
import { createEntityFile } from '../utils/models';

interface AssetFormProps {
  onUpload?: any;
  filetype?: string;
}

const AssetForm = ({ onUpload, filetype = 'layout' }: AssetFormProps) => {
  const { register, handleSubmit } = useForm();
  const token = useStoreState((state) => state.auth.token);
  const [contents, setContents] = useState<Asset>();

  // const thisFileType: any = filetype;

  const onImageUploaded = (data: any) => {
    const mData: Asset = data;
    onUpload(mData);
    setContents(data);
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('name', data.name);
    formData.append('type', filetype);

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
    <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} mt={4}>
      <Text mb={3}>Upload Files</Text>
      {contents && (
        <Box>
          <Text>{contents.name}</Text>
          <Text>{contents.id}</Text>
          <Text>{contents.file}</Text>
        </Box>
      )}
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
          </Box>
        )}
        {filetype !== 'theme' && (
          <Box>
            <Label htmlFor="name" mb={1}>
              Asset Name
            </Label>
            <Input
              id="name"
              // name="name"
              type="name"
              // ref={register({ required: true })}
              {...register('name', { required: true })}
            />
          </Box>
        )}
        <Label htmlFor="name" mb={1}>
          File
        </Label>
        <Input
          id="file"
          // name="file"
          type="file"
          {...register('file')}
        />
      </Box>
      <Flex mx={-2} mt={2}>
        <Button type="submit" ml={2}>
          Upload
        </Button>
      </Flex>
    </Box>
  );
};
export default AssetForm;
