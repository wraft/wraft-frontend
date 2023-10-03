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
} from 'theme-ui';
import Logo from '../../public/Logo.svg';
import GoogleLogo from '../../public/GoogleLogo.svg';
import WaitlistPrompt from '../components/WaitlistPrompt';
import SignupVerification from '../components/SignupVerification';
export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';
import { Spinner } from 'theme-ui';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  // State variable for conditional rendering
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccess1, setShowSuccess1] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateShowSuccess1 = (newValue: boolean) => {
    setShowSuccess1(newValue);
  };

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
      setFormData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });

      //   try {
      //     setLoading(true);
      //     console.log(JSON.stringify({ token: token, password: newPassword }));
      //     const response = await fetch(`${API_HOST}/api/v1/user/password/reset`, {
      //       method: 'POST',
      //       headers: {
      //         Accept: 'application/json',
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({ token: token, password: newPassword }),
      //     });

      //     if (!response.ok) {
      //       const errorData = await response.json();
      //       console.error('Error:q', errorData);
      //       // You can also throw a custom error if needed
      //       throw new Error('Password reset request failed');
      //     } else {
      //       // Handle a successful response (if needed)
      //       const responseData = await response.json();
      //       console.log(responseData);
      //       // setResetPasswordSuccess(responseData);
      //       setLoading(false);
      //       setTimeout(() => {
      //         // router.push('/');
      //       }, 4000);
      //     }
      //   } catch (error) {
      //     // Handle network errors or other exceptions
      //     console.error('Network error:', error);
      //     setLoading(false);
      //     // setResetPasswordSuccess(undefined);
      //   }

      setShowSuccess(true);
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

  if (showSuccess) {
    if (!showSuccess1) {
      return <WaitlistPrompt updateShowSuccess1={updateShowSuccess1} />;
    }
    return <SignupVerification />;
  }

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

        <Text as="p" sx={{ mt: 4, color: 'dark_600', mb: '4px' }}>
          Already a member?
          <Link
            href="/"
            sx={{
              textDecoration: 'none',
              color: 'dark_600',
              fontWeight: 'bold',
              pl: 0,
            }}>
            Sign in {''}
            {loading && <Spinner color="white" width={18} height={18} />}
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
  );
};

export default SignUpPage;
