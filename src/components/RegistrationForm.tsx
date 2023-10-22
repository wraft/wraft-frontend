/* eslint-disable @typescript-eslint/no-unused-vars */
/** @jsxImportSource theme-ui */

import { useState, ChangeEvent } from 'react';
import { Box, Flex, Text, Button } from 'theme-ui';
export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';
import Image from 'next/image';
import { Label, Input, Heading } from 'theme-ui';
import Link from './NavLink';
import { Spinner } from 'theme-ui';
import Logo from '../../public/Logo.svg';
import Router from 'next/router';

export interface IField {
  name: string;
  value: string;
}

interface RegistrationFormProps {
  inviteToken: string | null;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ inviteToken }) => {
  const [showPassword, _setShowPassword] = useState(false);
  // console.log(token1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // State variable for conditional rendering
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    // console.log(formData)
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(formData);
    if (
      isValidEmail(formData.email) &&
      formData.firstName.length !== 0 &&
      formData.lastName.length !== 0
    ) {
      // setFormData({
      //   firstName: formData.firstName,
      //   lastName: formData.lastName,
      //   email: formData.email,
      // });

      try {
        setLoading(true);
        const response = await fetch(`${API_HOST}/api/v1/users/signup/`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: inviteToken,
            name: formData.firstName,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error:q', errorData);

          alert(errorData.errors.email[0]);

          // You can also throw a custom error if needed
          throw new Error('Password reset request failed');
        } else {
          // Handle a successful response (if needed)
          const responseData = await response;
          console.log(responseData);
          // setResetPasswordSuccess(responseData);
          setLoading(false);
          Router.push('/login');
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error('Network error1:', error);
        setLoading(false);
        // setResetPasswordSuccess(undefined);
      }
    } else {
      alert('fill the inputs currectly');
    }
  };

  const isValidEmail = (email: string): boolean => {
    // Simple email validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

        <Box as="form" onSubmit={handleSubmit}>
          <Flex sx={{ gap: '16px', marginBottom: '24px' }}>
            <Box sx={{ flex: '1 1 264px' }}>
              <Label htmlFor="firstName" sx={{ mb: '4px', color: 'dark_300' }}>
                First Name
              </Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
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
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
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
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
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
              <Link href="/login">
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
export default RegistrationForm;
