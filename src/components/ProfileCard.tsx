import React from 'react';
import { Box, Flex, Text, Image } from 'theme-ui';

import { Phone, MailSend } from '@styled-icons/boxicons-regular';

/**
 * Icon Block
 */
interface IconBlockProps {
  val?: string;
  icon: any;
}
const IconBlock = ({ val, icon }: IconBlockProps) => {
  return (
    <Flex
      variant="boxCard1"
      sx={{
        // bg: 'white',
        pt: 2,
        pb: 0,
        borderTop: 'solid 1px #eee',
        mt: 3,
      }}>
      {icon}
      <Text ml={2} mt={1} variant="personBlock">
        {val}
      </Text>
    </Flex>
  );
};

interface IItemField {
  _id?: string;
  name?: string;
  profile_pic?: string;
  onDelete?: any;
  organisation_id?: string;
  email?:string,
  phone?:string,
}

const ProfileCard = ({
  // _id,
  name,
  profile_pic,
  email,
  phone = '+91 8050473500',
  organisation_id,
}: IItemField) => {
  const imgP = 'http://localhost:4000';
  return (
    <Box>
      <Flex>
        <Box>
          <Image
            sx={{ borderRadius: 99 }}
            src={`${imgP}/${profile_pic}`}
            width={80}
            height={80}
          />
        </Box>
        <Box>
          <Box sx={{ pl: 3, pt: 2 }}>
            <Text variant="personName">{name}</Text>
            <Text variant="personBio">{'Director, Marketing'}</Text>
            <Text variant="personPlace">{organisation_id}</Text>
          </Box>
        </Box>
      </Flex>
      <IconBlock val={email} icon={<MailSend width={24} height={24} />} />
      <IconBlock val={phone} icon={<Phone width={24} height={24} />} />      
    </Box>
  );
};

export default ProfileCard;
