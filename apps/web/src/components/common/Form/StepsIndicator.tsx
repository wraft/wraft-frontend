import React from 'react';
import { Flex, Text } from 'theme-ui';

import { GraterThanIcon } from '../../Icons';

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
                color: formStep >= index ? 'white' : 'gray.900',
                bg: formStep >= index ? 'green.600' : 'white',
                borderRadius: '50%',
              }}>
              <Text sx={{ fontSize: 1, fontWeight: 500 }}>{index + 1}</Text>
            </Flex>
            <Text
              sx={{ ml: '10px', cursor: 'pointer' }}
              onClick={() => goTo(index)}
              variant="pM">
              {item}
            </Text>
            {titles.length !== index + 1 && (
              <Flex
                mx={'12px'}
                sx={{ alignItems: 'center', px: '5.25px', py: '3.25px' }}>
                <GraterThanIcon height={12} width={12} />
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
