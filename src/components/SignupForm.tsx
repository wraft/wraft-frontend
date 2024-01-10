import { useState, ChangeEvent } from 'react';

import Image from 'next/image';
import {
  Flex,
  Box,
  Heading,
  Label,
  Input,
  Button,
  Text,
  Link,
  Divider,
  Spinner,
} from 'theme-ui';

import GoogleLogo from '../../public/GoogleLogo.svg';
import Logo from '../../public/Logo.svg';
import WaitlistPrompt from '../components/WaitlistPrompt';

export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  // State variable for conditional rendering
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    // console.log(formData)
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(formData.email);
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
        const response = await fetch(`${API_HOST}/api/v1/waiting_list`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            last_name: formData.lastName,
            first_name: formData.firstName,
            email: formData.email,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error:q', errorData);

          alert(errorData.errors.email[0]);

          // You can also throw a custom error if needed
          throw new Error('Password reset request failed');
        } else {
          setShowSuccess(true);
          // Handle a successful response (if needed)
          const responseData = await response;
          console.log(responseData);
          // setResetPasswordSuccess(responseData);
          setLoading(false);
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

            <Box as="form" onSubmit={handleSubmit}>
              <Flex sx={{ gap: '16px', marginBottom: '24px' }}>
                <Box sx={{ flex: '1 1 264px' }}>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    color="border"
                  />
                </Box>
                <Box sx={{ flex: '1 1 auto' }}>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    color="border"
                  />
                </Box>
              </Flex>
              <Box sx={{ marginBottom: '32px' }}>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  color="border"
                />
              </Box>
              <Button type="submit">
                Join waitlist {''}
                {loading && <Spinner color="white" width={18} height={18} />}
              </Button>
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

            <Text as="p" sx={{ mt: 4, color: 'gray.600', mb: '4px' }}>
              Already a member?
              <Link
                href="/login"
                sx={{
                  textDecoration: 'none',
                  color: 'gray.600',
                  fontWeight: 'bold',
                  pl: 0,
                }}>
                Sign in
              </Link>
            </Text>
            <Text as="p">
              By Joining the waiting list, I agree to Wraf&apos;s{' '}
              <Link href="" sx={{ color: 'text' }}>
                Privacy Policy.
              </Link>
            </Text>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default SignUpPage;
