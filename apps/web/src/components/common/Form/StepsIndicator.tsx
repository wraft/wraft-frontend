import React from 'react';
// eslint-disable-next-line import/order
import { Flex, Text } from '@wraft/ui';

import { CaretRight } from '@phosphor-icons/react';

type Props = {
  formStep: number;
  goTo: (arg: any) => void;
  titles: string[];
};

const StepsIndicator = ({ goTo, formStep, titles }: Props) => {
  return (
    <Flex bg="background-secondary" py="md" px="xl" align="center">
      {titles.map((item, index) => {
        return (
          <Flex key={index} align="center">
            <Flex
              w="22px"
              h="22px"
              justify="center"
              align="center"
              color={formStep >= index ? 'green.1200' : 'gray.900'}
              bg={formStep >= index ? 'green.600' : 'gray.400'}
              borderRadius="xl">
              <Text fontSize="sm">{index + 1}</Text>
            </Flex>
            <Text
              ml="sm"
              cursor="pointer"
              color="text-secondary"
              fontWeight="heading"
              as="h5"
              onClick={() => goTo(index)}>
              {item}
            </Text>
            {titles.length !== index + 1 && (
              <Flex mx={'12px'} align="center" px="5.25px" py="3.25px">
                <CaretRight size={20} />
              </Flex>
            )}
          </Flex>
        );
      })}
      <Text ml="auto" color="gray.900">
        {formStep + 1}/{titles.length}
      </Text>
    </Flex>
  );
};

export default StepsIndicator;
