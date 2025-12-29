import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Box, Button, Text, Field, PasswordInput } from '@wraft/ui';
import { z } from 'zod';
import { BrandLogoIcon } from '@wraft/icon';

import PasswordCreated from 'components/Auth/PasswordCreated';
import Link from 'common/NavLink';
import { postAPI } from 'utils/models';
import { addFieldIssue, passwordPattern } from 'utils/zodPatterns';

const schema = z
  .object({
    newPassword: passwordPattern,
    confirmPassword: z.string().min(1, { message: 'Enter confirm password' }),
  })
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      addFieldIssue('confirmPassword', ctx);
    }
  });

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};
const Index = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onSubmit', resolver: zodResolver(schema) });
  const [verified, setVerified] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const homePageUrl = process.env.homePageUrl || '/';

  const onSubmit = (data: FormValues) => {
    if (data.newPassword === data.confirmPassword) {
      const setPasswordRequest = postAPI('users/set_password', {
        token: token,
        password: data.newPassword,
        confirm_password: data.confirmPassword,
      });

      toast.promise(setPasswordRequest, {
        loading: 'Loading...',
        success: () => {
          setVerified(true);
          return 'Successfully setted new Password';
        },
        error: () => {
          return 'Failed to set new Password';
        },
      });
    }
  };

  return (
    <>
      {token ? (
        verified ? (
          <PasswordCreated />
        ) : (
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

            <Flex
              variant="card"
              w="500px"
              justifySelf="center"
              direction="column">
              <Text as="h3" mb="md" fontSize="3xl">
                New Password
              </Text>

              <Text as="p" color="text-secondary" mb="xxl">
                Create a password for your Wraft account
              </Text>

              <Flex
                direction="column"
                as="form"
                gap="md"
                onSubmit={handleSubmit(onSubmit)}>
                <Field
                  label="New Password"
                  required
                  error={errors?.newPassword?.message}>
                  <PasswordInput
                    autoComplete="off"
                    {...register('newPassword')}
                    placeholder="Enter your New Password"
                  />
                </Field>
                <Field
                  label="Confirm Password"
                  required
                  error={errors?.confirmPassword?.message}>
                  <PasswordInput
                    autoComplete="off"
                    placeholder="Enter your Confirm Password"
                    {...register('confirmPassword')}
                  />
                </Field>
                <Box>
                  <Button type="submit">Create Password</Button>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        )
      ) : (
        <p>The page you are trying to get to is not available</p>
      )}
    </>
  );
};

export default Index;
