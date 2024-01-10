import { useEffect, useState } from 'react';

import Image from 'next/image';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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
  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { login, accessToken } = useAuth();
  const { data, status } = useSession();
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const { session, error } = router.query;

  useEffect(() => {
    const handleSignOut = async () => {
      if (session) {
        try {
          if (status === 'authenticated') {
            await signOut({ redirect: false });
          }

          router.push('/login');
        } catch (error) {
          console.error('Error during sign out:', error);
        }
      }
    };

    handleSignOut();
  }, [session]);

  useEffect(() => {
    if (error) {
      toast.error((error as string) || 'somthing wrong', {
        duration: 3000,
        position: 'top-right',
      });
      router.push('/login');
    }
  }, [error]);

  useEffect(() => {
    if (status === 'authenticated' && data?.user && !session) {
      login(data?.user);
    }
  }, [data, status]);

  const onSubmit = async (data: any): Promise<void> => {
    setLoading(true);
    setLoginError(null);
    try {
      const res = await userLogin(data);
      if (res) {
        login(res);
      }
      setLoading(false);
    } catch (err) {
      console.error('Login error: vb', err);
      setLoginError(err?.errors || 'something wrong');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      Router.push('/');
    }
  }, [accessToken]);

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
          <Label htmlFor="email" sx={{ mb: '4px', color: 'gray.600' }}>
            Email
          </Label>
          <Input
            type="text"
            id="email"
            defaultValue=""
            {...register('email', { required: true })}
            mb={'24px'}
            color="border"
          />

          <Label htmlFor="password" sx={{ mb: '4px', color: 'gray.600' }}>
            Password
          </Label>
          <Input
            id="password"
            defaultValue=""
            type={showPassword ? 'text' : 'password'}
            {...register('password', { required: true })}
            mb={'12px'}
            color={'border'}
          />
          <Flex
            sx={{
              alignItems: 'center',
              mb: '28px',
              justifyContent: 'space-between',
            }}>
            {loginError ? (
              <Text sx={{ color: 'orange.300' }}>{loginError}</Text>
            ) : (
              <Flex>
                <Label
                  sx={{
                    cursor: 'pointer',
                    color: 'gray.900',
                    fontWeight: 'body',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <Checkbox
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    sx={{
                      cursor: 'pointer',
                      color: 'gray.900',
                      width: '18px',
                      backgroundColor: 'white',
                      border: 'none',
                    }}
                  />
                  <Text variant="pM">Show Password</Text>
                </Label>
              </Flex>
            )}
            <Link href="/resetpassword">
              <Text
                variant="pM"
                sx={{
                  cursor: 'pointer',
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

        <Button onClick={() => signIn('gmail')} variant="googleLogin">
          <img src={GoogleLogo} alt="" />
          Continue with Google
        </Button>
        {/* <Button onClick={() => signIn('github')}>Sign in</Button> */}

        <Flex
          sx={{
            alignItems: 'center',
            mt: '24px',
            color: 'gray.600',
            gap: '8px',
          }}>
          <Text variant="pR">Not a user yet? {''}</Text>
          <Link href="/signup" variant="none">
            <Text variant="pB" sx={{ cursor: 'pointer' }}>
              Request invite
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default UserLoginForm;
