import { Box, Flex, Avatar, Text } from 'theme-ui';

import { TimeAgo } from './Atoms';
/**
 * Profile Block
 */
interface ProfileCardP {
  name: string;
  time?: string;
  image?: string;
}

export const ProfileCard = ({
  name,
  time = '',
  image = `https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg`,
}: ProfileCardP) => {
  const finalImage =
    image == '/uploads/default.jpg'
      ? 'https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg'
      : image;

  return (
    <Flex
      sx={{
        fontSize: 'xs',
        color: 'text-primary',
        my: 1,
        alignItems: 'center',
      }}>
      <Avatar
        width={16}
        height={16}
        sx={{ mr: 2, borderColor: 'border', border: 0 }}
        src={finalImage}
      />
      <Text as="h3" sx={{ mr: 3, fontSize: 'sm', fontWeight: 600 }}>
        {name}
      </Text>
      <TimeAgo time={time} ago={true} />
    </Flex>
  );
};
