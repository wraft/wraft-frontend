import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Box, Text, Flex, useThemeUI } from 'theme-ui';
import { Button } from '@wraft/ui';
import { Pagination, Table } from '@wraft/ui';
import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import { EllipsisHIcon } from '@wraft/icon';

import { TimeAgo } from 'common/Atoms';
import Modal from 'common/Modal';
import ConfirmDelete from 'common/ConfirmDelete';
import { NextLinkText } from 'common/NavLink';
import { fetchAPI, deleteAPI } from 'utils/models';

export interface Theme {
  total_pages: number;
  total_entries: number;
  form_collections: FormElement[];
  page_number: number;
}

export interface FormElement {
  updated_at: string;
  title: string;
  inserted_at: string;
  id: string;
  description: string;
}

interface Meta {
  total_pages: number;
  total_entries: number;
  page_number: number;
}

type Props = {
  rerender: boolean;
  setRerender: (e: any) => void;
};

const FormList = ({ rerender, setRerender }: Props) => {
  const [contents, setContents] = useState<Array<FormElement>>([]);
  const [pageMeta, setPageMeta] = useState<Meta>();
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<number | null>(null);

  const { theme } = useThemeUI();

  const loadData = (pageNumber: number) => {
    setLoading(true);
    const query =
      pageNumber > 0 ? `?page=${pageNumber}&sort=inserted_at_desc` : '';
    fetchAPI(`forms${query}`)
      .then((data: any) => {
        setLoading(false);
        const res: FormElement[] = data.forms;
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDelete = (id: string) => {
    deleteAPI(`forms/${id}`).then(() => {
      setRerender((prev: boolean) => !prev);
      toast.success('Deleted Theme', {
        duration: 1000,
        position: 'top-right',
      });
    });
    setDeleteOpen(null);
  };

  useEffect(() => {
    loadData(page);
  }, [page, rerender]);

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;
  const columns = [
    {
      id: 'content.name',
      header: 'NAME',
      accessorKey: 'content.name',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => {
        return (
          <NextLinkText href={`/forms/${row.original?.id}`}>
            <Box sx={{ fontSize: 'sm', fontWeight: '600' }}>
              {row.original?.name}
            </Box>
          </NextLinkText>
        );
      },
    },
    {
      id: 'content.description',
      header: 'DESCRIPTION',
      accessorKey: 'content.description',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => {
        return <Box sx={{ fontSize: 'sm' }}>{row.original?.description}</Box>;
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
    {
      id: 'content.id',
      header: '',
      accessor: 'content.id',
      enableSorting: false,
      cell: ({ row }: any) => {
        return (
          <>
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Box />
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
                    <EllipsisHIcon
                      color={
                        (theme.colors &&
                          theme.colors.gray &&
                          theme.colors.gray[800]) ||
                        'black'
                      }
                    />
                  </Box>
                </MenuButton>
                <Menu
                  as={Box}
                  variant="layout.menu"
                  sx={{ p: 0 }}
                  open={isOpen == row.index}
                  onClose={() => setIsOpen(null)}>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsOpen(null);
                      setDeleteOpen(row.index);
                    }}
                    style={{ justifyContent: 'flex-start' }}>
                    <MenuItem as={Box}>
                      <Text
                        variant="pR"
                        sx={{
                          cursor: 'pointer',
                          color: 'red.600',
                        }}>
                        Delete
                      </Text>
                    </MenuItem>
                  </Button>
                </Menu>
              </MenuProvider>
            </Flex>
            <Modal
              isOpen={deleteOpen === row.index}
              onClose={() => setDeleteOpen(null)}>
              {
                <ConfirmDelete
                  title="Delete Form"
                  text={`Are you sure you want to delete ‘${row.original.name}’?`}
                  setOpen={setDeleteOpen}
                  onConfirmDelete={async () => {
                    onDelete(row.original.id);
                  }}
                />
              }
            </Modal>
          </>
        );
      },
    },
  ];

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
  return (
    <Box mb={4}>
      <Box mx={0} mb={3}>
        <Box>
          <Box sx={{ width: '100%' }}>
            <Box mx={0} mb={3} sx={{ width: '100%' }}>
              <Table
                data={contents}
                columns={columns}
                isLoading={loading}
                emptyMessage="No forms has been created yet."
              />
            </Box>
            <Box mx={2}>
              {pageMeta && pageMeta?.total_pages > 1 && (
                <Pagination
                  totalPage={pageMeta.total_pages}
                  initialPage={currentPage}
                  onPageChange={changePage}
                  totalEntries={pageMeta.total_entries}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FormList;
