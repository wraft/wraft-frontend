import Image from 'next/image';
import { Flex, Box, Heading, Button } from 'theme-ui';

import Verified from '../../public/Social 01 1.svg';

type ChildProps = {
  setVerified: (newValue: boolean) => void; // Callback function prop
};

const EmailVerified: React.FC<ChildProps> = ({ setVerified }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '80px' }}>
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
            setVerified(true);
          }}>
          okay
        </Button>
      </Flex>
    </Box>
  );
};

export default EmailVerified;
