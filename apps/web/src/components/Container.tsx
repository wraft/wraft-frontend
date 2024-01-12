import { Box } from 'theme-ui';

interface ContainerProps {
  children: any;
  width: number;
  bg: string;
}

const Container = (props: ContainerProps) => {
  return (
    <Box
      sx={{
        maxWidth: (props.width || '100') + 'rem',
        mx: 'auto',
        px: 0,
        bg: props.bg ? props.bg : 'transparent',
      }}>
      {props.children}
    </Box>
  );
};

export default Container;
