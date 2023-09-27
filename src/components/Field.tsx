import React from 'react';
import { Text, Box } from 'theme-ui';
import { Label, Input } from 'theme-ui';
import Error from './Error';

interface Props {
  error?: any;
  register: any;
  label: string;
  name: string;
  defaultValue?: string;
  mr?: number;
  placeholder?: string;
  sub?: string;
  variant?: string;
  disable?: boolean;
}

const Field: React.FC<Props> = ({
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
        disabled={disable}
        placeholder={placeholder ? placeholder : ''}
        id={name}
        defaultValue={defaultValue || ''}
        {...register(name, { required: `${label} is required` })}
      />
      {error && <Error text={error.message} />}
    </Box>
  );
};

export default Field;
