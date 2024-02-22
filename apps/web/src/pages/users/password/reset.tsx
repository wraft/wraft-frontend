import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Box, Heading, Button } from 'theme-ui';
import { z } from 'zod';

import Field from 'components/Field';
import Link from 'components/NavLink';
import { postAPI } from 'utils/models';
import { addFieldIssue, passwordPattern } from 'utils/zodPatterns';

import Logo from '../../../../public/Logo.svg';

const schema = z
  .object({
    newPassword: passwordPattern,
    confirmPassword: z.string().min(1, { message: 'Enter confirm password' }),
  })
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      addFieldIssue('confirmPassword', ctx);
    }
  });

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

const Index = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onSubmit', resolver: zodResolver(schema) });

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = (data: FormValues) => {
    if (data.newPassword == data.confirmPassword) {
      const body = {
        token: token,
        password: data.newPassword,
      };
      const resetPasswordRequest = postAPI('user/password/reset', body);
      toast.promise(resetPasswordRequest, {
        loading: 'Loading...',
        success: 'Password reset successful',
        error: 'Failed to reset password',
      });
    }
  };

  return (
    <>
      {token ? (
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
            <Heading as="h3" variant="styles.h3" sx={{ mb: '64px' }}>
              Reset password
            </Heading>

            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <Field
                label="New Password"
                name="newPassword"
                type="password"
                register={register}
                error={errors.newPassword}
                mb={'24px'}
              />
              <Field
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                register={register}
                error={errors.confirmPassword}
                mb={'24px'}
              />
              <Button type="submit">Reset password </Button>
            </Box>
          </Flex>
        </Flex>
      ) : (
        <p>The page you are trying to get to is not available</p>
      )}
    </>
  );
};

export default Index;
