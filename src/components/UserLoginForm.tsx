/** @jsxImportSource theme-ui */

import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button } from 'theme-ui';
import Router from 'next/router';
import Image from 'next/image';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { Label, Input, Grid, Heading } from 'theme-ui';

import { useForm } from 'react-hook-form';
import Link from './NavLink';
import { userLogin } from '../utils/models';
import { Spinner } from 'theme-ui';

export interface IField {
  name: string;
  value: string;
}

const UserLoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
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
    <Grid as="main" variant="variants.signinGrid">
      <Box as="section" sx={{ marginRight: 'auto' }}>
        <Image src={Logo} alt="Wraft Logo" className="" priority />
      </Box>

      <Flex as="section" variant="signinRight">
        <Heading as="h3" variant="styles.h3" sx={{ mb: '48px' }}>
          Sign in
        </Heading>

        <Box as="form" onSubmit={onSubmit}>
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb={'24px'}
          />

          <Label htmlFor="password">Password</Label>
          <Input
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb={'12px'}
          />
          <Flex
            sx={{
              width: '100%',
              flexDirection: 'row-reverse',
              position: 'relative',
            }}>
            <Link
              href="/resetpassword"
              sx={{
                textDecoration: 'none',
                color: 'dark_300',
              }}>
              Forgot Password?
            </Link>
            <Button
              type="submit"
              onClick={handleSubmit}
              sx={{
                position: 'absolute',
                mr: 'auto',
                top: '12px',
                left: '0',
              }}>
              Sign in
            </Button>
          </Flex>
        </Box>

        <Divider
          sx={{
            margin: '56px 0',
            color: 'rgba(0.141, 0.243, 0.286, 0.1)',
          }}
        />

        <Button onClick={handleGoogleSignIn} variant="googleLogin">
          <Image src={GoogleLogo} alt="Google Logo" className="" />
          Continue with Google
        </Button>

        <Text as="p" sx={{ mt: 5, color: 'dark_600' }}>
          Not a user yet?
          <Link
            href="/signup"
            sx={{
              textDecoration: 'none',
              color: 'dark_600',
              fontWeight: 'bold',
              pl: 0,
            }}>
            Request invite
          </Link>
        </Text>
      </Flex>
    </Grid>
  );
};
export default UserLoginForm;
