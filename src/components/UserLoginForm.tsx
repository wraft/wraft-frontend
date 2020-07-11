import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button } from 'rebass';
import Router from 'next/router';

import { useStoreActions, useStoreState } from 'easy-peasy';

import { Label, Input } from '@rebass/forms';

import { useForm } from 'react-hook-form';
import Link from './NavLink';
import { userLogin } from '../utils/models';
import { Spinner } from 'theme-ui';

export interface IField {
  name: string;
  value: string;
}

const Form = () => {
  const { register, handleSubmit, errors } = useForm();
  const token = useStoreState(state => state.auth.token);
  const setToken = useStoreActions((actions: any) => actions.auth.addToken);
  const [ready, setReady] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    setReady(true);
    userLogin(data, ProxyToken);
  };

  // if(token) {
  //   return (<h1>Logged in da</h1>)
  // }

  const ProxyToken = (t: string) => {
    setToken(t);
    setReady(false);
  };

  useEffect(() => {
    if (token && token.length > 10) {
      Router.push('/');
    }
  }, [token]);

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      py={3}
      width={4 / 12}
      mt={4}>
      <Text variant="pagetitle">Sign-in to Wraft Docs</Text>
      <Box mx={-2} mb={3}>
        <Box width={1} px={2} pb={3}>
          <Label htmlFor="email" mb={1}>
            Email
          </Label>
          <Input
            id="email"
            name="email"
            defaultValue="admin@wraftdocs.com"
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
            defaultValue="Admin@WraftDocs"
            type="password"
            ref={register({ required: true })}
          />
        </Box>
        {errors.exampleRequired && <Text>This field is required</Text>}
      </Box>
      <Flex mx={-2} flexWrap="wrap" mt={2}>
        <Button ml={2}>
          {ready && <Spinner color="white" width={24} />}
          {!ready && <Text>Login</Text>}
        </Button>
        <Text pl={3} pt={2}>
          Not a user ?{' '}
          <Link href="signup">
            <Text>Login</Text>
          </Link>
        </Text>
      </Flex>
    </Box>
  );
};
export default Form;
