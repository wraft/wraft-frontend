import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Text } from 'theme-ui';
import { Drawer } from '@wraft-ui/Drawer';

import { fetchAPI } from '../../utils/models';
import Link from '../NavLink';
import PageHeader from '../PageHeader';
import PipelineTypeForm from './PipelineTypeForm';
import { Table } from '@wraft/ui';

export interface Pipelines {
  total_pages: number;
  total_entries: number;
  pipelines: Pipeline[];
  page_number: number;
}

export interface Pipeline {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  api_route: string;
  stages: any;
}

const Form = () => {
  const [contents, setContents] = useState<Array<Pipeline>>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = React.useState(false);
  const [loading, setLoading] = useState<boolean>(true);  

  const loadData = () => {
    fetchAPI('pipelines?sort=inserted_at_desc').then((data: any) => {
      const res: Pipeline[] = data.pipelines;
      setContents(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [rerender]);

  const columns = [
    {
      id: 'pipeline.name',
      header: 'NAME',
      accessorKey: 'pipeline.name',
      cell: ({ row }: any) => (
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
          key={row.index}>
          <Link href={`/manage/pipelines/run/${row.original.id}`}>
            <Text as="h4" variant="pM">
              {row.original.name}
            </Text>
          </Link>
        </Box>
      ),
      enableSorting: false,
    },
    {
      id: 'pipeline.run',
      header: 'LAST RUN',
      accessorKey: 'pipeline.run',
      cell: ({ row }: any) => (
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
          key={row.index}>
          <Text as="p" variant="pM">
            {row.original.inserted_at}
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
      <PageHeader title="All Pipelines">
        <Flex sx={{ flexGrow: 1, ml: 'auto', mr: 0, pt: 1, mt: 0 }}>
          <Button variant="buttonSecondary" onClick={() => setIsOpen(true)}>
            New Pipeline
          </Button>
        </Flex>
      </PageHeader>
      <Box variant="layout.pageFrame" sx={{ py: 4 }}>
        <Box mt={0}>
          <Table data={contents} columns={columns} isLoading={loading} />
        </Box>
      </Box>
      <Drawer open={isOpen} setOpen={() => setIsOpen(false)}>
        {isOpen && (
          <PipelineTypeForm setIsOpen={setIsOpen} setRerender={setRerender} />
        )}
      </Drawer>
    </Box>
  );
};
export default Form;
