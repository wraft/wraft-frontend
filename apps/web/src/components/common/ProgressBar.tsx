import React from 'react';
import { Box } from 'theme-ui';

type Props = {
  progress: number;
};

const ProgressBar = ({ progress }: Props) => {
  return (
    <Box
      sx={{
        flexShrink: 0,
        position: 'relative',
        height: '4px',
        width: '48px',
        borderRadius: '50px',
        bg: 'neutral.200',
      }}>
      <Box
        sx={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: 'green.700',
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
