import React, { useState } from 'react';
import { Box, Flex, Button, Text } from 'rebass';
// import { Label, Input } from '@rebass/forms';

import { useForm } from 'react-hook-form';

import { env } from './vars';

import { Asset } from '../utils/types';
import { Label, Input } from '@rebass/forms';
import { useStoreState } from 'easy-peasy';

const Form = (props: any) => {
  const { register, handleSubmit } = useForm();
  const token = useStoreState(state => state.auth.token);
  const [contents, setContents] = useState<Asset>();

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('name', data.name);

    fetch(`${env.api_dev}/api/v1/assets`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        // 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      // headers: {'Content-Type':'multipart/form-data'},
      body: formData,
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        const mData: Asset = data;
        console.log('Created Asset', mData);
        props.onUpload(mData);
        setContents(mData);
      });
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      py={3}
      width={4 / 12}
      mt={4}>
      <Text mb={3} fontSize={2} fontWeight={500}>
        Upload Files
      </Text>
      {contents && (
        <Box>
          <Text>{contents.name}</Text>
          <Text>{contents.id}</Text>
          <Text>{contents.file}</Text>
        </Box>
      )}
      <Box mx={-2} mb={3}>
        <Label htmlFor="name" mb={1}>
          File Name
        </Label>
        <Input
          id="name"
          name="name"
          type="name"
          ref={register({ required: true })}
        />
        <Label htmlFor="name" mb={1}>
          File
        </Label>
        <Input
          id="file"
          name="file"
          type="file"
          ref={register}
        />
      </Box>
      <Flex mx={-2} flexWrap="wrap" mt={2}>
        <Button type="submit" ml={2}>
          Upload
        </Button>
      </Flex>
    </Box>
  );
};
export default Form;
