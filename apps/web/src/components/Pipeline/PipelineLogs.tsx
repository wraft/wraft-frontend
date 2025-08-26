import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, Table, Flex } from '@wraft/ui';

import { StateBadge } from 'common/Atoms';
import { fetchAPI } from 'utils/models';

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

const PipelineLogsList = ({ rerender }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [triggerHistory, setTriggerHistory] = useState<Array<[]>>([]);

  const router = useRouter();
  const cId: string = router.query.id as string;

  const loadPipelineHistory = () => {
    setLoading(true);

    fetchAPI(`pipelines/${cId}/triggers`)
      .then((data: any) => {
        const res = data.triggers;
        setTriggerHistory(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPipelineHistory();
  }, [rerender]);

  const columns = [
    {
      id: 'content.name',
      header: 'Start Time',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Flex justify="flex-start" key={row.index}>
          <Text as="p">
            {row.original.start_time
              ? row.original.start_time.replace('T', ' ').replace(/-/g, '/')
              : ''}
          </Text>
        </Flex>
      ),
      enableSorting: false,
    },
    {
      id: 'content.id',
      header: 'TASK ID',
      accessorKey: 'content.id',
      enableSorting: false,
      cell: ({ row }: any) => {
        return <Text>{row.original?.id}</Text>;
      },
    },
    {
      id: 'content.name',
      header: 'End Time',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Flex justify="flex-start" key={row.index}>
          <Text as="p">
            {row.original.end_time
              ? row.original.end_time.replace('T', ' ').replace(/-/g, '/')
              : ''}
          </Text>
        </Flex>
      ),
      enableSorting: false,
    },
    {
      id: 'content.status',
      header: (
        <Flex justify="flex-start">
          <Text as="p">Status</Text>
        </Flex>
      ),
      accessorKey: 'content.status',
      cell: ({ row }: any) => (
        <Flex justify="flex-start" key={row.index}>
          <StateBadge
            color={
              row.original.state == 'pending'
                ? 'red.400'
                : row.original.state == 'success'
                  ? 'green.a400'
                  : row.original.state == 'partially_completed'
                    ? 'red.400'
                    : 'red.400'
            }
            name={
              row.original.state == 'success'
                ? row.original.state.replace(/_/g, ' ')
                : 'error'
            }
          />
        </Flex>
      ),
      enableSorting: false,
    },
    {
      id: 'content.name',
      header: (
        <Flex justify="flex-start">
          <Text as="p">Message</Text>
        </Flex>
      ),
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Flex justify="flex-start">
          <Text as="p">
            {row.original.state == 'pending'
              ? `${row.original.error.info}`
              : row.original.state === 'partially_completed'
                ? `${row.original.error.info}`
                : row.original.state === 'success'
                  ? 'Build complete'
                  : 'failed to start build'}
          </Text>
        </Flex>
      ),
      enableSorting: false,
    },
  ];

  return (
    <Box>
      <Table data={triggerHistory} columns={columns} isLoading={loading} />
    </Box>
  );
};
export default PipelineLogsList;
