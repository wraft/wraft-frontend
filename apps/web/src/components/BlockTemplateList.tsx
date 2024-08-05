import React, { FC, useEffect, useState } from 'react';
import NavLink from 'next/link';
import { Table, DropdownMenu } from '@wraft/ui';
import { Box, Text, Flex, Avatar } from 'theme-ui';
import { ThreeDotIcon } from '@wraft/icon';

import { TimeAgo } from 'components/Atoms';
import Link from 'components/NavLink';
import PageHeader from 'components/PageHeader';
import { fetchAPI } from 'utils/models';

export interface IField {
  id: string;
  title: string;
  body: string;
  serialized: string;
}

export interface IFieldItem {
  name: string;
  type: string;
}

const columns = [
  {
    id: 'title',
    header: 'Name',
    accessorKey: 'title',
    cell: ({ row }: any) => (
      <NavLink href={`/blocks/edit/${row?.original?.id}`}>
        <Box sx={{ fontSize: 'sm', fontWeight: 500 }}>
          {row?.original?.title}
        </Box>
      </NavLink>
    ),
    size: '350',
    enableSorting: false,
  },
  {
    id: 'content.updated_at',
    header: 'TIME',
    accessorKey: 'TIME',
    cell: ({ row }: any) => (
      <Box>
        <TimeAgo time={row.original?.updated_at} />
      </Box>
    ),
    enableSorting: false,
  },
  {
    id: 'content.created',
    header: 'CREATED BY',
    accessorKey: 'created',
    cell: ({ row }: any) => (
      <Flex>
        <Avatar width="20px" src={row.original?.creator?.profile_pic} />
        <Box sx={{ fontSize: 'sm', ml: 3 }}>{row.original?.creator?.name}</Box>
      </Flex>
    ),
    enableSorting: false,
  },
  {
    id: 'content.name',
    header: '',
    cell: ({ row }: any) => (
      <>
        <Flex sx={{ justifyContent: 'flex-end' }}>
          <DropdownMenu.Provider>
            <DropdownMenu.Trigger>
              <ThreeDotIcon />
            </DropdownMenu.Trigger>
            <DropdownMenu aria-label="dropdown role">
              <DropdownMenu.Item>
                <NavLink href={`/blocks/edit/${row?.original?.id}`}>
                  <Text>Edit</Text>
                </NavLink>
              </DropdownMenu.Item>
              <DropdownMenu.Item>Delete</DropdownMenu.Item>
            </DropdownMenu>
          </DropdownMenu.Provider>
        </Flex>
      </>
    ),
    enableSorting: false,
    textAlign: 'right',
  },
];

const BlockTemplateListFrame: FC = () => {
  const [contents, setContents] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const loadData = () => {
    setLoading(true);
    fetchAPI('block_templates')
      .then((data: any) => {
        const res: any = data.block_templates;
        setContents(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Box>
      <PageHeader title="Blocks" desc="Re-usable Content blocks">
        <Box sx={{ ml: 'auto' }}>
          <Link href="/blocks/new" variant="secondary">
            + New Block
          </Link>
        </Box>
      </PageHeader>
      <Box variant="layout.pageFrame">
        <Box mx={0} mb={3}>
          <Table
            data={contents}
            isLoading={loading}
            columns={columns}
            skeletonRows={10}
            emptyMessage="No blocks has been created yet."
          />
          {/* <Styles>
            {contents && contents.length > 0 && (
              <Table columns={columns} data={contents} />
            )}
          </Styles> */}

          {/* <Box>
            {contents &&
              contents.length > 0 &&
              contents.map((m: any) => <ItemField key={m.id} {...m} />)}
          </Box> */}
        </Box>
      </Box>
    </Box>
  );
};
export default BlockTemplateListFrame;
