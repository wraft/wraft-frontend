import React from 'react';
import { Text, Box } from 'theme-ui';
import { Label, Input } from 'theme-ui';

// import { Input } from "@chakra-ui/core";

interface Props {
  register: any,
  label: string,
  name: string,
  defaultValue?: string,
  mr?: number,
  placeholder? :string,
  sub? :string,
  variant?: string,
}

const Field: React.FC<Props> = ({ name, label, placeholder, register, defaultValue, mr, sub, variant = 'baseForm' }) => {
  return (
    <Box mr={mr} variant={variant} sx={{ position: 'relative'}}>
      { sub && <Text sx={{ position: 'absolute', right: 16, top: 32}}>{sub}</Text>}
      <Label htmlFor="description" mb={1}>
        {label}
      </Label>
      <Input
        placeholder={placeholder ? placeholder: ''}
        id={name}
        name={name}
        defaultValue={defaultValue ||  ''}
        ref={register({ required: true })}
      />
    </Box>
  );
};


export default Field;
