import { useState } from 'react';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Box, Heading, Button, Text } from 'theme-ui';

import Logo from '../../../public/Logo.svg';
import CountdownTimer from '../../components/common/CountDownTimer';
import Field from '../../components/Field';
import Link from '../../components/NavLink';
import { postAPI } from '../../utils/models';

type FormValues = {
  email: string;
};

const Index = () => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    toast.promise(
      postAPI('user/password/forgot', {
        email: data.email,
        first_time_setup: false,
      }),
      {
        loading: 'Loading...',
        success: () => {
          setIsSent(true);
          return 'Operation completed successfully';
        },
        error: 'An error occurred',
      },
    );
  };

  return (
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
        <Heading
          as="h3"
          variant="styles.h3Medium"
          sx={{ color: 'green.6', mb: '18px' }}>
          Reset password
        </Heading>

        <Text
          as="p"
          variant="pM"
          sx={{
            color: 'dark_400',
            mb: '48px',
          }}>
          We will send you a verification link to your registered email.
        </Text>
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Field
            name="email"
            label="Enter your email"
            register={register}
            error={errors.email}
            type="email"
          />

          <Flex sx={{ justifyContent: 'space-between', mt: '24px' }}>
            <Button variant="buttonPrimary" disabled={isSent} type="submit">
              {isSent ? 'Resend Link' : 'Send Verification Link'}
            </Button>
            {isSent && <CountdownTimer setIsCounter={setIsSent} />}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Index;
