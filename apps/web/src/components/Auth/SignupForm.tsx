import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Box, Button, Text, Field, InputText } from '@wraft/ui';
import { BrandLogoIcon } from '@wraft/icon';

import Link from 'common/NavLink';
import ErrorMessages from 'common/ErrorMessages';
import { SignUpSchema, SignUp } from 'schemas/auth';
import { postAPI } from 'utils/models';

import WaitlistPrompt from './WaitlistPrompt';

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
        <Flex justify="center" p="5xl">
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
            <Text as="h3" mb="48px" color="gray.1200" fontSize="3xl">
              Join Wraft
            </Text>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <Flex gap="16px" marginBottom="24px">
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
              </Flex>
              <Box marginBottom="32px">
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
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default SignupForm;
