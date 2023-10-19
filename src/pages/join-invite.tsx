import { Label, Input, Heading, Checkbox } from 'theme-ui';
import { Box, Flex, Text, Button } from 'theme-ui';
import Image from 'next/image';

import { useForm } from 'react-hook-form';
import Link from '../components/NavLink';
import { Spinner } from 'theme-ui';

import Logo from '../../public/Logo.svg';
import GoogleLogo from '../../public/GoogleLogo.svg';

const index = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
        <Heading as="h3" variant="styles.h3Medium" sx={{ mb: '48px' }}>
          Sign in
        </Heading>

        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="email" sx={{ mb: '4px', color: 'dark_600' }}>
            Email
          </Label>
          <Input
            type="text"
            id="email"
            defaultValue="wraftuser@gmail.com"
            {...register('email', { required: true })}
            mb={'24px'}
            color={'nuetral_nuetral'}
          />

          <Label htmlFor="password" sx={{ mb: '4px', color: 'dark_600' }}>
            Password
          </Label>
          <Input
            id="password"
            // name="password"
            defaultValue="password"
            type={'password'}
            // ref={register({ required: true })}
            {...register('password', { required: true })}
            mb={'12px'}
          />
          {errors.exampleRequired && <Text>This field is required</Text>}
          <Flex
            sx={{
              alignItems: 'center',
              mb: '28px',
              justifyContent: 'space-between',
            }}>
            {/* {error ? (
              <Text sx={{ color: 'warning_300' }}>
                Email or password entered is incorrect
              </Text>
            ) : (
              <Flex>
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
            )} */}
            <Link href="/resetpassword">
              <Text
                sx={{
                  textDecoration: 'none',
                  color: 'dark_900',
                  fontWeight: 'heading',
                }}>
                Forgot Password?
              </Text>
            </Link>
          </Flex>

          <Button type="submit" variant="buttonPrimary">
            <Flex sx={{ alignItems: 'center', gap: '4px' }}>
              Sign in
              {loading && <Spinner color="white" width={18} height={18} />}
            </Flex>
          </Button>
        </Box>

        <Box
          sx={{
            minHeight: '1px',
            maxHeight: '1px',
            margin: '48px 0',
            backgroundColor: 'border',
          }}
        />

        <Button onClick={handleGoogleSignIn} variant="googleLogin">
          <img src={GoogleLogo} alt="" />
          Continue with Google
        </Button>

        <Flex sx={{ alignItems: 'center', mt: '24px', color: 'dark_600' }}>
          Already joined? {''}
          <Link href="/signup">
            <Text
              sx={{
                color: 'dark_600',
                fontWeight: 'bold',
              }}>
              SignIn
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default index;
