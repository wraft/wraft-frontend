import { Box } from '@wraft/ui';

interface ContainerProps {
  children: any;
  width: number;
  bg: string;
}

const Container = (props: ContainerProps) => {
  return (
    <Box
      maxWidth={(props.width || '100') + 'rem'}
      mx="auto"
      px={0}
      bg={props.bg ? props.bg : 'transparent'}>
      {props.children}
    </Box>
  );
};

export default Container;
