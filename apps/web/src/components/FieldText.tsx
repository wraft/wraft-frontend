import React from 'react';
import { Box, Text } from 'theme-ui';
import { Label, Textarea } from 'theme-ui';

interface Props {
  error?: any;
  register: any;
  label: string;
  placeholder?: string;
  name: string;
  defaultValue: string;
  disabled?: boolean;
  view?: boolean;
}

const FieldText: React.FC<Props> = ({
  error,
  name,
  label,
  register,
  defaultValue,
  disabled,
  placeholder,
  view = false,
}) => {
  return (
    <Box>
      <Label htmlFor="description">{label}</Label>
      <Textarea
        rows={2}
        id={name}
        defaultValue={defaultValue}
        {...register(name, { required: `${label} is required` })}
        disabled={disabled || view}
        placeholder={placeholder || ''}
        sx={{
          fontFamily: 'body',
          ':disabled': {
            [view ? 'color' : '']: 'text',
          },
        }}
      />
      {error && <Text variant="error"> {error.message}</Text>}
    </Box>
  );
};

export default FieldText;
