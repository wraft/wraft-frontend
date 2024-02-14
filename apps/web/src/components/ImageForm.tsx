import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Flex, Button, Text } from 'theme-ui';
import { Label, Input } from 'theme-ui';
import { Spinner } from 'theme-ui';

import { useAuth } from '../contexts/AuthContext';
import { createEntityFile } from '../utils/models';

export interface IImageForm {
  onSuccess?: any;
}

const Form = (props: IImageForm) => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const onImageUploaded = (i: any) => {
    setLoading(false);
    props.onSuccess(i);
  };

  const { accessToken } = useAuth();

  const onSubmit = (data: any) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('image', data.file[0]);
    formData.append('tag', 'file');

    createEntityFile(
      formData,
      accessToken as string,
      'images',
      onImageUploaded,
    );
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} mt={4}>
      {loading && <Spinner width={32} color="primary" />}
      <Text mb={3}>Upload Files</Text>
      <Box mx={-2} mb={3}>
        <Input
          id="name"
          // name="name"
          type="hidden"
          // ref={register}
          {...register('name')}
        />
        <Label htmlFor="name" mb={1}>
          File
        </Label>
        <Input
          id="file"
          // name="file"
          type="file"
          // ref={register}
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
export default Form;
