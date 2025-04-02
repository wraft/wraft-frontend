import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Avatar } from 'theme-ui';
import { Table, Flex, Text } from '@wraft/ui';

import { StateBadge, TimeAgo } from 'common/Atoms';
import { ContentTitleList } from 'common/content';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI } from 'utils/models';

const columns = [
  {
    id: 'content.id',
    header: 'Name',
    accessorKey: 'content.id',
    cell: ({ row }: any) => (
      <NextLink href={`/documents/${row.original?.content?.id}`}>
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
    header: 'Date',
    accessorKey: 'date',
    cell: ({ row }: any) => (
      <TimeAgo time={row.original?.content?.updated_at} />
    ),
    enableSorting: false,
  },
  {
    id: 'creator.profile_pic',
    header: 'Editors',
    accessorKey: 'creator.profile_pic',
    cell: ({ row }: any) => (
      <Flex alignItems="center" gap="8px">
        <Avatar
          sx={{ width: '16px', height: '16px' }}
          src={row.original?.creator?.profile_pic}
        />
        <Text>{row.original?.creator?.name}</Text>
      </Flex>
    ),
    enableSorting: false,
  },
  {
    header: 'Status',
    accessorKey: 'age',
    cell: ({ row }: any) => (
      <StateBadge name={row.original?.state?.state} color="#E2F7EA" />
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
      {/* <Text fontSize="lg" fontWeight="heading" mb="lg" mt="xl">
        Recent Documents
      </Text> */}

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
