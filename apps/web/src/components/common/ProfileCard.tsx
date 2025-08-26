import { Flex, Text } from '@wraft/ui';
import { Avatar } from 'theme-ui';

import { TimeAgo } from './Atoms';

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
    <Flex color="text-primary" alignItems="center" gap="xs">
      <Avatar
        width={16}
        height={16}
        sx={{ mr: 2, borderColor: 'border', border: 0 }}
        src={finalImage}
      />
      <Text fontWeight="600" mr="xs">
        {name}
      </Text>
      <TimeAgo time={time} ago={true} />
    </Flex>
  );
};
