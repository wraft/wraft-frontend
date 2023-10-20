/* eslint-disable @typescript-eslint/no-unused-vars */
/** @jsxImportSource theme-ui */

import { useEffect, useState } from 'react';
import { Box, Flex, Text, Button } from 'theme-ui';
import Router from 'next/router';
import Image from 'next/image';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { Label, Input, Heading } from 'theme-ui';

import { useForm } from 'react-hook-form';
import Link from '../components/NavLink';
import { userLogin } from '../utils/models';
import { Spinner } from 'theme-ui';

import Logo from '../../public/Logo.svg';

export interface IField {
  name: string;
  value: string;
}

const UserLoginForm = () => {
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();
  const token = useStoreState((state) => state.auth.token);
  const setToken = useStoreActions((actions: any) => actions.auth.addToken);
  const [loading, setLoading] = useState<boolean>(false);
  const [_error, setError] = useState<boolean>(false);
  const [showPassword, _setShowPassword] = useState(false);

  const onSubmit = (data: any) => {
    setLoading(true);
    setError(false);
    userLogin(data, ProxyToken, handleError);
  };

  const ProxyToken = (t: string) => {
    console.log(t);
    setToken(t);
    setLoading(false);
  };

  const handleError = (error: any) => {
    setError(true);
    console.error('Login error: vb', error);
    setLoading(false);
  };

  useEffect(() => {
    if (token && token.length > 10) {
      Router.push('/');
    }
  }, [token]);

  return (
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

        <Text sx={{ color: 'dark_900', mb: '24px' }}>
          You have been invited by{' '}
          <Text sx={{ fontWeight: 'bold' }}> ‘Litmus Blue’</Text> software
          company to join the team to improve the workflow
        </Text>

        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Flex sx={{ gap: '16px', marginBottom: '24px' }}>
            <Box sx={{ flex: '1 1 264px' }}>
              <Label htmlFor="firstName" sx={{ mb: '4px', color: 'dark_300' }}>
                First Name
              </Label>
              <Input
                type="text"
                id="firstName"
                {...register('firstName', { required: true })}
                color={'nuetral_nuetral'}
                mb={'0px'}
              />
            </Box>
            <Box sx={{ flex: '1 1 auto' }}>
              <Label htmlFor="lastName" sx={{ mb: '4px', color: 'dark_300' }}>
                Last Name
              </Label>
              <Input
                type="text"
                id="lastName"
                {...register('lastName', { required: true })}
                color={'nuetral_nuetral'}
                mb={'0px'}
              />
            </Box>
          </Flex>

          <Label htmlFor="email" sx={{ mb: '4px', color: 'dark_300' }}>
            Email
          </Label>
          <Input
            type="text"
            id="email"
            defaultValue=""
            {...register('email', { required: true })}
            mb={'24px'}
            color={'nuetral_nuetral'}
          />

          <Label htmlFor="password" sx={{ mb: '4px', color: 'dark_300' }}>
            Create Password
          </Label>
          <Input
            id="password"
            // name="password"
            defaultValue=""
            type={showPassword ? 'text' : 'password'}
            // ref={register({ required: true })}
            {...register('password', { required: true })}
            mb={'24px'}
          />
          {/* {errors.exampleRequired && <Text>This field is required</Text>} */}
          <Flex sx={{ width: '100%', gap: '39px', mb: '24px' }}>
            <Button type="submit" variant="buttonPrimary">
              <Flex sx={{ alignItems: 'center', gap: '4px' }}>
                Accept Invitation
                {loading && <Spinner color="white" width={18} height={18} />}
              </Flex>
            </Button>
            <Flex sx={{ alignItems: 'center', color: 'dark_600' }}>
              <Text>Already joined?</Text>
              <Link href="/signup">
                <Text
                  sx={{
                    color: 'dark_600',
                    fontWeight: 'bold',
                  }}>
                  Sign In
                </Text>
              </Link>
            </Flex>
          </Flex>
        </Box>

        <Text as="p" sx={{ color: 'dark_300', mb: '24px' }}>
          By Joining the waiting list, I agree to Wraf&apos;s{' '}
          <Link href="">
            <Text sx={{ color: 'dark_300', textDecoration: 'underline' }}>
              Privacy Policy.
            </Text>
          </Link>
        </Text>
        <Text sx={{ fontSize: '12px', color: 'dark_300', lineHeight: '18px' }}>
          Welcome to Wraft! We are thrilled to have you join our community of
          professionals who rely on our document generation tool to save time
          and improve their workflow.
        </Text>
      </Flex>
    </Flex>
  );
};
export default UserLoginForm;
