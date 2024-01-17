import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import cookie from 'js-cookie';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Text, Button, Heading, Label, Checkbox } from 'theme-ui';
import { z } from 'zod';

import Logo from '../../public/Logo.svg';
import { postAPI } from '../utils/models';
import { emailPattern, passwordPattern } from '../utils/zodPatterns';

import Field from './Field';
import Link from './NavLink';

export interface IField {
  name: string;
  value: string;
}

interface RegistrationFormProps {
  inviteToken: string | null;
}

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const schema = z.object({
  firstName: z.string().min(1, { message: 'First Name has to be filled.' }),
  lastName: z.string().min(1, { message: 'Last Name has to be filled.' }),
  email: emailPattern,
  password: passwordPattern,
});

const RegistrationForm: React.FC<RegistrationFormProps> = ({ inviteToken }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onBlur', resolver: zodResolver(schema) });

  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('name', data.firstName + ' ' + data.lastName);
    formData.append('email', data.email);
    formData.append('password', data.password);

    const signupRequest = postAPI(
      `users/signup/?token=${inviteToken}`,
      formData,
    );

    toast.promise(signupRequest, {
      loading: 'Loading...',
      success: () => {
        setSuccess(true);
        cookie.remove('inviteCookie');
        return <b>Signed up Successfully</b>;
      },
      error: () => {
        cookie.remove('inviteCookie');
        return <b>Could not Signup.</b>;
      },
    });
  };

  return (
    <>
      {success ? (
        <Box>
          <Text>
            Verify your email to continue. An mail has been sent to your Email
          </Text>
        </Box>
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
            <Heading as="h3" variant="styles.h3Medium" sx={{ mb: '12px' }}>
              Invitation to join
            </Heading>

            <Text sx={{ color: 'gray.900', mb: '24px' }}>
              You have been invited by{' '}
              <Text sx={{ fontWeight: 'bold' }}> ‘Litmus Blue’</Text> software
              company to join the team to improve the workflow
            </Text>

            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <Flex sx={{ gap: '16px', marginBottom: '24px' }}>
                <Box sx={{ flex: '1 1 264px' }}>
                  <Field
                    name="firstName"
                    label="First Name"
                    register={register}
                    error={errors.firstName}
                  />
                </Box>
                <Box sx={{ flex: '1 1 auto' }}>
                  <Field
                    name="lastName"
                    label="First Name"
                    register={register}
                    error={errors.lastName}
                  />
                </Box>
              </Flex>

              <Field
                label="Email"
                type="email"
                name="email"
                register={register}
                error={errors.email}
              />

              <Field
                name="password"
                label="Create Password"
                type={showPassword ? 'text' : 'password'}
                register={register}
                error={errors}
              />
              <Flex>
                <Label
                  sx={{
                    cursor: 'pointer',
                    color: 'gray.900',
                    fontWeight: 'body',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <Checkbox
                    checked={showPassword}
                    onChange={() => setShowPassword((prev) => !prev)}
                    sx={{
                      cursor: 'pointer',
                      color: 'gray.900',
                      width: '18px',
                      backgroundColor: 'white',
                      border: 'none',
                    }}
                  />
                  <Text variant="pM">Show Password</Text>
                </Label>
              </Flex>
              <Flex sx={{ width: '100%', gap: '39px', mb: '24px' }}>
                <Button type="submit" variant="buttonPrimary">
                  <Flex sx={{ alignItems: 'center', gap: '4px' }}>
                    Accept Invitation
                  </Flex>
                </Button>
                <Flex sx={{ alignItems: 'center', color: 'gray.600' }}>
                  <Text>Already joined?</Text>
                  <Link href="/login">
                    <Text
                      sx={{
                        color: 'gray.600',
                        fontWeight: 'bold',
                      }}>
                      Sign In
                    </Text>
                  </Link>
                </Flex>
              </Flex>
            </Box>

            <Text as="p" sx={{ color: 'gray.300', mb: '24px' }}>
              By Joining the waiting list, I agree to Wraf&apos;s{' '}
              <Link href="">
                <Text sx={{ color: 'gray.300', textDecoration: 'underline' }}>
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
export default RegistrationForm;
