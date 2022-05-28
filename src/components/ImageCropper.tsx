import React, { FC } from 'react';
import { Box, Text } from 'theme-ui';

interface BoxWrapProps {
  id: string;
  name: string;
  xid: string;
}

export const IndexPages: FC<BoxWrapProps> = ({ id }) => {
  return (
    <Box sx={{ pt: 1, pb: 2 }}>
      <Text
        sx={{
          fontSize: 0,
          color: 'gray.6',
          fontWeight: 300,
        }}
      >
        {id}
      </Text>
      <Text as="h4" p={0} sx={{ m: 0, fontSize: 1, fontWeight: 500 }}>
        Image Cropping
      </Text>
    </Box>
  );
};

export default IndexPages;
