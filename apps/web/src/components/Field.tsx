import React, { useState } from 'react';

import { Text, Box } from 'theme-ui';
import { Label, Input } from 'theme-ui';

import { EyeIcon } from './Icons';

interface Props {
  onChange?: any;
  bg?: string;
  type?: 'text' | 'email' | 'number' | 'password' | 'search' | 'date';
  error?: any;
  register: any;
  label?: string;
  name: string;
  defaultValue?: string;
  mr?: string | number;
  mb?: string | number;
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
  mb,
  sub,
  variant = 'baseForm',
}) => {
  const [passwordType, setPasswordType] = useState('password');
  return (
    <Box mr={mr} mb={mb} variant={variant} sx={{ position: 'relative' }}>
      {sub && (
        <Text sx={{ position: 'absolute', right: 16, top: 32 }}>{sub}</Text>
      )}
      <Label htmlFor="description" mb={1}>
        {label}
      </Label>
      <Box sx={{ position: 'relative' }}>
        <Input
          onChange={onChange}
          sx={{ bg: bg ? bg : 'transparent', mb: error ? '24px' : '' }}
          type={type ? (type === 'password' ? passwordType : type) : 'text'}
          disabled={disable}
          placeholder={placeholder ? placeholder : ''}
          id={name}
          defaultValue={defaultValue || ''}
          {...register(name, {
            required: `${label ? label : name} is required`,
          })}
        />
        {type === 'password' && (
          <Box
            sx={{
              cursor: 'pointer',
              position: 'absolute',
              right: '4px',
              top: '4px',
              zIndex: 100,
              color: 'gray.200',
              p: 2,
              ':hover': { color: 'gray.800' },
            }}
            onClick={() => {
              setPasswordType((prev) =>
                prev === 'password' ? 'text' : 'password',
              );
            }}>
            <EyeIcon />
          </Box>
        )}
      </Box>
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
