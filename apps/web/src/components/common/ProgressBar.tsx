import React from 'react';
import { Box } from '@wraft/ui';

type Props = {
  progress: number;
};

const ProgressBar = ({ progress }: Props) => {
  return (
    <Box
      flexShrink="0"
      position="relative"
      h="4px"
      w="48px"
      borderRadius="50px"
      bg="neutral.200">
      <Box
        h="100%"
        w={`${progress}%`}
        bg="green.700"
        borderRadius="inherit"
        textAlign="right"
        transition="width 1s ease-in-out"
        animation={`widthChange ${progress}% 1s ease-in-out`}
      />
    </Box>
  );
};

export default ProgressBar;
