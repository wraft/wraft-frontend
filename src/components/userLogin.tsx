/** @jsxImportSource theme-ui */

import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button, Divider } from 'theme-ui';
import Router from 'next/router';
import Image from 'next/image';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { Label, Input, Heading, Grid } from 'theme-ui';

import { useForm } from 'react-hook-form';
import Link from './NavLink';
import { userLogin } from '../utils/models';
import { Spinner } from 'theme-ui';

import Logo from '../../public/Logo.svg';
import GoogleLogo from '../../public/GoogleLogo.svg';

export interface IField {
  name: string;
  value: string;
}

const UserLogin = () => {
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

  const handleGoogleSignIn = () => {
    // Perform Google sign-in logic here
  };

  return (
    <Grid as="main" sx={{ margin: '80px' }} variant="signinGrid">
      <Box as="section" sx={{ marginRight: 'auto' }}>
        <img src={Logo} alt="" />
      </Box>

      <Flex as="section" variant="signinRight">
        <Heading as="h3" variant="styles.h3" sx={{ mb: '48px' }}>
          Sign in
        </Heading>

        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            id="email"
            defaultValue="shijith.k@aurut.com"
            {...register('email', { required: true })}
            mb={'24px'}
          />

          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            // name="password"
            defaultValue="pa55w0rd"
            type="password"
            // ref={register({ required: true })}
            {...register('password', { required: true })}
            mb={'12px'}
          />
          <Flex
            sx={{
              width: '100%',
              flexDirection: 'row-reverse',
              position: 'relative',
            }}>
            <Link href="/resetpassword">
              <Text
                sx={{
                  textDecoration: 'none',
                  color: 'dark_300',
                }}>
                Forgot Password?
              </Text>
            </Link>
            <Button
              type="submit"
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
          <img src={GoogleLogo} alt="" />
          Continue with Google
        </Button>

        <Text as="p" sx={{ mt: 5, color: 'dark_600' }}>
          Not a user yet?
          <Link href="/signup">
            <Text
              sx={{
                textDecoration: 'none',
                color: 'dark_600',
                fontWeight: 'bold',
                pl: 0,
              }}>
              Request invite
            </Text>
          </Link>
        </Text>
      </Flex>
    </Grid>
  );
};
export default UserLogin;
