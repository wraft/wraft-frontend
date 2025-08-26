import { useState } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Box, Text, InputText, Field, Button } from '@wraft/ui';
import { BrandLogoIcon, MailIcon } from '@wraft/icon';
import { zodResolver } from '@hookform/resolvers/zod';

import CountdownTimer from 'components/common/CountDownTimer';
import Link from 'common/NavLink';
import { ForgetPassword, ForgetPasswordSchema } from 'schemas/auth';
import { postAPI } from 'utils/models';

const ForgetPasswordForm = () => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPassword>({ resolver: zodResolver(ForgetPasswordSchema) });

  const onSubmit = (data: ForgetPassword) => {
    setLoading(true);
    const forgotPasswordRequest = postAPI('user/password/forgot', {
      email: data.email,
      first_time_setup: false,
    });

    toast.promise(
      forgotPasswordRequest,
      {
        loading: 'Loading...',

        success: () => {
          setIsSent(true);
          return 'Operation completed successfully';
        },
        error: (err) => {
          const errorMessage = err.errors || 'An error occurred';
          return errorMessage;
        },
      },
      {
        position: 'top-right',
      },
    );
    setLoading(false);
  };

  return (
    <Flex
      justify="center"
      p="5xl"
      bg="background-secondary"
      h="100vh"
      align="baseline">
      <Box position="absolute" top="80px" left="80px">
        <Link href="/">
          <Box color="gray.0" fill="gray.1200">
            <BrandLogoIcon width="7rem" height="3rem" />
          </Box>
        </Link>
      </Box>

      {isSent && (
        <Flex
          alignItems="center"
          direction="column"
          p="0px"
          pt="103px"
          px="140px">
          <MailIcon width={224} height={80} className="main-icon" />
          <Text as="h3" fontSize="2xl">
            Check your Mail
          </Text>
          <Text mb="md" color="text-secondary">
            Password reset link has been sent to your email.
          </Text>
          <Button
            onClick={() => {
              Router.push('/');
            }}>
            Return to Home
          </Button>
        </Flex>
      )}

      {!isSent && (
        <Box variant="card">
          <Text as="h3" mb="lg" color="gray.1200" fontSize="3xl">
            Reset password
          </Text>

          <Text as="p" color="gray.900" mb="xl">
            We will send you a verification link to your registered email.
          </Text>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Field label="Email" required error={errors?.email?.message}>
              <InputText
                type="email"
                {...register('email')}
                placeholder="Enter your email address"
              />
            </Field>

            <Flex justifyContent="space-between" mt="lg">
              <Button variant="primary" loading={isLoading} type="submit">
                {isSent ? 'Resend Link' : 'Send Verification Link'}
              </Button>
              {isSent && <CountdownTimer setIsCounter={setIsSent} />}
            </Flex>
          </Box>
        </Box>
      )}
    </Flex>
  );
};

export default ForgetPasswordForm;
