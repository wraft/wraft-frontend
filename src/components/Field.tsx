import React from 'react';

import { Text, Box } from 'theme-ui';
import { Label, Input } from 'theme-ui';

interface Props {
  onChange?: any;
  bg?: string;
  type?: 'text' | 'email' | 'number' | 'password' | 'search' | 'date';
  error?: any;
  register: any;
  label?: string;
  name: string;
  defaultValue?: string;
  mr?: number;
  placeholder?: string;
  sub?: string;
  variant?: string;
  disable?: boolean;
}

const Field: React.FC<Props> = ({
  onChange,
  bg,
  type,
  error,
  disable,
  name,
  label,
  placeholder,
  register,
  defaultValue,
  mr,
  sub,
  variant = 'baseForm',
}) => {
  return (
    <Box mr={mr} variant={variant} sx={{ position: 'relative' }}>
      {sub && (
        <Text sx={{ position: 'absolute', right: 16, top: 32 }}>{sub}</Text>
      )}
      <Label htmlFor="description" mb={1}>
        {label}
      </Label>
      <Input
        onChange={onChange}
        sx={{ bg: bg ? bg : 'transparent', mb: error ? '24px' : '' }}
        type={type ? type : 'text'}
        disabled={disable}
        placeholder={placeholder ? placeholder : ''}
        id={name}
        defaultValue={defaultValue || ''}
        {...register(name, {
          required: `${label ? label : name} is required`,
        })}
      />
      {error && (
        <Text
          sx={{ position: 'absolute', bottom: '-22px', left: '4px' }}
          variant="error">
          {error.message}
        </Text>
      )}
    </Box>
  );
};

export default Field;
