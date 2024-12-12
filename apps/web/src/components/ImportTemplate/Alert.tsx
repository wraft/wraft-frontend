import { Checks, Warning } from '@phosphor-icons/react';

import { Box } from 'common/Box';
import { Text } from 'common/Text';

interface MessageAlertProps {
  children?: React.ReactNode;
  variant?: 'error' | 'success' | 'alert';
}

export const Alert: React.FC<MessageAlertProps> = ({
  children,
  variant = 'success',
}) => {
  const colors = {
    error: {
      bg: 'red.100',
      color: 'red.800',
      borderColor: 'red.200',
      textColor: 'red.1000',
    },
    success: {
      bg: 'green.300',
      color: 'green.400',
      borderColor: 'green.500',
      textColor: 'green.900',
    },
    alert: {
      bg: 'yellow.300',
      color: 'yellow.400',
      borderColor: 'yellow.500',
      textColor: 'yellow.900',
    },
  };

  const colorSet = colors[variant];

  return (
    <Box
      display="flex"
      my={3}
      px={3}
      backgroundColor={colorSet.bg}
      color={colorSet.color}
      borderWidth="1px"
      borderStyle="solid"
      borderRadius="3px"
      borderColor={colorSet.borderColor}>
      <Text
        display="flex"
        fontSize="sm"
        fontWeight="body"
        color={colorSet.textColor}
        gap={2}
        py={1}>
        {variant === 'alert' && <Warning size={18} />}
        {variant === 'error' && <Warning size={18} />}
        {variant === 'success' && <Checks size={18} />}
        {children}
      </Text>
    </Box>
  );
};
