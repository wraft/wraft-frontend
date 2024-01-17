import React from 'react';

import { ThemeUIStyleObject } from 'theme-ui';
import { Box } from 'theme-ui';

interface SkeletonProps {
  width?: string;
  height: string;
  borderRadius?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height,
  borderRadius = '4px',
}) => {
  const keyframes: ThemeUIStyleObject = {
    '@keyframes loading': {
      '0%': {
        opacity: 0.3,
      },
      '50%': {
        opacity: 0.9,
      },
      '100%': {
        opacity: 0.3,
      },
    },
  };

  const style: ThemeUIStyleObject = {
    width,
    height,
    borderRadius,
    backgroundColor: '#E4E9EF',
    animation: 'loading 1.5s infinite ease-in-out',
    mb: '8px',
  };

  return <Box className="skeleton" sx={{ ...keyframes, ...style }}></Box>;
};

export default Skeleton;
