import React from 'react';
import { Box, Text } from 'theme-ui';
import { Label, Textarea } from 'theme-ui';

interface Props {
  error?: any;
  register: any;
  label: string;
  name: string;
  defaultValue: string;
}

const FieldText: React.FC<Props> = ({
  error,
  name,
  label,
  register,
  defaultValue,
}) => {
  return (
    <Box pb={2}>
      <Label htmlFor="description">{label}</Label>
      <Textarea
        rows={3}
        id={name}
        defaultValue={defaultValue}
        {...register(name, { required: `${label} is required` })}
      />
      {error && <Text variant="error"> {error.message}</Text>}
    </Box>
  );
};

export default FieldText;
