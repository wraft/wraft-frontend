import React from 'react';
import { Box, Text, Flex } from '@wraft/ui';

import { FieldType, FieldMap } from './FormFieldTypes';

type Props = {
  onClick: () => void;
  text?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  fieldType: FieldType;
};

const AnimatedButton = ({
  onClick,
  text,
  children,
  disabled,
  fieldType,
}: Props) => {
  const fieldInfo = FieldMap[fieldType];
  const Icon = fieldInfo.icon;

  return (
    <Flex
      minWidth="48px"
      minHeight="36px"
      border="1px solid"
      borderColor="border"
      borderRadius="4px"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      w="100%"
      p="md"
      style={{ transition: 'all 0.3s ease' }}
      onClick={() => !disabled && onClick()}>
      <Flex className="icon" mr="sm" w="20px" h="20px" mt="2px">
        {children || <Icon size={20} />}
      </Flex>
      <Box>
        <Text ml={1} fontWeight="heading">
          {text || fieldInfo.displayName}
        </Text>
        <Text fontSize="sm" color="text-secondary">
          {fieldInfo.description}
        </Text>
      </Box>
    </Flex>
  );
};

export default AnimatedButton;
