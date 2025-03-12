import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text } from '@wraft/ui';

import PageHeader from 'common/PageHeader';
import { fetchAPI } from 'utils/models';

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
      const transformedData = Object.keys(contents).map((id) => ({
        name: idToNameMap[id] || id,
        value: contents[id],
      }));

      setNewData(transformedData);
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
    <Box as="div" bg="background-secondary" minHeight="100%">
      <PageHeader title="Response Details" desc={entryId} />

      <Box
        border="1px solid"
        borderColor="border"
        bg="background-primary"
        w="70%"
        m="md"
        p="lg">
        {newData &&
          newData.map((item: ContentItem, index: number) => (
            <Box key={index} mb="md" w="80%">
              <Text color="text-primary" fontWeight="500">
                {item.name}
              </Text>
              <Text color="text-secondary" mt="1px">
                {String(item.value) || 'N/A'}
              </Text>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default FormEntryDetails;
