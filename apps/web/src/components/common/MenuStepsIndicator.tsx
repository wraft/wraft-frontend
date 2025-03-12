import React from 'react';
import { Box, Flex, Text } from '@wraft/ui';

interface MenuStepsIndicatorProps {
  formStep: number;
  goTo: (stepIndex: number) => void;
  titles: string[];
}

const MenuStepsIndicator: React.FC<MenuStepsIndicatorProps> = ({
  goTo,
  formStep,
  titles,
}) => {
  if (!titles || titles.length === 0) {
    return null;
  }

  return (
    <Flex
      direction="column"
      flexShrink={0}
      w="180px"
      role="navigation"
      aria-label="Form steps">
      {titles.map((title: string, index: number) => {
        const isActive = formStep === index;

        return (
          <Box
            cursor="pointer"
            px="md"
            py="sm"
            bg={isActive ? 'gray.400' : 'transparent'}
            borderRadius="sm"
            key={`step-${index}`}
            onClick={() => goTo(index)}
            role="button"
            aria-current={isActive ? 'step' : undefined}>
            <Text
              fontWeight={isActive ? 'bold' : 'normal'}
              color={isActive ? 'text.primary' : 'text.secondary'}>
              {title}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
};

export default MenuStepsIndicator;
