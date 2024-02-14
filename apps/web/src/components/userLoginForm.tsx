import { useEffect, useState } from 'react';
import Image from 'next/image';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@wraft/ui';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Heading } from 'theme-ui';
import { Box, Flex, Text } from 'theme-ui';
import { z } from 'zod';

import GoogleLogo from '../../public/GoogleLogo.svg';
import Logo from '../../public/Logo.svg';
import { useAuth } from '../contexts/AuthContext';
import { userLogin } from '../utils/models';
import { emailPattern } from '../utils/zodPatterns';
import Field from './Field';
import Link from './NavLink';

export interface IField {
  name: string;
  value: string;
}

type FormValues = {
  email: string;
  password: string;
};

const schema = z.object({
  email: emailPattern,
  password: z.string().min(1, { message: 'Please enter password' }),
});

const UserLoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { login, accessToken } = useAuth();
  const { data, status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onBlur', resolver: zodResolver(schema) });
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
        <Heading
          as="h3"
          variant="styles.h3Medium"
          sx={{ mb: '48px', color: 'green.700' }}>
          Sign in
        </Heading>

        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Field
            name="email"
            label="Email"
            register={register}
            type={'email'}
            error={errors.email}
            mb={'24px'}
          />
          <Field
            name="password"
            label="Password"
            register={register}
            type="password"
            error={errors.password}
            mb={3}
          />
          <Flex
            sx={{
              alignItems: 'center',
              mb: '28px',
              justifyContent: 'space-between',
            }}>
            {loginError && <Text variant="error">{loginError}</Text>}
            <Box />
            <Link href="/resetpassword">
              <Text
                variant="pM"
                sx={{
                  cursor: 'pointer',
                  color: 'gray.400',
                }}>
                Forgot Password?
              </Text>
            </Link>
          </Flex>

          <Button type="submit" variant="primary" loading={loading}>
            Sign in
          </Button>
        </Box>

        <Box
          sx={{
            borderBottom: '1px solid',
            borderColor: 'border',
            whidth: '100%',
            mt: '63px',
            mb: '56px',
          }}
        />

        <Button onClick={() => signIn('gmail')} variant="googleLogin">
          <Image src={GoogleLogo} alt="" width={24} height={24} />
          Login using Google
        </Button>

        <Flex
          sx={{
            alignItems: 'center',
            mt: '24px',
            color: 'gray.600',
            gap: '8px',
            mb: '48px',
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
