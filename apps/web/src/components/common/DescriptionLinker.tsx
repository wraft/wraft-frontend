import React from 'react';
import { Box, Flex, Text } from 'theme-ui';
import { RightIcon } from '@wraft/icon';

import NextLinkText from 'common/NavLink';

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
                <NextLinkText href={item.path}>
                  <Text variant="subR" sx={{ color: 'gray.900' }}>
                    {item.name}
                  </Text>
                </NextLinkText>
              ) : (
                <Text variant="subR" sx={{ color: 'gray.900' }}>
                  {item.name}
                </Text>
              )}
              {index !== data.length - 1 && <RightIcon />}
            </Flex>
          ))}
      </Flex>
    </Box>
  );
};

export default DescriptionLinker;
