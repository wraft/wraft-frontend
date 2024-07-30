import { useState } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Box, Heading, Button, Text, Link } from 'theme-ui';
import { z } from 'zod';

import GoogleLogo from '../../public/GoogleLogo.svg';
import WaitlistPrompt from '../components/WaitlistPrompt';
import { postAPI } from '../utils/models';
import { emailPattern } from '../utils/zodPatterns';
import Field from './Field';
import { BrandLogo } from './Icons';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};
const schema = z.object({
  firstName: z.string().min(1, { message: 'Please enter your first name' }),
  lastName: z.string().min(1, { message: 'Please enter your last name' }),
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
      error: (error) => error.errors,
    });
    console.log(waitingListRequest, 'log');
  };

  const handleGoogleSignIn = () => {
    signIn('gmail');
  };

  return (
    <>
      {showSuccess ? (
        <WaitlistPrompt />
      ) : (
        <Flex variant="onboardingFormPage">
          <Box sx={{ position: 'absolute', top: '80px', left: '80px' }}>
            <Link href="/">
              <Box sx={{ color: `gray.0`, fill: 'gray.1200' }}>
                <BrandLogo width="7rem" height="3rem" />
              </Box>
            </Link>
          </Box>
          <Flex variant="onboardingForms" sx={{ justifySelf: 'center' }}>
            <Heading
              as="h3"
              variant="styles.h3Medium"
              sx={{ mb: '48px', color: 'green.900' }}>
              Join Wraft
            </Heading>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <Flex sx={{ gap: '16px', marginBottom: '24px' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Field
                    label="First Name"
                    name="firstName"
                    register={register}
                    error={errors.firstName}
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
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
            <Box
              sx={{
                borderBottom: '1px solid',
                borderColor: 'border',
                my: '36px',
              }}
            />
            {/* <Button onClick={handleGoogleSignIn} variant="googleLogin">
              <Image
                src={GoogleLogo}
                alt="Google Logo"
                width={24}
                height={24}
                className=""
              />
              Continue using Google
            </Button> */}
            <Flex
              sx={{ gap: '8px', mt: '12px', mb: '4px', alignItems: 'center' }}>
              <Text as="p" variant="pR">
                Already joined?
              </Text>
              <Link href="/login" variant="none">
                <Text variant="pB">Sign in</Text>
              </Link>
            </Flex>
            <Text as="p" variant="pR" mt={2}>
              By Joining the waiting list, I agree to Wraft&apos;s{' '}
              <Link href="" variant="none" sx={{ color: 'text' }}>
                <Text sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
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
