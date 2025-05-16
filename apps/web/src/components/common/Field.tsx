import React, { useState } from 'react';
import { Text, Box, InputText } from '@wraft/ui';
import { Label } from 'theme-ui';
import { AddIcon } from '@wraft/icon';

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
  p?: string | number;
  color?: string | number;
  fontWeight?: string | number;
  fontSize?: string | number;
  view?: boolean;
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
  mr = 'sm',
  mb = 'md',
  sub,
  variant = 'baseForm',
  p,
  color = 'gray.1200',
  fontWeight = 500,
  fontSize,
  view = false,
}) => {
  const [passwordType, setPasswordType] = useState('password');
  return (
    <Box mr={mr} mb={mb} variant={variant} position="relative">
      {sub && <Text>{sub}</Text>}
      {label && (
        <Label htmlFor="description" sx={{ color: 'gray.a1100' }}>
          {label}
        </Label>
      )}
      <Box position="relative">
        <InputText
          onChange={onChange}
          fontSize="base"
          bg={bg ? bg : 'transparent'}
          mb={error ? '24px' : ''}
          p={p}
          color={color}
          fontWeight={fontWeight}
          WebkitTextFillColor="var(--theme-ui-colors-gray-a1100)"
          css={{
            ':disabled': {
              [view ? 'color' : '']: 'text',
            },
          }}
          type={type ? (type === 'password' ? passwordType : type) : 'text'}
          disabled={disable || view}
          placeholder={placeholder ? placeholder : ''}
          id={name}
          defaultValue={defaultValue || ''}
          {...register(name, {
            required: `${label ? label : name} is required`,
          })}
        />
        {type === 'password' && (
          <Box
            cursor="pointer"
            position="absolute"
            right="4px"
            top="4px"
            zIndex={100}
            color="gray.700"
            p={2}
            css={{
              '&:hover': { color: 'gray.800' },
            }}
            onClick={() => {
              setPasswordType((prev) =>
                prev === 'password' ? 'text' : 'password',
              );
            }}>
            <AddIcon />
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
