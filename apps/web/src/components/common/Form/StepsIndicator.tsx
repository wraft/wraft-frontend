import React from 'react';

import { Box, Flex, Text } from 'theme-ui';

type Data = {
  title: string;
  valid: boolean;
};

type Props = { data: Data[]; formStep: number };

const StepsIndicator = ({ data, formStep }: Props) => {
  return (
    <Flex>
      {data.map((item, index) => {
        return (
          <Flex key={index}>
            <Flex
              sx={{
                width: '24px',
                height: '24px',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'gray.600',
                bg: formStep && formStep <= index + 1 ? 'green.600' : 'white',
                borderRadius: '50%',
              }}>
              <Text sx={{ fontSize: 1, fontWeight: 500 }}>{index + 1}</Text>
            </Flex>
            {item.title}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default StepsIndicator;
