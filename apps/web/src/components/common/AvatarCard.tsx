import { Text, Flex, Box, Avatar } from 'theme-ui';

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
      {/* <Box>{time}</Box> */}
    </Flex>
  );
};
