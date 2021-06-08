import React, { FC, useEffect, useState } from 'react';
import { Box, Text } from 'theme-ui';
import Link from './NavLink';
// import { Plus } from './Icons';
import { fetchAPI } from '../utils/models';
import PageHeader from './PageHeader';
// import { Table } from '@plateui/ui-react';

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
      <Text as="h4" color="gray.8">
        {name}
      </Text>
      <Text pt={1} color="gray.5" sx={{ fontSize: 0 , fontWeight: 300 }}>
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
      let row: any = [];
      contents.map((r: any) => {
        const rFormated = {
          col2: <ItemField {...r} />,
          col3: <Text as="h4" sx={{ pt: 3, fontSize: 0 }}>{r.updated_at}</Text>,
        };

        row.push(rFormated);
      });
      setFields(row);
    }
  }, [contents]);

  return (
    <Box mt={0}>
      <PageHeader title="Fields Types" desc="Manage System Level fields">        
        <Box sx={{ ml: 'auto', mr: 5 }}>
          <Link href="/manage/fields/new" variant="btnPrimary">
            + New Field
          </Link>
        </Box>
      </PageHeader>
      <Box variant="layout.pageFrame" mx={0} mb={3}>
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
    </Box>
  );
};
export default FieldList;
