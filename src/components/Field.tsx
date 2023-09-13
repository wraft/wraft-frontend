import React from 'react';
// import { useForm } from 'react-hook-form';
import { Text, Box } from 'theme-ui';
import { Label, Input } from 'theme-ui';
import Error from './Error';

// import { Input } from "@chakra-ui/core";

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
}

const Field: React.FC<Props> = ({
  error,
  name,
  label,
  placeholder,
  register,
  defaultValue,
  mr,
  sub,
  variant = 'baseForm',
}) => {
  // const { formState: errors } = useForm();
  return (
    <Box mr={mr} variant={variant} sx={{ position: 'relative' }}>
      {sub && (
        <Text sx={{ position: 'absolute', right: 16, top: 32 }}>{sub}</Text>
      )}
      <Label htmlFor="description" mb={1}>
        {label}
      </Label>
      <Input
        placeholder={placeholder ? placeholder : ''}
        id={name}
        // name={name}
        defaultValue={defaultValue || ''}
        // ref={register({ required: true })}
        {...register(name, { required: `${label} is required` })}
      />
      {/* {errors.errors.root?.message} */}
      {error && <Error text={error.message} />}
    </Box>
  );
};

export default Field;
