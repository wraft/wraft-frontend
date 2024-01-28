import React from 'react';

import { Box } from 'theme-ui';

type Props = {
  progress: number;
};

const ProgressBar = ({ progress }: Props) => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '20px',
        width: '100%',
        borderRadius: '50px',
        border: '1px solid #333',
        bg: 'gray.400',
      }}>
      <Box
        sx={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: 'green.500',
          borderRadius: 'inherit',
          textAlign: 'right',
          transition: 'width 1s ease-in-out',
          animation: `widthChange ${progress}% 1s ease-in-out`,
        }}
      />
    </Box>
  );
};

export default ProgressBar;
