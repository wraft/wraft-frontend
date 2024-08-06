import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, Label, Text } from 'theme-ui';

import { fetchAPI } from 'utils/models';

import PageHeader from './PageHeader';

type ContentItem = {
  name: string;
  value: string | number;
};

const FormEntryDetails = () => {
  const [contents, setContents] = useState<any>();
  const [formField, setFormField] = useState<any[]>([]);
  const [newData, setNewData] = useState<ContentItem[]>([]);

  const router = useRouter();
  const entryId: string = router.query.entryId as string;
  const fId: string = router.query.id as string;

  const loadData = () => {
    fetchAPI(`forms/${fId}/entries/${entryId}`).then((data: any) => {
      const res = data.data;
      setContents(res);
    });
  };

  const loadFormField = () => {
    fetchAPI(`forms/${fId}`).then((data: any) => {
      const res = data.fields;
      setFormField(res);
    });
  };

  const formResponse = () => {
    if (formField.length > 0 && contents) {
      const idToNameMap = formField.reduce((acc: any, field: any) => {
        acc[field.id] = field.name;
        return acc;
      }, {});

      // Step 2: Transform the contents object
      const newData = Object.keys(contents).map((id) => ({
        name: idToNameMap[id] || id,
        value: contents[id],
      }));

      setNewData(newData);
    }
  };

  useEffect(() => {
    loadData();
    loadFormField();
  }, []);

  useEffect(() => {
    formResponse();
  }, [formField, contents]);

  return (
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'gray.100' }}>
      <PageHeader title="Response Details" desc={entryId}>
        <Box />
      </PageHeader>
      <Box
        sx={{
          my: 4,
          mx: 4,
          width: '70%',
          bg: 'white',
          border: '1px solid',
          borderColor: 'border',
        }}>
        {newData &&
          newData.map((item: any) => (
            <Box
              key={item.id}
              sx={{
                p: 4,
                borderBottom: '1px solid',
                borderColor: 'border',
              }}>
              <Label>{item.name}</Label>
              <Text>{item.value}</Text>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default FormEntryDetails;
