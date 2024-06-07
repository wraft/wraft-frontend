import React, { FC, useEffect, useState } from 'react';
import NavLink from 'next/link';
import { MenuProvider, Menu, MenuItem, MenuButton } from '@ariakit/react';
import { Button, Table } from '@wraft/ui';
import { Box, Text } from 'theme-ui';

import { TimeAgo } from 'components/Atoms';
import { DotsVerticalRounded } from 'components/Icons';
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
        <Box sx={{ fontSize: 'base', fontWeight: 500 }}>
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
    id: 'content.name',
    header: 'ACTION',
    cell: () => (
      <>
        <MenuProvider>
          <MenuButton>
            <Button variant="secondary">
              <DotsVerticalRounded width={16} height={16} />
            </Button>
          </MenuButton>
          <Menu
            as={Box}
            aria-label="Manage Block"
            sx={{
              border: 'solid 1px',
              borderColor: 'border',
              borderRadius: 4,
              bg: 'neutral.100',
              color: 'text',
              zIndex: 1,
            }}>
            <Button
              variant="secondary"
              onClick={() => {
                // onDelete(id);
              }}>
              Delete
            </Button>
            <MenuItem as={Box} sx={{ width: '100%', px: 3 }}>
              <NavLink href={`/manage/blocks/edit/[id]`}>
                <Text sx={{ fontSize: 'xxs', fontWeight: 500 }}>Edit</Text>
              </NavLink>
            </MenuItem>
          </Menu>
        </MenuProvider>
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
