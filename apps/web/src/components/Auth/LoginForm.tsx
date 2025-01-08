import { useEffect, useState } from 'react';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Box,
  Flex,
  Text,
  Field,
  InputText,
  PasswordInput,
} from '@wraft/ui';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BrandLogoIcon, GoogleIcon } from '@wraft/icon';

import Link from 'common/NavLink';
import { useAuth } from 'contexts/AuthContext';
import { LoginSchema, Login } from 'schemas/auth';
import { userLogin } from 'utils/models';

const LoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { login, accessToken } = useAuth();
  const { data, status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({ resolver: zodResolver(LoginSchema) });

  const router = useRouter();
  const homePageUrl = process.env.homePageUrl || '/';
  const isSelfHost =
    process.env.SELF_HOST?.toLowerCase() === 'false' ? false : true;

  const { session, error } = router.query;

  useEffect(() => {
    const handleSignOut = async () => {
      if (session) {
        try {
          if (status === 'authenticated') {
            await signOut({ redirect: false });
          }
          router.push('/login');
        } catch (err) {
          console.error('Error during sign out:', err);
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

  const onSubmit = async (formData: any): Promise<void> => {
    setLoading(true);
    setLoginError(null);
    try {
      const res = await userLogin(formData);
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
    <Flex justify="center" p="5xl">
      <Box position="absolute" top="80px" left="80px">
        <Link href={homePageUrl}>
          <Box color="gray.0" fill="gray.1200">
            <BrandLogoIcon width="7rem" height="3rem" />
          </Box>
        </Link>
      </Box>
      <Flex variant="card" w="500px" justifySelf="center" direction="column">
        <Text as="h3" mb="48px" color="gray.1200" fontSize="3xl">
          Sign in
        </Text>

        <Flex
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          gap="lg"
          direction="column">
          <Field label="Email" required error={errors?.email?.message}>
            <InputText
              {...register('email')}
              placeholder="Enter your email address"
            />
          </Field>

          <Field label="Password" required error={errors?.password?.message}>
            <PasswordInput
              placeholder="Enter your password"
              {...register('password')}
            />
          </Field>

          <Flex mb="md" justify="space-between">
            <Button type="submit" loading={loading}>
              Sign in
            </Button>

            <Link href="/forgetpassword">
              <Text cursor="pointer" color="gray.800">
                Forgot Password?
              </Text>
            </Link>
          </Flex>
        </Flex>
        <Box>{loginError && <Text color="red.400">{loginError}</Text>}</Box>

        {((process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_ID) ||
          !isSelfHost) && (
          <>
            <Box
              as="hr"
              border="0"
              borderTop="1px solid"
              borderColor="border"
              my="3xl"
              w="100%"
            />

            {process.env.GOOGLE_CLIENT_SECRET &&
              process.env.GOOGLE_CLIENT_ID && (
                <Button variant="secondary" onClick={() => signIn('gmail')}>
                  <GoogleIcon width={18} />
                  Login in with Google
                </Button>
              )}

            {!isSelfHost && (
              <Text as="div" mt="24px" color="gray.1000" gap="8px" mb="xxl">
                Not a user yet?{' '}
                <Link href="/signup" variant="none">
                  <Text cursor="pointer">Request invite</Text>
                </Link>
              </Text>
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default LoginForm;
