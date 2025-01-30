import React from 'react';
import { Box, Input, Label, Text, Textarea } from 'theme-ui';

type Props = { items: any[]; view?: boolean };

const FormViewForm = ({ items }: Props) => {
  return (
    <div>
      {items.map((item: any) => (
        <Box
          key={item.id}
          sx={{
            p: 4,
            borderBottom: '1px solid',
            borderColor: 'border',
          }}>
          <Label>
            {item.name}
            <Text sx={{ color: 'red.700' }}>{item.required && '*'}</Text>
          </Label>
          {item.type === 'Text' && <Textarea />}
          {item.type === 'String' && <Input />}
          {item.type === 'File Input' && <Input type="file" />}
          {item.type === 'Date' && <Input type="date" />}
        </Box>
      ))}
    </div>
  );
};

export default FormViewForm;
