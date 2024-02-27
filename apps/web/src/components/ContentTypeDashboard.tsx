import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Flex, Text } from 'theme-ui';
import { Pagination, Table } from '@wraft/ui';
import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';

import { TimeAgo } from 'components/Atoms';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, deleteAPI } from 'utils/models';

import { OptionsIcon } from './Icons';
import Modal from './Modal';
import { ConfirmDelete } from './common';

/**
 * DocType Cards
 * -------------
 *
 * @returns
 */

// interface DocCardProps {
//   id: any;
//   name?: string;
//   color?: string;
//   isEdit?: boolean;
// }

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

// interface ContentTypeDashboardProps {
//   isEdit?: boolean;
// }
interface Props {
  rerender: boolean;
}

const ContentTypeDashboard = ({ rerender }: Props) => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageMeta, setPageMeta] = useState<any>();
  const [page, setPage] = useState<number>();
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [deleteVariant, setDeleteVariant] = useState<number | null>(null);

  const { accessToken } = useAuth();

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;

  useEffect(() => {
    if (page) {
      loadData(page);
    }
  }, [page]);

  useEffect(() => {
    loadData(1);
  }, [rerender]);

  const onDelete = (id: string) => {
    deleteAPI(`content_types/${id}`);
  };

  const loadData = (page: number) => {
    setLoading(true);

    const query = `?page=${page}&sort=inserted_at_desc`;
    fetchAPI(`content_types${query}`)
      .then((data: any) => {
        setLoading(false);
        const res: IField[] = data.content_types;
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData(currentPage);
  }, [accessToken]);

  const changePage = (newPage: any) => {
    setPage(newPage);
    const currentPath = router.pathname;
    const currentQuery = { ...router.query, page: newPage };
    router.push(
      {
        pathname: currentPath,
        query: currentQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  console.log('loading[ww]', loading);

  const columns = [
    {
      id: 'title',
      header: 'NAME',
      accessorKey: 'title',
      cell: ({ row }: any) => (
        <NextLink href={`/content-types/${row?.original?.id}`}>
          <Flex sx={{ fontSize: '12px', ml: '-14px', py: 2 }}>
            <Box
              sx={{
                width: '3px',
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
      enableSorting: false,
    },
    {
      id: 'content.updated_at',
      header: 'CREATED AT',
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
      header: '',
      cell: ({ row }: any) => (
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Box />
          <Box>
            <MenuProvider>
              <MenuButton
                as={Box}
                variant="none"
                sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    margin: '0px',
                    padding: '0px',
                    bg: 'transparent',
                    ':disabled': {
                      display: 'none',
                    },
                  }}
                  onClick={() => {
                    setIsOpen(row.index);
                  }}>
                  <OptionsIcon />
                </Box>
              </MenuButton>
              <Menu
                as={Box}
                variant="layout.menu"
                open={isOpen == row.index}
                onClose={() => setIsOpen(null)}>
                <MenuItem>
                  <Button
                    variant="base"
                    onClick={() => {
                      setIsOpen(null);
                      setDeleteVariant(row.index);
                    }}>
                    <Text
                      variant=""
                      sx={{ cursor: 'pointer', color: 'red.600' }}>
                      Delete
                    </Text>
                  </Button>
                </MenuItem>
              </Menu>
              <Modal
                isOpen={deleteVariant === row.index}
                onClose={() => setDeleteVariant(null)}>
                {
                  <ConfirmDelete
                    title="Delete Variant"
                    text={`Are you sure you want to delete ‘${row.original.name}’?`}
                    setOpen={setDeleteVariant}
                    onConfirmDelete={async () => {
                      onDelete(row.original.id);
                    }}
                  />
                }
              </Modal>
            </MenuProvider>
          </Box>
        </Flex>
      ),

      enableSorting: false,
      textAlign: 'right',
    },
  ];

  return (
    <Box>
      <Table
        data={contents}
        isLoading={loading}
        columns={columns}
        skeletonRows={10}
        emptyMessage="No blocks has been created yet."
      />
      <Box mt="16px">
        {pageMeta && pageMeta?.total_pages > 1 && (
          <Pagination
            totalPage={pageMeta?.total_pages}
            initialPage={currentPage}
            onPageChange={changePage}
            totalEntries={pageMeta?.total_entries}
          />
        )}
      </Box>
    </Box>
  );
};
export default ContentTypeDashboard;
