import { Flex, Text } from 'theme-ui';

interface BlockProps {
  title: string;
  icon: React.ReactNode;
  desc?: any;
  clean?: boolean;
}

const Block = ({ title, icon, desc, clean }: BlockProps) => (
  <Flex
    sx={{
      px: 2,
      py: 2,
      alignItems: 'center',
      gap: 2,
      flex: 1,
      border: 'solid 1px',
      borderColor: clean ? 'transparent' : 'gray.400',
      borderBottom: clean ? 0 : 'transparent',
      borderRight: clean ? 0 : 'transparent',
    }}>
    {icon}
    <Text variant="pB">{title}</Text>
    {desc && (
      <Text variant="pR" sx={{ color: 'gray.900', fontSize: '12px' }}>
        {desc}
      </Text>
    )}
  </Flex>
);

export default Block;
