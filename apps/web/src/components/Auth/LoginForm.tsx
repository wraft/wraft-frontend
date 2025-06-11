import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
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

const GoogleAuthHandler = ({
  isGoogleAuthEnabled,
}: {
  isGoogleAuthEnabled: any;
}) => {
  const { login } = useAuth();
  const { data: nextAuthSession, status } = useSession();

  useEffect(() => {
    if (
      isGoogleAuthEnabled &&
      status === 'authenticated' &&
      nextAuthSession?.user
    ) {
      login(nextAuthSession.user);
    }
  }, [isGoogleAuthEnabled, status, nextAuthSession, login]);

  return null;
};

const LoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { login, accessToken } = useAuth();

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const isGoogleAuthEnabled =
    process.env.NEXT_PUBLIC_NEXT_AUTH_ENABLED === 'true' &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({ resolver: zodResolver(LoginSchema) });

  const router = useRouter();
  const homePageUrl = process.env.homePageUrl || '/';
  const isSelfHost =
    String(process.env.SELF_HOST || '').toLowerCase() === 'true';

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
      router.push(redirectUrl || '/');
    }
  }, [accessToken]);

  return (
    <>
      {isGoogleAuthEnabled && (
        <GoogleAuthHandler isGoogleAuthEnabled={isGoogleAuthEnabled} />
      )}
      <Flex
        justify="center"
        p="5xl"
        bg="background-secondary"
        h="100vh"
        align="baseline">
        <Box position="absolute" top="80px" left="80px">
          <Link href={homePageUrl}>
            <Box color="gray.0" fill="gray.1200">
              <BrandLogoIcon width="7rem" height="3rem" />
            </Box>
          </Link>
        </Box>
        <Flex variant="card" w="500px" justifySelf="center" direction="column">
          <Text as="h3" mb="lg" color="gray.1200" fontSize="lg">
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

          {isGoogleAuthEnabled && (
            <Flex mt="xl" w="100%" justifySelf="center" direction="column">
              <Button variant="secondary" onClick={() => signIn('gmail')}>
                <GoogleIcon width={18} />
                Login in with Google
              </Button>
            </Flex>
          )}

          {!isSelfHost && (
            <Box mt="24px" color="gray.1000" gap="8px" mb="xxl">
              Not a user yet?{' '}
              <Link href="/signup" variant="none">
                <Text cursor="pointer">Request invite</Text>
              </Link>
            </Box>
          )}
        </Flex>
      </Flex>
    </>
  );
};
export default LoginForm;
