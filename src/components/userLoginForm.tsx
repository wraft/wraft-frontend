import { useEffect, useState } from 'react';

import Image from 'next/image';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { Label, Input, Heading, Checkbox } from 'theme-ui';
import { Box, Flex, Text, Button } from 'theme-ui';
import { Spinner } from 'theme-ui';

import GoogleLogo from '../../public/GoogleLogo.svg';
import Logo from '../../public/Logo.svg';
import { useAuth } from '../contexts/AuthContext';
import { userLogin } from '../utils/models';

import Link from './NavLink';

export interface IField {
  name: string;
  value: string;
}

const UserLoginForm = () => {
  const { register, handleSubmit } = useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { login, accessToken } = useAuth();

  const onSubmit = async (data: any): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await userLogin(data);
      if (res) {
        login(res);
      }
      setLoading(false);
    } catch (err) {
      console.error('Login error: vb', err);
      setError(err?.errors || 'something wrong');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      Router.push('/');
    }
  }, [accessToken]);

  // const handlePasswordToggle = () => {
  //   setShowPassword(!showPassword);
  // };

  const handleGoogleSignIn = () => {
    // Perform Google sign-in logic here
  };

  return (
    <Flex variant="onboardingFormPage">
      <Box sx={{ position: 'absolute', top: '80px', left: '80px' }}>
        <Link href="/">
          <Image
            src={Logo}
            alt="Wraft Logo"
            width={116}
            height={35}
            className=""
            priority
          />
        </Link>
      </Box>
      <Flex variant="onboardingForms" sx={{ justifySelf: 'center' }}>
        <Heading as="h3" variant="styles.h3Medium" sx={{ mb: '48px' }}>
          Sign in
        </Heading>

        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="email" sx={{ mb: '4px', color: 'dark_600' }}>
            Email
          </Label>
          <Input
            type="text"
            id="email"
            defaultValue=""
            {...register('email', { required: true })}
            mb={'24px'}
            color={'nuetral_nuetral'}
          />

          <Label htmlFor="password" sx={{ mb: '4px', color: 'dark_600' }}>
            Password
          </Label>
          <Input
            id="password"
            defaultValue=""
            type={showPassword ? 'text' : 'password'}
            {...register('password', { required: true })}
            mb={'12px'}
          />
          <Flex
            sx={{
              alignItems: 'center',
              mb: '28px',
              justifyContent: 'space-between',
            }}>
            {error ? (
              <Text sx={{ color: 'warning_300' }}>{error}</Text>
            ) : (
              <Flex>
                <Label
                  sx={{
                    color: 'dark_900',
                    fontWeight: 'body',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <Checkbox
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    sx={{
                      color: 'dark_900',
                      width: '18px',
                      backgroundColor: 'white',
                      border: 'none',
                    }}
                  />
                  Show Password
                </Label>
              </Flex>
            )}
            <Link href="/resetpassword">
              <Text
                sx={{
                  textDecoration: 'none',
                  color: 'dark_900',
                  fontWeight: 'heading',
                }}>
                Forgot Password?
              </Text>
            </Link>
          </Flex>

          <Button type="submit" variant="buttonPrimary">
            <Flex sx={{ alignItems: 'center', gap: '4px' }}>
              Sign in
              {loading && <Spinner color="white" width={18} height={18} />}
            </Flex>
          </Button>
        </Box>

        <Box
          sx={{
            minHeight: '1px',
            maxHeight: '1px',
            margin: '48px 0',
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
export default UserLoginForm;
