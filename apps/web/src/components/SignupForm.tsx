import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Box, Heading, Button, Text, Link, Divider } from 'theme-ui';
import { z } from 'zod';

import GoogleLogo from '../../public/GoogleLogo.svg';
import Logo from '../../public/Logo.svg';
import WaitlistPrompt from '../components/WaitlistPrompt';
import { postAPI } from '../utils/models';
import { emailPattern } from '../utils/zodPatterns';

import Field from './Field';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};
const schema = z.object({
  firstName: z.string().min(1, { message: 'Please enter your first name' }),
  lastName: z.string().min(1, { message: 'Please enter your first name' }),
  email: emailPattern,
});

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onSubmit', resolver: zodResolver(schema) });
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = (data: FormValues) => {
    const body = {
      last_name: data.lastName,
      first_name: data.firstName,
      email: data.email,
    };
    const waitingListRequest = postAPI('waiting_list', body);
    toast.promise(waitingListRequest, {
      loading: 'Loading...',
      success: () => {
        setShowSuccess(true);
        return 'Successfully added to waiting list';
      },
      error: 'Failed to add to waiting list',
    });
  };

  const handleGoogleSignIn = () => {
    // Perform Google sign-in logic here
  };

  return (
    <>
      {showSuccess ? (
        <WaitlistPrompt />
      ) : (
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
            <Heading as="h3" variant="styles.h3" sx={{ mb: '48px' }}>
              Join Wraft
            </Heading>

            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <Flex sx={{ gap: '16px', marginBottom: '24px' }}>
                <Box sx={{ flex: '1 1 264px' }}>
                  <Field
                    label="First Name"
                    name="firstName"
                    register={register}
                    error={errors.firstName}
                  />
                </Box>
                <Box sx={{ flex: '1 1 auto' }}>
                  <Field
                    label="Last Name"
                    name="lastName"
                    register={register}
                    error={errors.lastName}
                  />
                </Box>
              </Flex>
              <Box sx={{ marginBottom: '32px' }}>
                <Field
                  type="email"
                  label="Email"
                  name="email"
                  register={register}
                  error={errors.email}
                />
              </Box>
              <Button type="submit">Join waitlist</Button>
            </Box>

            <Divider
              sx={{
                margin: '56px 0',
                color: 'rgba(0.141, 0.243, 0.286, 0.1)',
              }}
            />

            <Button onClick={handleGoogleSignIn} variant="googleLogin">
              <Image
                src={GoogleLogo}
                alt="Google Logo"
                width={23}
                height={24}
                className=""
              />
              Continue with Google
            </Button>

            <Flex sx={{ gap: '8px', mt: 4, mb: '4px', alignItems: 'center' }}>
              <Text as="p" variant="pR">
                Already a member?
              </Text>
              <Link href="/login" variant="none">
                <Text variant="pB">Sign in</Text>
              </Link>
            </Flex>
            <Text as="p" variant="pR">
              By Joining the waiting list, I agree to Wraf&apos;s{' '}
              <Link href="" variant="none" sx={{ color: 'text' }}>
                <Text variant="pB" sx={{ cursor: 'pointer' }}>
                  Privacy Policy.
                </Text>
              </Link>
            </Text>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default SignUpPage;
