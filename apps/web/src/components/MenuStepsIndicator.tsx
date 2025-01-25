import React from 'react';
import { Box, Flex, Text } from '@wraft/ui';

type Props = {
  formStep: number;
  goTo: (arg: any) => void;
  titles: string[];
};

const MenuStepsIndicator = ({ goTo, formStep, titles }: Props) => {
  return (
    <Flex direction="column" flexShrink={0} w="180px" pl="md" py="md">
      {titles &&
        titles.map((title: any, index: number) => (
          <Box
            cursor="pointer"
            px="md"
            py="sm"
            bg={formStep === index ? 'gray.400' : 'transparent'}
            borderRadius="sm"
            key={index}
            onClick={() => goTo(index)}>
            <Text fontWeight="heading">{title}</Text>
          </Box>
        ))}
    </Flex>
  );
};

export default MenuStepsIndicator;
