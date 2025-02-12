import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Text, Field, InputText } from '@wraft/ui';
import { BrandLogoIcon } from '@wraft/icon';
import { Button } from '@wraft/ui';

import Link from 'common/NavLink';
import { Registration, RegistrationSchema } from 'schemas/registration';
import { registerUser, verifyInvite } from 'utils/models';

export interface IField {
  name: string;
  value: string;
}

interface RegistrationFormProps {
  inviteToken: string | null;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ inviteToken }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Registration>({
    mode: 'onSubmit',
    resolver: zodResolver(RegistrationSchema),
  });

  const homePageUrl = process.env.homePageUrl || '/';
  const [verifyData, setVerifyData] = useState<any>();

  const router = useRouter();

  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (inviteToken) {
      verifyInviteToken(inviteToken);
    }
  }, [inviteToken]);

  const verifyInviteToken = async (token: any) => {
    try {
      const response = await verifyInvite(token);

      setVerifyData(response);
    } catch (error) {
      toast.error(error.response?.data || error.message || 'invailed token', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const onSubmit = async (data: Registration) => {
    try {
      const formData = new FormData();
      formData.append('name', `${data.firstName} ${data.lastName}`);
      formData.append('email', data.email);
      formData.append('password', data.password);

      await registerUser(formData, inviteToken);
      router.replace(`/login`);

      toast.success(
        'Verify your email to continue. A mail has been sent to your Email',
        {
          duration: 3000,
          position: 'top-right',
        },
      );
    } catch (error) {
      toast.error('Could not sign up. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  return (
    <>
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
          <Text as="h3" mb="md" fontSize="3xl">
            Invitation to join
          </Text>

          <Text as="p" color="text-secondary" mb="xxl">
            You have been invited to join
            <Text as="span" fontWeight="bold" display="inline" px="xs">
              {verifyData?.organisation?.name}
            </Text>{' '}
            Organisation
          </Text>

          <Flex
            direction="column"
            gap="md"
            as="form"
            onSubmit={handleSubmit(onSubmit)}>
            <Flex gap="sm">
              <Box flex="1 1 264px">
                <Field
                  label="First Name"
                  required
                  error={errors?.firstName?.message}>
                  <InputText
                    {...register('firstName')}
                    placeholder="Enter your first name"
                  />
                </Field>
              </Box>
              <Box flex="1 1 auto">
                <Field
                  label="Last Name"
                  required
                  error={errors?.lastName?.message}>
                  <InputText
                    {...register('lastName')}
                    placeholder="Enter your last name"
                  />
                </Field>
              </Box>
            </Flex>
            <Field
              label="Email"
              required
              error={errors?.email?.message}
              disabled={true}>
              <InputText
                type="email"
                value={email || ''}
                {...register('email')}
                placeholder="Enter your email address"
              />
            </Field>
            <Field
              label="Enter New Password"
              required
              error={errors?.password?.message}>
              <InputText
                {...register('password')}
                placeholder="Enter New Password"
              />
            </Field>

            <Flex
              w="100%"
              gap="39px"
              mb="xl"
              mt="sm"
              justifyContent="space-between">
              <Button type="submit">Accept Invitation</Button>
              <Flex alignItems="center" color="text-secondary" gap="xs">
                <Text>Already joined?</Text>
                <Link href="/login">
                  <Text color="primary">Sign In</Text>
                </Link>
              </Flex>
            </Flex>
          </Flex>

          <Flex gap="sm" mt="md">
            <Text as="p" color="text-secondary" mb="md">
              By Joining the waiting list, I agree to Wraft&apos;s{' '}
            </Text>
            <Link href="/">
              <Text color="primary">Privacy Policy.</Text>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default RegistrationForm;
