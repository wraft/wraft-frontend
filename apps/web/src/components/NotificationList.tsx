import { useEffect, useState } from 'react';
import { Box } from 'theme-ui';
import { Table } from '@wraft/ui';

import { fetchAPI } from 'utils/models';

import { TimeAgo } from './Atoms';

const NotificationList = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    fetchAPI('notifications')
      .then((data: any) => {
        setLoading(false);
        const res = data.notifications;
        setContents(res);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      id: 'content.message',
      header: 'MESSAGE',
      accessorKey: 'content.message',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => {
        return (
          <Box sx={{ fontSize: 'sm', fontWeight: '600' }}>
            {row.original?.notification?.message}
          </Box>
        );
      },
    },
    {
      id: 'content.type',
      header: 'TYPE',
      accessorKey: 'content.type',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => {
        return (
          <Box sx={{ fontSize: 'sm' }}>{row.original?.notification?.type}</Box>
        );
      },
    },
    {
      id: 'content.updated_at',
      header: 'LAST UPDATED',
      accessorKey: 'content.updated_at',
      enableSorting: false,
      cell: ({ row }: any) => {
        return (
          row.original.updated_at && <TimeAgo time={row.original?.updated_at} />
        );
      },
    },
  ];

  return (
    <Box py={3} mb={4}>
      <Box mx={0} mb={3}>
        <Box>
          <Box sx={{ width: '100%' }}>
            <Box mx={0} mb={3} sx={{ width: '100%' }}>
              <Table
                data={contents}
                columns={columns}
                isLoading={loading}
                emptyMessage="No Notifications yet."
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationList;
