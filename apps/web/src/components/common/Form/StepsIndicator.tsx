import React from 'react';
// eslint-disable-next-line import/order
import { Flex, Text } from 'theme-ui';

// import { GraterThanIcon } from 'components/Icons';
import { CaretRight } from '@phosphor-icons/react';

type Props = {
  formStep: number;
  goTo: (arg: any) => void;
  titles: string[];
};

const StepsIndicator = ({ goTo, formStep, titles }: Props) => {
  return (
    <Flex sx={{ bg: 'grayA35', py: '14px', px: 4, alignItems: 'center' }}>
      {titles.map((item, index) => {
        return (
          <Flex key={index} sx={{ alignItems: 'center' }}>
            <Flex
              sx={{
                width: '24px',
                height: '24px',
                justifyContent: 'center',
                alignItems: 'center',
                color: formStep >= index ? 'green.1200' : 'gray.900',
                bg: formStep >= index ? 'green.600' : 'gray.100',
                borderRadius: '50%',
              }}>
              <Text sx={{ fontSize: 'xs', fontWeight: 500 }}>{index + 1}</Text>
            </Flex>
            <Text
              sx={{ ml: '10px', cursor: 'pointer', color: 'gray.1100' }}
              onClick={() => goTo(index)}
              variant="pM">
              {item}
            </Text>
            {titles.length !== index + 1 && (
              <Flex
                mx={'12px'}
                sx={{ alignItems: 'center', px: '5.25px', py: '3.25px' }}>
                <CaretRight size={20} />
              </Flex>
            )}
          </Flex>
        );
      })}
      <Text variant="subM" sx={{ ml: 'auto', color: 'gray.900' }}>
        {formStep + 1}/{titles.length}
      </Text>
    </Flex>
  );
};

export default StepsIndicator;
