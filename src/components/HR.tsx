import { Box } from 'theme-ui';

interface props {
  my?: string;
}

const HR = ({ my }: props) => {
  if (my)
    return (
      <Box
        sx={{
          width: '100%',
          height: '1px',
          my: `${my}`,
          bg: 'neutral.0',
        }}
      />
    );
  else
    return (
      <Box
        sx={{
          width: '100%',
          height: '1px',
          my: '200px',
          bg: 'neutral.0',
        }}
      />
    );
};

export default HR;
