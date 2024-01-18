import React from 'react';

import { Box, Flex, Text } from 'theme-ui';

import { GraterThanIcon } from '../Icons';
import NextLinkText from '../NavLink';

type Data = {
  name: string;
  path?: string;
};

type Props = { data: Data[] };

const DescriptionLinker = ({ data }: Props) => {
  return (
    <Box>
      <Flex sx={{ alignItems: 'center', gap: 1 }}>
        {data &&
          data.map((item, index) => (
            <Flex key={index} sx={{ alignItems: 'center', gap: 1 }}>
              {item.path ? (
                <NextLinkText href={item.path}>{item.name}</NextLinkText>
              ) : (
                <Text>{item.name}</Text>
              )}
              {index !== data.length - 1 && <GraterThanIcon />}
            </Flex>
          ))}
      </Flex>
    </Box>
  );
};

export default DescriptionLinker;
