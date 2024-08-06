import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Heading, Label, Text } from 'theme-ui';

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
          py: 2,
          width: '50%',
          bg: 'white',
          minHeight: '80vh',
          border: '1px solid',
          borderColor: 'border',
        }}>
        <Box px={4} p={3} sx={{ fontSize: 'sm', fontWeight: '500' }}>
          Response Details
        </Box>
        {newData &&
          newData.map((item: any) => (
            <Flex
              key={item.id}
              sx={{
                px: 4,
                py: 2,
              }}>
              <Label sx={{ width: '30%' }}>{item.name}</Label>
              <Text sx={{ fontSize: 'sm' }}>{item.value}</Text>
            </Flex>
          ))}
      </Box>
    </Box>
  );
};

export default FormEntryDetails;
