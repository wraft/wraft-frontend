import React from 'react';
import { Box, Flex, Text } from '@wraft/ui';
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
      <Flex alignItems="center" gap="xs">
        {data &&
          data.map((item, index) => (
            <Flex key={index} gap="xs">
              {item.path ? (
                <NextLinkText href={item.path}>
                  <Text color="text-secondary" fontSize="sm">
                    {item.name}
                  </Text>
                </NextLinkText>
              ) : (
                <Text color="text-secondary" fontSize="sm">
                  {item.name}
                </Text>
              )}
              {index !== data.length - 1 && <RightIcon width={9} />}
            </Flex>
          ))}
      </Flex>
    </Box>
  );
};

export default DescriptionLinker;
