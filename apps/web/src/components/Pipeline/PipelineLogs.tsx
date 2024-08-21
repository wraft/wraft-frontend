import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text } from 'theme-ui';
import { Button, Table } from '@wraft/ui';

import { StateBadge } from 'components/Atoms';

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

const PipelineLogsList = ({ rerender }: Props) => {
  const [contents, setContents] = useState<Array<ThemeElement>>([]);
  const [triggerHistory, setTriggerHistory] = useState<Array<[]>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const cId: string = router.query.id as string;

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

  const loadPipelineHistory = () => {
    setLoading(true);

    fetchAPI(`pipelines/${cId}/triggers`)
      .then((data: any) => {
        const res = data.triggers;
        setTriggerHistory(res);
        console.log(res, 'logtrigger');
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    loadPipelineHistory();
  }, [rerender]);

  const columns = [
    {
      id: 'content.name',
      header: 'Start Time',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
          key={row.index}>
          <Text as="p" variant="pM">
            {row.original.start_time
              ? row.original.start_time.replace('T', ' ').replace(/-/g, '/')
              : ''}
          </Text>
        </Box>
      ),
      enableSorting: false,
    },
    {
      id: 'content.id',
      header: 'TASK ID',
      accessorKey: 'content.id',
      enableSorting: false,
      cell: ({ row }: any) => {
        return <Box sx={{ fontSize: 'sm' }}>{row.original?.id}</Box>;
      },
    },
    {
      id: 'content.name',
      header: 'End Time',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
          key={row.index}>
          <Text as="p" variant="pM">
            {row.original.end_time
              ? row.original.end_time.replace('T', ' ').replace(/-/g, '/')
              : ''}
          </Text>
        </Box>
      ),
      enableSorting: false,
    },
    {
      id: 'content.status',
      header: (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Text as="p" variant="pS">
            Status
          </Text>
        </Box>
      ),
      accessorKey: 'content.status',
      cell: ({ row }: any) => (
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
          key={row.index}>
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
        </Box>
      ),
      enableSorting: false,
    },
    {
      id: 'content.name',
      header: (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Text as="p" variant="pS">
            Message
          </Text>
        </Box>
      ),
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Text as="p" variant="pM">
            {row.original.state == 'pending'
              ? `${row.original.error.info}`
              : row.original.state === 'partially_completed'
                ? `${row.original.error.info}`
                : row.original.state === 'success'
                  ? 'Build complete'
                  : 'failed to start build'}
          </Text>
        </Box>
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
