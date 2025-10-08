import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Box, Button, Text, Field, InputText } from '@wraft/ui';
import { BrandLogoIcon } from '@wraft/icon';
import styled from '@emotion/styled';

import Link from 'common/NavLink';
import ErrorMessages from 'common/ErrorMessages';
import { SignUpSchema, SignUp } from 'schemas/auth';
import { postAPI } from 'utils/models';

import WaitlistPrompt from './WaitlistPrompt';

const NameFields = styled(Flex)`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ResponsiveLogo = styled(BrandLogoIcon)`
  width: 7rem;
  height: 3rem;

  @media (max-width: 768px) {
    width: 5rem;
    height: 2rem;
  }

  @media (max-width: 480px) {
    width: 5rem;
    height: 1.8rem;
  }
`;

const LogoWrapper = styled(Box)`
  position: absolute;
  top: 80px;
  left: 80px;

  @media (max-width: 1024px) {
    top: 60px;
    left: 40px;
  }

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    left: 0;
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding-left: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    padding-left: 12px;
    margin-bottom: 20px;
  }
`;

const FormCard = styled(Flex)`
  width: 500px;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  padding: 32px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    max-width: 95%;
    padding: 20px;
  }
`;

const PageWrapper = styled(Flex)`
  justify-content: center;
  align-items: flex-start;
  padding: 6rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
  }
`;

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUp>({
    mode: 'onSubmit',
    resolver: zodResolver(SignUpSchema),
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const homePageUrl = process.env.homePageUrl || '/';

  const onSubmit = (data: SignUp) => {
    const waitingListRequest = postAPI('waiting_list', data);
    toast.promise(
      waitingListRequest,
      {
        loading: 'Loading...',
        success: () => {
          setShowSuccess(true);
          return 'Successfully added to waiting list';
        },
        error: (err) => <ErrorMessages errors={err?.errors} />,
      },
      {
        duration: 6000,
        position: 'top-right',
      },
    );
  };

  return (
    <>
      {showSuccess ? (
        <WaitlistPrompt />
      ) : (
        <PageWrapper>
          <LogoWrapper>
            <Link href={homePageUrl}>
              <Box color="gray.0" fill="gray.1200">
                <ResponsiveLogo />
              </Box>
            </Link>
          </LogoWrapper>

          <FormCard variant="card">
            <Text as="h3" mb="48px" color="gray.1200" fontSize="3xl">
              Join Wraft
            </Text>

            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <NameFields>
                <Box flexGrow="1">
                  <Field
                    label="First Name"
                    required
                    error={errors?.first_name?.message}>
                    <InputText
                      {...register('first_name')}
                      placeholder="Enter your first name"
                    />
                  </Field>
                </Box>
                <Box flexGrow="1">
                  <Field
                    label="Last Name"
                    required
                    error={errors?.last_name?.message}>
                    <InputText
                      {...register('last_name')}
                      placeholder="Enter your last name"
                    />
                  </Field>
                </Box>
              </NameFields>

              <Box mt="-sm" mb="30px">
                <Field label="Email" required error={errors?.email?.message}>
                  <InputText
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email address"
                  />
                </Field>
              </Box>
              <Button type="submit">Join waitlist</Button>
            </Box>

            <Box borderBottom="1px solid" borderColor="border" my="36px" />
            <Flex gap="8px" mt="12px" mb="4px" alignItems="center">
              <Text as="p">Already joined?</Text>
              <Link href="/login">
                <Text color="primary">Sign in</Text>
              </Link>
            </Flex>
            <Text as="div" mt={2}>
              By Joining the waiting list, I agree to Wraft&apos;s{' '}
              <Link href="">
                <Text color="primary">Privacy Policy.</Text>
              </Link>
            </Text>
          </FormCard>
        </PageWrapper>
      )}
    </>
  );
};

export default SignupForm;
