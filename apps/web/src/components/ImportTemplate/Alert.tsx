/** @jsxImportSource theme-ui */
import { Alert as MessageAlert } from '@theme-ui/components';
import { Text } from '@theme-ui/components';

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
      bg: 'red.300',
      color: 'red.400',
      borderColor: 'red.500',
      textColor: 'red.900',
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
    <MessageAlert
      sx={{
        my: 3,
        bg: colorSet.bg,
        color: colorSet.color,
        border: '1px solid',
        borderColor: colorSet.borderColor,
      }}>
      <Text
        variant="small"
        sx={{
          fontSize: 'sm',
          fontWeight: 'body',
          color: colorSet.textColor,
          py: 1,
        }}>
        {children}
      </Text>
    </MessageAlert>
  );
};
