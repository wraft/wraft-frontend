import React from 'react';
import { Box, Flex, Button, Text, Link as LinkBase } from 'theme-ui';
import Link from 'next/link';

import { Label, Input } from 'theme-ui';

import { useForm } from 'react-hook-form';
import { env } from './vars'

export interface IField {
  name: string;
  value: string;
}

const Form = () => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data: any) => {
    console.log('data', data);
    fetch(`${env.api_dev}/api/v1/users/signin`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log('Created Profile:', data);
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
        Sign-in to Wraft
      </Text>
      <Box mx={-2} mb={3}>
        <Box width={1} px={2} pb={3}>
          <Label htmlFor="email" mb={1}>
            Email
          </Label>
          <Input
            id="email"
            name="email"
            defaultValue="John Doe"
            ref={register({ required: true })}
          />
        </Box>
        <Box width={1} px={2}>
          <Label htmlFor="location" mb={1}>
            Password
          </Label>
          <Input
            id="password"
            name="password"
            defaultValue=""
            type="password"
            ref={register({ required: true })}
          />
        </Box>
        {errors.exampleRequired && <Text>This field is required</Text>}
      </Box>
      <Flex mx={-2} flexWrap="wrap" mt={2}>
        <Button ml={2}>Login</Button>
        <Text pl={3} pt={2}>
          Not a user ?{' '}
          <LinkBase href="signup" as={Link}>
            Signup
          </LinkBase>
        </Text>
      </Flex>
    </Box>
  );
};
export default Form;
