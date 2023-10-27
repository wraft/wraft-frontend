import Image from 'next/image';
import { Flex, Box, Heading, Button } from 'theme-ui';
import Verified from '../../../../../public/Social 01 1.svg';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';

const EmailVerified: React.FC = () => {
  const router = useRouter();
  const { verifyToken } = router.query;
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Example: Make an API GET request
    if (verifyToken) {
      fetch(`${API_HOST}/api/v1/user/verify_email_token/${verifyToken}`)
        .then((response) => {
          setShow(true);
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [verifyToken]);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '80px' }}>
      {show && (
        <Flex
          variant="onboardingForms"
          sx={{
            alignItems: 'center',
            p: '0px',
            pt: '103px',
            px: '140px',
          }}>
          <Image
            src={Verified}
            alt=""
            width={224}
            height={224}
            className=""
            priority
          />
          <Heading
            as="h3"
            variant="styles.h3Medium"
            sx={{ mt: '88px', mb: '32px', color: '#363E49' }}>
            Your email is verified
          </Heading>
          <Button
            onClick={() => {
              Router.push('/login');
            }}>
            okay
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default EmailVerified;
