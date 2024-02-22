import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Box, Flex, Avatar, Button } from 'theme-ui';
import { Table } from '@wraft/ui';

import PageHeader from 'components/PageHeader';
import { StateBadge, TimeAgo } from 'components/Atoms';
import { useAuth } from 'contexts/AuthContext';
import { putAPI, fetchAPI } from 'utils/models';

export interface ApprovalList {
  pre_state: State;
  post_state: State;
  instance: Instance;
  approved: boolean;
}

export interface ApprovaSystemItem {
  approval_system_id: string;
  approved_at?: string;
  flag: boolean;
  id: string;
  instance_id: string;
  rejected_at?: string;
}

export interface Instance {
  stete_id: string;
  state: string;
  id: string;
}

export interface State {
  state: string;
  id: string;
}

const columns = (approveInstance: any) => [
  {
    id: 'content.name',
    header: 'Name',
    accessorKey: 'content.name',
    cell: ({ row }: any) => (
      <NextLink href={`/content/${row.original?.content?.id}`}>
        <Flex sx={{ fontSize: '12px', ml: '-16px' }}>
          <Box
            sx={{
              width: '3px',
              bg: row.original?.content_type?.color
                ? row.original?.content_type?.color
                : 'blue',
            }}
          />
          <Box ml={3}>
            <Box>{row.original?.content?.instance_id}</Box>
            <Box>{row.original?.content?.serialized?.title}</Box>
          </Box>
        </Flex>
      </NextLink>
    ),
    size: 300,
    enableSorting: false,
  },
  {
    id: 'content.updated_at',
    header: 'TIME',
    accessorKey: 'TIME',
    cell: ({ row }: any) => (
      <Box>
        <TimeAgo time={row.original?.content?.updated_at} />
      </Box>
    ),
    size: 300,
    enableSorting: false,
  },
  {
    id: 'creator.profile_pic',
    header: 'EDITORS',
    accessorKey: 'creator.profile_pic',
    cell: ({ row }: any) => (
      <Box sx={{ height: '20px' }}>
        <Avatar width="20px" src={row.original?.creator?.profile_pic} />
      </Box>
    ),
    enableSorting: false,
  },
  {
    header: 'STATUS',
    accessorKey: 'age',
    cell: ({ row }: any) => (
      <Box>
        <StateBadge name={row.original?.state?.state} color="#E2F7EA" />
      </Box>
    ),
    enableSorting: false,
    textAlign: 'right',
  },
  {
    header: 'ACTION',
    accessorKey: 'action',
    cell: ({ row }: any) => (
      <Flex sx={{ mr: 1, p: 2 }}>
        <Flex>
          <Box sx={{ mr: 2 }}>
            <Button variant="btnSecondary" sx={{ mr: 1 }}>
              Review
            </Button>
          </Box>
          <Box>
            <Button
              variant="btnAction"
              onClick={() => approveInstance(row?.original?.instance?.id)}>
              Approve
            </Button>
          </Box>
        </Flex>
      </Flex>
    ),
    enableSorting: false,
    textAlign: 'right',
  },
];

const Approvals = () => {
  const [contents, setContents] = useState<Array<ApprovaSystemItem>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // const { addToast } = useToasts();

  const { accessToken } = useAuth();

  const loadData = () => {
    setLoading(true);
    fetchAPI('users/instance-approval-systems')
      .then((data: any) => {
        setLoading(false);
        const res: ApprovaSystemItem[] = data.instance_approval_systems;
        setContents(res);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (accessToken) {
      loadData();
    }
  }, [accessToken]);

  /**
   * Approve an Instance
   */

  const approveInstance = (id: string) => {
    putAPI(`contents/${id}/approve`).then(() => {
      console.log('onApproved');
    });
  };

  return (
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'neutral.100' }}>
      <PageHeader title="Approvals" desc="All Approvals across your feeds">
        <Box sx={{ ml: 'auto' }}></Box>
      </PageHeader>
      <Box mx={0} mb={3} variant="layout.pageFrame">
        <Flex>
          <Box mx={0} mb={3} sx={{ width: '75%' }}>
            <Table
              data={contents}
              isLoading={loading}
              columns={columns(approveInstance)}
              skeletonRows={10}
              emptyMessage="Nothing to approve"
            />
          </Box>
          <Box
            sx={{
              bg: 'backgroundWhite',
              minHeight: '100vh',
              width: '25%',
              borderLeft: 'solid 1px',
              borderColor: 'border',
            }}></Box>
        </Flex>
      </Box>
    </Box>
  );
};
export default Approvals;
