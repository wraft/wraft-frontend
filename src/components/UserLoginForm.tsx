import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button } from 'theme-ui';
import Router from 'next/router';

import { useStoreActions, useStoreState } from 'easy-peasy';

import { Label, Input, Container } from 'theme-ui';

import { useForm } from 'react-hook-form';
import Link from './NavLink';
import { userLogin } from '../utils/models';
import { Spinner } from 'theme-ui';

export interface IField {
  name: string;
  value: string;
}

const UserLoginForm = () => {
  const { register, handleSubmit, errors } = useForm();
  const token = useStoreState((state) => state.auth.token);
  const setToken = useStoreActions((actions: any) => actions.auth.addToken);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    setLoading(true);
    userLogin(data, ProxyToken);
  };

  const ProxyToken = (t: string) => {
    setToken(t);
    setLoading(false);
  };

  useEffect(() => {
    if (token && token.length > 10) {
      Router.push('/');
    }
  }, [token]);

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Container sx={{ maxWidth: '100ch', py: 6, mx: 'auto' }}>
        <Text variant="pagetitle" sx={{ fontWeight: 500, mb: 3 }}>
          Sign-in to Wraft Docs
        </Text>
        <Box mx={-2} mb={3} sx={{ maxWidth: '40ch', mb: 4 }}>
          <Box px={2} pb={3} sx={{}}>
            <Label htmlFor="email" mb={1}>
              Email
            </Label>
            <Input
              id="email"
              name="email"
              defaultValue="shijith.k@aurut.com"
              ref={register({ required: true })}
            />
          </Box>
          <Box px={2}>
            <Label htmlFor="location" mb={1}>
              Password
            </Label>
            <Input
              id="password"
              name="password"
              defaultValue="pa55w0rd"
              type="password"
              ref={register({ required: true })}
            />
          </Box>
          {errors.exampleRequired && <Text>This field is required</Text>}
        </Box>
        <Flex sx={{ flexWrap: 'wrap', mt: 1, mx: -2 }}>
          <Button
            ml={2}
            sx={{
              mt: 0,
              mr: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text mr={2} sx={{ fontWeight: 800 }}>
              Login
            </Text>

            {loading && <Spinner color="white" width={18} height={18} />}

            {/* {loading && <Spinner color="white" width={18} />} */}
          </Button>
          {/* <Button ml={2} sx={{ mt: 0, mr: 3 }}>
            {loading && <Spinner color="white" width={24} />}
            {!loading && <Text sx={{ fontWeight: 800 }}>Login</Text>}
          </Button> */}
        </Flex>
        <Text pl={0} pt={2}>
          Not a user yet ?{' '}
          <Link href="signup">
            <Text sx={{ fontWeight: 800 }}>Join us now!</Text>
          </Link>
        </Text>
      </Container>
    </Box>
  );
};
export default UserLoginForm;
