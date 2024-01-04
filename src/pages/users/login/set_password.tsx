import { useState } from 'react';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Flex,
  Box,
  Heading,
  Label,
  Input,
  Button,
  Text,
  Checkbox,
} from 'theme-ui';
import { Spinner } from 'theme-ui';

import Logo from '../../../../public/Logo.svg';
import Link from '../../../components/NavLink';
import PasswordCreated from '../../../components/PasswordCreated';

export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';

const Index = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  console.log(token);

  // const { query } = useRouter();
  // console.log(query.token);
  // const router = useRouter();
  // const userToken1 = query.token;
  // const userToken: string = (query.token as string).split('token=')[1];
  // console.log(userToken1);
  //   const router = useRouter();
  //   const { token } = router.query;
  //   console.log(token);

  // Check if 'token' exists before accessing it
  // if (typeof token === 'string') {
  //   userToken = token.split('token=')[1];
  //   console.log('userToken:', userToken);
  // } else {
  //   console.log('Token not found in URL.');
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword(newPassword, confirmPassword)) {
      try {
        setLoading(true);
        console.log(
          JSON.stringify({
            token: token,
            password: newPassword,
            confirm_password: newPassword,
          }),
        );
        const response = await fetch(`${API_HOST}/api/v1/users/set_password`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token,
            password: newPassword,
            confirm_password: newPassword,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error:q', errorData);
          // You can also throw a custom error if needed
          throw new Error('Password reset request failed');
        } else {
          // Handle a successful response (if needed)
          const responseData = await response.json();
          console.log(responseData);
          setLoading(false);
          setVerified(true);
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error('Network error:', error);
        setLoading(false);
      }
    }
  };

  const validatePassword = (
    newPassword: string,
    confirmPassword: string,
  ): boolean => {
    return newPassword === confirmPassword;
  };

  return (
    <>
      {token ? (
        verified ? (
          <PasswordCreated />
        ) : (
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
              <Heading as="h3" variant="styles.h3Medium" sx={{ mb: '48px' }}>
                New Password
              </Heading>

              <Text sx={{ mb: '28px' }}>
                Create a password for your Wraft account
              </Text>

              <Box as="form" onSubmit={handleSubmit}>
                <Label htmlFor="New password">Enter password</Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  mb={'24px'}
                />

                <Label htmlFor="Confirm password">Confirm password</Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  mb={'12px'}
                />
                <Flex sx={{ mb: '28px' }}>
                  <Label
                    sx={{
                      color: 'dark_900',
                      fontWeight: 'body',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                    <Checkbox
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      sx={{
                        color: 'dark_900',
                        width: '18px',
                        backgroundColor: 'white',
                        border: 'none',
                      }}
                    />
                    Show Password
                  </Label>
                </Flex>

                <Button type="submit">
                  Create Password{' '}
                  {loading && <Spinner color="white" width={18} height={18} />}
                </Button>
              </Box>
            </Flex>
          </Flex>
        )
      ) : (
        <p>The page you are trying to get to is not available</p>
      )}
    </>
  );
};

export default Index;
