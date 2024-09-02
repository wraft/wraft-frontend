import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Avatar, Box, Flex } from 'theme-ui';
import { Table } from '@wraft/ui';
import ContentTitleList from '@wraft-ui/content/ContentTitleList';

import { StateBadge, TimeAgo } from 'components/Atoms';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI } from 'utils/models';

const columns = [
  {
    id: 'content.id',
    header: 'NAME',
    accessorKey: 'content.id',
    cell: ({ row }: any) => (
      <NextLink href={`/content/${row.original?.content?.id}`}>
        <ContentTitleList
          contentType={row.original?.content_type}
          content={row.original?.content}
        />
      </NextLink>
    ),
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
    enableSorting: false,
  },
  {
    id: 'creator.profile_pic',
    header: 'EDITORS',
    accessorKey: 'creator.profile_pic',
    cell: ({ row }: any) => (
      <Flex>
        <Avatar width="20px" src={row.original?.creator?.profile_pic} />
        <Box sx={{ fontSize: 'sm', ml: 3 }}>{row.original?.creator?.name}</Box>
      </Flex>
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
];

const PendingDocumentBlock = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [contents, setContents] = useState<any>([]);

  const { userProfile } = useAuth();

  useEffect(() => {
    loadData(1);
  }, [userProfile?.organisation_id]);

  const loadData = (page: number) => {
    setLoading(true);
    const pageNo = page > 0 ? `?page=${page}&sort=inserted_at_desc` : '';
    fetchAPI(`contents${pageNo}`)
      .then((data: any) => {
        const res: any = data.contents;
        setContents(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <Box
        sx={{
          fontSize: 'base',
          fontWeight: 500,
          mb: '18px',
          mt: '36px',
        }}>
        Recent Documents
      </Box>

      <Table
        data={contents}
        isLoading={loading}
        columns={columns}
        skeletonRows={8}
      />
    </>
  );
};

export default PendingDocumentBlock;
