import React, { FC, useEffect, useState } from 'react';
import { Box, Text } from 'theme-ui';
import { Table } from '@wraft/ui';

import { TimeAgo } from 'components/Atoms';
import { fetchAPI } from 'utils/models';

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

const ItemField: FC<any> = ({ name }) => {
  return (
    <Text color="gray.8" sx={{ fontSize: 'sm', fontWeight: 400 }}>
      {name}
    </Text>
  );
};

const columns = [
  {
    id: 'name',
    header: 'NAME',
    accessorKey: 'name',
    cell: ({ row }: any) => row?.original && <ItemField {...row?.original} />,
    // size: 200,
    enableSorting: false,
  },
  {
    id: 'description',
    header: 'DESCRIPTION',
    accessorKey: 'description',
    cell: ({ row }: any) =>
      row?.original && <Box>{row?.original?.description}</Box>,
    // size: 200,
    enableSorting: false,
  },
  {
    id: 'updated_at',
    header: 'CREATED',
    accessorKey: 'updated_at',
    cell: ({ row }: any) => (
      <Text as="span" sx={{ pt: 3, fontSize: 'xs' }}>
        <TimeAgo time={row?.original?.updated_at} />
      </Text>
    ),
    // size: 180,
    enableSorting: false,
  },
];

const FieldList: FC = () => {
  const [contents, setContents] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    fetchAPI('field_types')
      .then((data: any) => {
        const res: any = data;
        setContents(res.field_types);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Box mt={0}>
      <Table data={contents} columns={columns} isLoading={loading} />
    </Box>
  );
};
export default FieldList;
