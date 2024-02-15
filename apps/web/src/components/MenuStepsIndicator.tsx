import React from 'react';

import { Box, Flex, Text } from 'theme-ui';

type Props = {
  formStep: number;
  goTo: (arg: any) => void;
  titles: string[];
};

const MenuStepsIndicator = ({ goTo, formStep, titles }: Props) => {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        gap: '8px',
        pl: 0,
        mr: 4,
        flexShrink: 0,
        maxHeight: '90vh',
        borderColor: 'border',
      }}>
      {titles &&
        titles.map((title: any, index: number) => (
          <Box
            sx={{
              cursor: 'pointer',
              width: '100%',
            }}
            key={index}>
            <Flex
              onClick={() => goTo(index)}
              sx={{
                cursor: 'pointer',
                py: '6px',
                px: '12px',
                minWidth: '135px',
                width: '100%',
                color: 'gray.900',
                borderRadius: '4px',
                alignItems: 'center',
                bg: formStep === index ? 'neutral.200' : 'transparent',
                ':hover': { bg: 'neutral.200' },
              }}>
              <Text
                variant="pM"
                sx={{
                  width: '100%',
                  color: 'inherit',
                }}>
                {title}
              </Text>
            </Flex>
          </Box>
        ))}
    </Flex>
  );
};

export default MenuStepsIndicator;
