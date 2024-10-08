import React, { FC, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import { EllipsisHIcon } from '@wraft/icon';
import toast from 'react-hot-toast';
import { Box, Flex, Text, useThemeUI, Avatar } from 'theme-ui';
import { Button, Table, Pagination } from '@wraft/ui';

import FlowForm from 'components/FlowForm';
import ConfirmDelete from 'common/ConfirmDelete';
import Modal from 'common/Modal';
import { TimeAgo } from 'common/Atoms';
import { Drawer } from 'common/Drawer';
import { deleteAPI, fetchAPI } from 'utils/models';

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
export interface IFlow {
  name: string;
  inserted_at: string;
  id: string;
  email: string;
}

export interface ICreator {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  email: string;
}

export interface IField {
  user_count: number;
  id: string;
  name: string;
  flow: IFlow;
  creator: ICreator;
}

export interface IFieldItem {
  name: string;
  type: string;
}

interface Props {
  rerender: boolean;
  setRerender: any;
}

const Form: FC<Props> = ({ rerender, setRerender }) => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [pageMeta, setPageMeta] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [deleteFlow, setDeleteFlow] = useState<number | null>(null);

  const { theme } = useThemeUI();

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;

  const loadData = (pageNumber: number) => {
    setLoading(true);
    const query =
      pageNumber > 0 ? `?page=${pageNumber}&sort=inserted_at_desc` : '';
    fetchAPI(`flows${query}`)
      .then((data: any) => {
        setLoading(false);
        const res: IField[] = data.flows;
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

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

  useEffect(() => {
    loadData(page);
  }, [page, rerender]);

  const onDelete = (index: number) => {
    setDeleteFlow(null);
    setIsOpen(null);
    deleteAPI(`flows/${contents[index].flow.id}`).then(() => {
      setRerender((prev: boolean) => !prev);
      toast.success('Deleted a flow', {
        duration: 1000,
        position: 'top-right',
      });
    });
  };

  const columns = [
    {
      id: 'content.name',
      header: 'NAME',
      accessorKey: 'content.name',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => {
        return (
          <>
            <NextLink href={`/manage/flows/${row.original?.flow?.id}`}>
              <Box sx={{ fontSize: 'sm' }}>{row.original?.flow?.name}</Box>
            </NextLink>
            <Drawer open={false} setOpen={() => {}}>
              <FlowForm setOpen={() => {}} />
            </Drawer>
          </>
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
          row.original.flow.updated_at && (
            <TimeAgo time={row.original?.flow?.updated_at} />
          )
        );
      },
    },
    {
      id: 'content.created',
      header: 'CREATED BY',
      accessorKey: 'created',
      cell: ({ row }: any) => (
        <Flex sx={{ alignItems: 'center', gap: '8px' }}>
          <Avatar
            sx={{ width: '16px', height: '16px' }}
            src={row.original?.creator?.profile_pic}
          />
          <Box sx={{ fontSize: 'sm' }}>{row.original?.creator?.name}</Box>
        </Flex>
      ),
      enableSorting: false,
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
                          theme.colors.gray[200]) ||
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
                      setDeleteFlow(row.index);
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
              isOpen={deleteFlow === row.index}
              onClose={() => setDeleteFlow(null)}>
              {
                <ConfirmDelete
                  title="Delete Flow"
                  text={`Are you sure you want to delete ‘${row.original.flow.name}’?`}
                  setOpen={setDeleteFlow}
                  onConfirmDelete={async () => {
                    onDelete(row.index);
                  }}
                />
              }
            </Modal>
          </>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <Box mx={0} mb={3} sx={{ width: '100%' }}>
          <Table data={contents} columns={columns} isLoading={loading} />
        </Box>
        <Box mx={2}>
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
    </Box>
  );
};
export default Form;
