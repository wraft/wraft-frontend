import React from 'react';
import { Box, Flex, Button, Text, Link as LinkBase } from 'rebass';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Label, Input } from '@rebass/forms';
import { registerUser } from '../utils/models';

export interface IField {
  name: string;
  value: string;
}

const Form = () => {
  const { register, handleSubmit, errors } = useForm();
  
  const onSignup = () => {
    console.log('signed up');
  }

  const onSubmit = (data: any) => {
    registerUser(data, onSignup)
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      py={3}
      width={4 / 12}
      mt={4}>
      <Text variant="pagetitle">
        Join Wraft
      </Text>
      <Box mx={0} mb={3}>
        <Box width={1} px={2} pb={3}>
          <Label htmlFor="email" mb={1}>
            Name
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue="Muneef Hameed"
            ref={register({ required: true })}
          />
        </Box>
        <Box width={1} px={2} pb={3}>
          <Label htmlFor="email" mb={1}>
            Email
          </Label>
          <Input
            id="email"
            name="email"
            defaultValue="john@doe.com"
            ref={register({ required: true })}
          />
        </Box>
        <Box width={1} px={2}>
          <Label htmlFor="password" mb={1}>
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            ref={register({ required: true })}
          />
        </Box>

        {errors.exampleRequired && <Text>This field is required</Text>}
        <Flex mx={-2} flexWrap="wrap" mt={2}>
          <Button type="submit" ml={2}>
            Join Now
          </Button>
          <Text pl={3} pt={2}>
            Already a user ?{' '}
            <LinkBase href="login" as={Link}>
              Sign in
            </LinkBase>
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};
export default Form;
