import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Box, Flex } from 'theme-ui';
import { Table } from '@wraft/ui';
import { useAuth } from 'contexts/AuthContext';

import { TimeAgo } from 'components/Atoms';
// import { EmptyForm } from 'components/Icons';
import { fetchAPI, deleteAPI } from 'utils/models';

/**
 * DocType Cards
 * -------------
 *
 * @returns
 */

interface DocCardProps {
  id: any;
  name?: string;
  color?: string;
  isEdit?: boolean;
}

export interface ILayout {
  width: number;
  updated_at: string;
  unit: string;
  slug: string;
  name: string;
  id: string;
  height: number;
  description: string;
}

export interface IField {
  id: string;
  name: string;
  layout_id: string;
  layout: ILayout;
  description: string;
}

export interface IFieldItem {
  name: string;
  type: string;
}

interface ContentTypeDashboardProps {
  isEdit?: boolean;
}

const columns = [
  {
    id: 'title',
    header: 'Name',
    accessorKey: 'title',
    cell: ({ row }: any) => (
      <NextLink href={`/blocks/edit/${row?.original?.id}`}>
        <Flex sx={{ fontSize: '12px', ml: '-16px', py: 2 }}>
          <Box
            sx={{
              width: '4px',
              bg: row.original?.color ? row.original?.color : 'blue',
            }}
          />
          <Box ml={3}>
            <Box sx={{ fontSize: '15px', fontWeight: 500 }}>
              {row?.original?.name}
            </Box>
          </Box>
        </Flex>
      </NextLink>
    ),
    size: '350',
    enableSorting: false,
  },
  {
    id: 'content.updated_at',
    header: 'CREATE',
    accessorKey: 'TIME',
    cell: ({ row }: any) => (
      <Box>
        <TimeAgo time={row.original?.updated_at} />
      </Box>
    ),
    enableSorting: false,
  },
  {
    id: 'content.name',
    header: 'ACTION',
    cell: () => <Box>Edit</Box>,
    enableSorting: false,
    textAlign: 'right',
  },
];

const ContentTypeDashboard = ({ isEdit }: ContentTypeDashboardProps) => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { accessToken } = useAuth();

  const delData = (id: string) => {
    deleteAPI(`content_types/${id}`);
  };

  const loadData = () => {
    setLoading(true);
    fetchAPI('content_types?sort=inserted_at_desc')
      .then((data: any) => {
        setLoading(false);
        const res: IField[] = data.content_types;
        setContents(res);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [accessToken]);

  console.log('loading[ww]', loading);

  return (
    <Box>
      <Table
        data={contents}
        isLoading={loading}
        columns={columns}
        skeletonRows={10}
        emptyMessage="No blocks has been created yet."
      />
    </Box>
  );
};
export default ContentTypeDashboard;
