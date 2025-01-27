import { Text, Flex } from '@wraft/ui';
import { Avatar } from 'theme-ui';

interface ProfileCard {
  name: string;
  time?: string;
  image?: string;
}

export const AvatarCard = ({
  name,
  image = `https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg`,
  // time,
}: ProfileCard) => {
  const finalImage =
    image == '/uploads/default.jpg'
      ? 'https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg'
      : image;

  return (
    <Flex gap="xs" mb="xs">
      <Avatar
        width={16}
        height={16}
        sx={{ mr: 2, borderColor: 'border', border: 0 }}
        src={finalImage}
      />
      <Text>{name}</Text>
    </Flex>
  );
};
