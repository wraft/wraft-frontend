import { useState } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Box, Heading, Text } from 'theme-ui';
import { Button, Table } from '@wraft/ui';
import { MailIcon } from '@wraft/icon';

import CountdownTimer from 'components/common/CountDownTimer';
import Field from 'components/Field';
import Link from 'components/NavLink';
import { BrandLogo } from 'components/Icons';
import { postAPI } from 'utils/models';

type FormValues = {
  email: string;
};

const Index = () => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    setLoading(true);
    const forgotPasswordRequest = postAPI('user/password/forgot', {
      email: data.email,
      first_time_setup: false,
    });

    toast.promise(forgotPasswordRequest, {
      loading: 'Loading...',
      success: () => {
        setIsSent(true);
        return 'Operation completed successfully';
      },
      error: (err) => {
        const errorMessage = err.errors || 'An error occurred';
        return errorMessage;
      },
    });
    setLoading(false);
  };

  return (
    <Flex variant="onboardingFormPage">
      <Box sx={{ position: 'absolute', top: '80px', left: '80px' }}>
        <Link href="/">
          <Box sx={{ color: `gray.0`, fill: 'gray.1200' }}>
            <BrandLogo width="7rem" height="3rem" />
          </Box>
        </Link>
      </Box>

      {isSent && (
        <Flex
          variant="onboardingForms"
          sx={{
            alignItems: 'center',
            p: '0px',
            pt: '103px',
            px: '140px',
          }}>
          <MailIcon width={224} height={80} />
          <Heading
            as="h3"
            variant="styles.h3Medium"
            sx={{ mt: '12px', mb: '32px', color: '#363E49' }}>
            Check your Mail
          </Heading>
          <Text mb={3}>Password reset link has been sent to your email.</Text>
          <Button
            onClick={() => {
              Router.push('/');
            }}>
            Return to Home
          </Button>
        </Flex>
      )}

      {!isSent && (
        <Flex variant="onboardingForms" sx={{ justifySelf: 'center' }}>
          <Heading
            as="h3"
            variant="styles.h3Medium"
            sx={{ color: 'green.6', mb: '18px' }}>
            Reset password
          </Heading>

          <Text
            as="p"
            variant="pM"
            sx={{
              color: 'gray.900',
              mb: '48px',
            }}>
            We will send you a verification link to your registered email.
          </Text>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Field
              name="email"
              label="Enter your email"
              register={register}
              error={errors.email}
              type="email"
            />

            <Flex sx={{ justifyContent: 'space-between', mt: '24px' }}>
              <Button
                variant="primary"
                loading={isLoading}
                disabled={isLoading}
                type="submit">
                {isSent ? 'Resend Link' : 'Send Verification Link'}
              </Button>
              {isSent && <CountdownTimer setIsCounter={setIsSent} />}
            </Flex>
          </Box>
        </Flex>
      )}
    </Flex>
  );
};

export default Index;
