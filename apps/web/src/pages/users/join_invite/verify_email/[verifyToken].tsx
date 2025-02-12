import { useEffect, useState } from 'react';
import Image from 'next/image';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { Flex, Text, Button } from '@wraft/ui';

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
    <Flex direction="column" justifyContent="center" mt="80px">
      {show && (
        <Flex
          variant="onboardingForms"
          alignItems="center"
          p="0px"
          pt="103px"
          px="140px">
          <Image
            src={Verified}
            alt=""
            width={224}
            height={224}
            className=""
            priority
          />
          <Text as="h3">Your email is verified</Text>
          <Button
            onClick={() => {
              Router.push('/login');
            }}>
            okay
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default EmailVerified;
