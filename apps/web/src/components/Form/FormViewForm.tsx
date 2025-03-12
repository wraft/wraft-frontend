import React from 'react';
import { Box, Field, InputText, Textarea } from '@wraft/ui';

type Props = { items: any[]; view?: boolean };

const FormViewForm = ({ items }: Props) => {
  return (
    <Box>
      {items.map((item: any) => (
        <Box
          key={item.id}
          padding="1rem"
          bg="background-primary"
          mb="md"
          border="1px solid"
          borderColor="border">
          <Field label={item.name} required={item.required}>
            <>
              {item.type === 'Text' && <Textarea name={item.id} />}
              {item.type === 'String' && <InputText name={item.id} />}
              {item.type === 'File Input' && (
                <InputText name={item.id} type="file" />
              )}
              {item.type === 'Date' && <InputText name={item.id} type="date" />}
            </>
          </Field>
        </Box>
      ))}
    </Box>
  );
};

export default FormViewForm;
