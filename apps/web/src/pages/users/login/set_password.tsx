import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Box, Heading, Button, Text } from 'theme-ui';
import { z } from 'zod';
import { BrandLogoIcon } from '@wraft/icon';

import PasswordCreated from 'components/PasswordCreated';
import Field from 'common/Field';
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
          <Flex variant="onboardingFormPage">
            <Box sx={{ position: 'absolute', top: '80px', left: '80px' }}>
              <Link href="/">
                <Box sx={{ color: `gray.0`, fill: 'gray.1200' }}>
                  <BrandLogoIcon width="7rem" height="3rem" />
                </Box>
              </Link>
            </Box>
            <Flex variant="onboardingForms" sx={{ justifySelf: 'center' }}>
              <Heading as="h3" variant="styles.h3Medium" sx={{ mb: '48px' }}>
                New Password
              </Heading>

              <Text sx={{ mb: '28px' }}>
                Create a password for your Wraft account
              </Text>

              <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                <Field
                  name="newPassword"
                  label="Enter Password"
                  register={register}
                  type="password"
                  error={errors.newPassword}
                  mb={'24px'}
                />
                <Field
                  register={register}
                  error={errors.confirmPassword}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  mb={'12px'}
                />
                <Button type="submit">Create Password</Button>
              </Box>
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
