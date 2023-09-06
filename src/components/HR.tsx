import { Box } from 'theme-ui';

interface props {
  my?: string;
  color?: string;
}

const HR = ({ my, color }: props) => {
  const margin = my ? `${my}` : '200px';
  const colorSelected = color ? `${color}` : 'neutral.0';
  return (
    <Box
      sx={{
        width: '100%',
        height: '1px',
        my: margin,
        bg: colorSelected,
      }}
    />
  );
};

export default HR;
