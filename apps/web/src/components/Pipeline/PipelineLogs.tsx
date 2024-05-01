import React, { useEffect, useState } from 'react';
import { Box, Text } from 'theme-ui';
import { Button, Table } from '@wraft/ui';

import { fetchAPI } from '../../utils/models';

export interface Theme {
  total_pages: number;
  total_entries: number;
  themes: ThemeElement[];
  page_number: number;
}
export interface ThemeElement {
  updated_at: string;
  typescale: any;
  name: string;
  inserted_at: string;
  id: string;
  font: string;
  file: null;
}

type Props = {
  rerender: any;
  setRerender: (e: any) => void;
};

const Form = ({ rerender }: Props) => {
  const [contents, setContents] = useState<Array<ThemeElement>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = () => {
    setLoading(true);

    fetchAPI('themes?sort=inserted_at_desc')
      .then((data: any) => {
        const res: ThemeElement[] = data.themes;
        setContents(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [rerender]);

  const columns = [
    {
      id: 'content.name',
      header: 'LAST RUN',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
          key={row.index}>
          <Text as="p" variant="pM">
            2022-12-05,8:33:05
          </Text>
        </Box>
      ),
      enableSorting: false,
    },
    {
      id: 'content.name',
      header: (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Text as="p" variant="pS">
            ACTIONS
          </Text>
        </Box>
      ),
      accessorKey: 'content.name',
      cell: () => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary">Run</Button>
        </Box>
      ),
      enableSorting: false,
    },
  ];

  return (
    <Box>
      <Table data={contents} columns={columns} isLoading={loading} />
    </Box>
  );
};
export default Form;
