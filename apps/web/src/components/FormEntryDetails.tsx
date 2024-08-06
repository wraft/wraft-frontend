import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, Text } from 'theme-ui';

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
      <PageHeader title={fId} desc={entryId}>
        <Box
          sx={{
            flexGrow: 1,
            ml: 'auto',
            textAlign: 'right',
            mr: 0,
            pt: 2,
            mt: 1,
          }}></Box>
      </PageHeader>
      <Box
        sx={{
          maxWidth: '600px',
          margin: '10px auto',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'background',
        }}>
        <Heading as="h2" sx={{ marginBottom: '20px' }}>
          Form Details
        </Heading>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column', // Ensure items stack vertically
            marginBottom: '10px',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: 'muted',
          }}>
          {newData &&
            newData.map((data: any) => (
              <Box
                key={data.name}
                sx={{
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                <Text>{data.name}</Text>
                <Text>{data.value}</Text>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FormEntryDetails;
