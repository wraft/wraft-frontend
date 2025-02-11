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
    <Flex gap="sm" mb="md" align="center">
      <Flex w={16} h={16}>
        <Avatar width={16} height={16} src={finalImage} />
      </Flex>
      <Text>{name}</Text>
    </Flex>
  );
};
