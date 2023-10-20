import { FC } from 'react';
import EmailVerified from '../../../components/EmailVerified';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Flex, Box, Heading, Label, Input, Button, Text } from 'theme-ui';
import Logo from '../../../../public/Logo.svg';
import Link from '../../../components/NavLink';
export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';

const Index: FC = () => {
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState<string>('');
  const searchParams = useSearchParams();
  const email1 = searchParams.get('email');

  useEffect(() => {
    if (email1 !== null) {
      setEmail(email1);
    }
  }, [email1]);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(JSON.stringify({ email: email }));
    try {
      const response = await fetch(`${API_HOST}/api/v1/user/password/forgot`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, first_time_setup: true }),
      });

      if (!response.ok) {
        // Handle non-2xx status codes
        const errorData = await response.json(); // Parse error response
        // Handle the error data as needed (e.g., display an error message to the user)
        console.error('Error:q', errorData);
        // You can also throw a custom error if needed
        throw new Error('Password reset request failed');
      } else {
        // Handle a successful response (if needed)
        const responseData = await response.json();
        console.log('Response:', responseData);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Network error:', error);
      // You can display a generic error message to the user
      // or perform other error-handling actions.
    }
  };

  return (
    <>
      {verified ? (
        <Flex variant="onboardingFormPage">
          <Box sx={{ position: 'absolute', top: '80px', left: '80px' }}>
            <Link href="/">
              <Image
                width={116}
                height={35}
                src={Logo}
                alt="Wraft Logo"
                className=""
                priority
              />
            </Link>
          </Box>

          <Flex variant="onboardingForms" sx={{ justifySelf: 'center' }}>
            <Heading as="h3" variant="styles.h3" sx={{ mb: '18px' }}>
              New Password
            </Heading>

            <Text
              as="p"
              sx={{
                fontWeight: 'heading',
                color: 'dark_400',
                mb: '48px',
              }}>
              We will send you a verification link to your registered email.
            </Text>
            <Box as="form" onSubmit={handleForgot}>
              <Label htmlFor="email">Enter your email</Label>
              <Input
                type="email"
                id="email1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                mb={'24px'}
              />

              <Button type="submit">Next</Button>
            </Box>
          </Flex>
        </Flex>
      ) : (
        <EmailVerified setVerified={setVerified} />
      )}
    </>
  );
};

export default Index;
