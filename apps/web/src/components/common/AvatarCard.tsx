import { Text, Flex } from '@wraft/ui';
import { Avatar } from 'theme-ui';

interface ProfileCard {
  name: string;
  time?: string;
  image?: string;
  short?: boolean;
  size?: number;
}

export const AvatarCard = ({
  name,
  image = ``,
  short = false,
  size = 20,
  // time,
}: ProfileCard) => {
  const finalImage = image == '/uploads/default.jpg' ? '' : image;

  return (
    <Flex gap="sm" align="center">
      <Flex w={size} h={size}>
        <Avatar width={size} height={size} src={finalImage} />
      </Flex>
      {short && <Text>{name}</Text>}
    </Flex>
  );
};
