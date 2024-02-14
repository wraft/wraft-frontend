import React, { FC, useEffect, useState } from 'react';
import { Box, Text } from 'theme-ui';

import { fetchAPI } from '../utils/models';
import { TimeAgo } from './Atoms';
import Table from './Table';

export interface FieldTypeList {
  total_pages: number;
  total_entries: number;
  page_number: number;
  field_types: FieldType[];
}
export interface FieldType {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
}

const ItemField: FC<any> = ({ id, name }) => {
  return (
    <Box
      key={id}
      p={3}
      sx={{
        flexGrow: 1,
      }}>
      <Text color="gray.8" sx={{ fontSize: 2, fontWeight: 400 }}>
        {name}
      </Text>
      <Text pt={1} color="gray.5" sx={{ fontSize: 1, fontWeight: 300 }}>
        Sample Field Description
      </Text>
    </Box>
  );
};

const FieldList: FC = () => {
  const [contents, setContents] = useState<Array<FieldType>>([]);
  const [fields, setFields] = useState<Array<any>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    fetchAPI('field_types')
      .then((data: any) => {
        const res: FieldTypeList = data;
        setContents(res.field_types);
      })
      .catch();
  };

  useEffect(() => {
    if (contents && contents.length > 0) {
      const row: any = [];
      contents.map((r: any) => {
        const rFormated = {
          col2: <ItemField {...r} />,
          col3: (
            <Text as="span" sx={{ pt: 3, fontSize: 1 }}>
              <TimeAgo time={r.updated_at} />
            </Text>
          ),
        };

        row.push(rFormated);
      });
      setFields(row);
    }
  }, [contents]);

  return (
    <Box mt={0}>
      {fields && (
        <Table
          options={{
            columns: [
              {
                Header: 'Name',
                accessor: 'col2',
                width: '45%',
              },
              {
                Header: 'Updated',
                accessor: 'col3',
                width: '40%',
              },
            ],
            data: fields,
          }}
        />
      )}
    </Box>
  );
};
export default FieldList;
