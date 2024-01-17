import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Box, Heading, Label, Button, Text, Checkbox } from 'theme-ui';
import { z } from 'zod';

import Logo from '../../../../public/Logo.svg';
import Field from '../../../components/Field';
import Link from '../../../components/NavLink';
import PasswordCreated from '../../../components/PasswordCreated';
import { postAPI } from '../../../utils/models';
import { addFieldIssue, passwordPattern } from '../../../utils/zodPatterns';

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
  const [verified, setVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  console.log(token);

  const onSubmit = (data: FormValues) => {
    if (data.newPassword === data.confirmPassword) {
      const setPasswordRequest = postAPI('users/set_password', {
        token: token,
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      toast.promise(setPasswordRequest, {
        loading: 'Loading...',
        success: () => {
          return 'Successfully setted new Password';
          setVerified(true);
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
                <Image
                  width={116}
                  height={35}
                  src={Logo}
                  alt="Wraft Logo"
                  className=""
                  priority
                />
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
                  error={errors.newPassword}
                  mb={'24px'}
                />
                <Field
                  register={register}
                  error={errors.confirmPassword}
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  mb={'12px'}
                />
                <Flex sx={{ mb: '28px' }}>
                  <Label
                    sx={{
                      color: 'gray.900',
                      fontWeight: 'body',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                    <Checkbox
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      sx={{
                        color: 'gray.900',
                        width: '18px',
                        backgroundColor: 'white',
                        border: 'none',
                      }}
                    />
                    Show Password
                  </Label>
                </Flex>

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
