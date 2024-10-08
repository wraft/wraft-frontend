import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Text, Label, Input } from 'theme-ui';

import { env } from './vars';

export interface IField {
  name: string;
  value: string;
}

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => {
    fetch(`${env.api_dev}/api/v1/users/signin`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        return response.json();
      })
      .then(() => {});
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} mt={4}>
      <Text mb={3}>Sign-in to Wraft</Text>
      <Box mx={-2} mb={3}>
        <Box>
          <Label htmlFor="email" mb={1}>
            Email
          </Label>
          <Input
            id="email"
            // name="email"
            defaultValue="John Doe"
            // ref={register({ required: true })}
            {...register('email', { required: true })}
          />
        </Box>
        <Box>
          <Label htmlFor="location" mb={1}>
            Password
          </Label>
          <Input
            id="password"
            // name="password"
            defaultValue=""
            type="password"
            // ref={register({ required: true })}
            {...register('password', { required: true })}
          />
        </Box>
        {errors.exampleRequired && <Text>This field is required</Text>}
      </Box>
    </Box>
  );
};
export default Form;
