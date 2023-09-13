import React from 'react';
import { Box } from 'theme-ui';
import { Label, Textarea } from 'theme-ui';
import Error from './Error';

interface Props {
  error: any;
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
      <Label htmlFor="description" mb={1}>
        {label}
      </Label>
      <Textarea
        rows={3}
        id={name}
        // name={name}
        defaultValue={defaultValue}
        // ref={register({ required: true })}
        {...register(name, { required: `${label} is required` })}
      />
      {error && <Error text={error.message} />}
    </Box>
  );
};

export default FieldText;
