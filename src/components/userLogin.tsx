/** @jsxImportSource theme-ui */

import { useEffect, useState } from 'react';
import { Box, Flex, Text, Button } from 'theme-ui';
import Router from 'next/router';
// import Image from 'next/image';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { Label, Input, Heading } from 'theme-ui';

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
  const [error, setError] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    setLoading(true);
    setError(false);
    userLogin(data, ProxyToken, handleError);
  };

  const ProxyToken = (t: string) => {
    console.log(t);
    setToken(t);
    setLoading(false);
  };

  const handleError = (error: any) => {
    // Handle the error here, e.g., display an error message to the user.
    setError(true);
    console.error('Login error: vb', error);
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
    <Flex variant="onboardingFormPage">
      <Box sx={{ position: 'absolute', top: '80px', left: '80px' }}>
        <Link href="/">
          <img src={Logo} alt="" />
        </Link>
      </Box>

      <Flex variant="onboardingForms" sx={{ justifySelf: 'center' }}>
        <Heading as="h3" variant="styles.h3Medium" sx={{ mb: '48px' }}>
          Sign in
        </Heading>

        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="email" mb={1}>
            Email
          </Label>
          <Input
            type="text"
            id="email"
            defaultValue="shijith.k@aurut.com"
            {...register('email', { required: true })}
            mb={'24px'}
          />

          <Label htmlFor="password" mb={1}>
            Password
          </Label>
          <Input
            id="password"
            // name="password"
            defaultValue="pa55w0rd"
            type="password"
            // ref={register({ required: true })}
            {...register('password', { required: true })}
            mb={'12px'}
          />
          {errors.exampleRequired && <Text>This field is required</Text>}
          <Flex
            sx={{
              width: '100%',
              flexDirection: 'row-reverse',
              position: 'relative',
              height: error ? '88px' : '52px',
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
            <Flex
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: error ? 'static' : 'absolute',
                mr: 'auto',
                top: error ? '0px' : '12px',
                left: '0',
              }}>
              {error && (
                <Text sx={{ mb: '24px', color: 'warning_300' }}>
                  Email or password entered is incorrect
                </Text>
              )}
              <Button type="submit" variant="buttonPrimary">
                <Flex sx={{ alignItems: 'center' }}>
                  Sign in
                  {loading && <Spinner color="white" width={18} height={18} />}
                </Flex>
              </Button>
            </Flex>
          </Flex>
        </Box>

        <Box
          sx={{
            minHeight: '1px',
            maxHeight: '1px',
            margin: '56px 0',
            backgroundColor: 'border',
          }}
        />

        <Button onClick={handleGoogleSignIn} variant="googleLogin">
          <img src={GoogleLogo} alt="" />
          Continue with Google
        </Button>

        <Flex sx={{ alignItems: 'center', mt: '24px', color: 'dark_600' }}>
          Not a user yet? {''}
          <Link href="/signup">
            <Text
              sx={{
                color: 'dark_600',
                fontWeight: 'bold',
              }}>
              Request invite
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default UserLogin;
