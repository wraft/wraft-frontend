import { useEffect, useState } from 'react';
import Image from 'next/image';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { Flex, Box, Heading, Button } from 'theme-ui';

import { fetchAPI } from 'utils/models';

import Verified from '../../../../../public/social-handoff.svg';

const EmailVerified: React.FC = () => {
  const router = useRouter();

  const [show, setShow] = useState(false);

  const emailToken = router.query.verifyToken as string | undefined;

  useEffect(() => {
    if (emailToken) {
      fetchAPI(`user/verify_email_token/${emailToken}`)
        .then(() => {
          setShow(true);
        })
        .catch(() => {
          setShow(false);
        });
    }
  }, [emailToken]);
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
