import React from 'react';
import { Text, Box } from 'rebass';
import { Label, Input } from '@rebass/forms';

// import { Input } from "@chakra-ui/core";

interface Props {
  register: any,
  label: string,
  name: string,
  defaultValue?: string,
  mr?: number,
  placeholder? :string,
  sub? :string,
  onClick?:any;
  onChange: any;
}

const Field: React.FC<Props> = ({ name, label, placeholder, register, defaultValue, onClick, onChange, mr, sub }) => {
  return (
    <Box width={1} pb={2} mr={mr} sx={{ position: 'relative'}}>
      { sub && <Text fontSize={0} color="#444" sx={{ position: 'absolute', right: 16, top: 32}}>{sub}</Text>}
      <Label htmlFor="description" mb={1}>
        {label}
      </Label>
      <Input
        onChange={onChange}
        placeholder={placeholder ? placeholder: ''} size="lg"
        id={name}
        name={name}
        defaultValue={defaultValue ||  ''}
        ref={register({ required: true })}
        onClick={onClick}
      />
    </Box>
  );
};


export default Field;
