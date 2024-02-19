import React, { FC, useEffect, useState } from 'react';

import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import { EllipsisHIcon } from '@wraft/icon';
import { Drawer } from '@wraft-ui/Drawer';
import Router from 'next/router';
import toast from 'react-hot-toast';
import { Box, Flex, Spinner, Text, useThemeUI } from 'theme-ui';

import { deleteAPI, fetchAPI } from '../utils/models';

import { TimeAgo } from './Atoms';
import { Button, ConfirmDelete, Table } from './common';
import FlowForm from './FlowForm';
import Modal from './Modal';
import Paginate, { IPageMeta } from './Paginate';

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
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [deleteFlow, setDeleteFlow] = useState<number | null>(null);

  const { theme } = useThemeUI();

  const loadData = (page: number) => {
    const pageNo = page > 0 ? `?page=${page}&sort=inserted_at_desc` : '';
    fetchAPI(`flows${pageNo}`)
      .then((data: any) => {
        setLoading(true);
        const res: IField[] = data.flows;
        setTotal(data.total_pages);
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setLoading(true);
      });
  };

  const changePage = (_e: any) => {
    setPage(_e?.selected + 1);
  };

  useEffect(() => {
    loadData(page);
  }, [page, rerender]);

  const onDelete = (index: number) => {
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
      header: 'Name',
      accessorKey: 'content.name',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => {
        console.log('roooooooooooooooo', row);
        return (
          <Button
            variant="text"
            onClick={() => {
              // setIsEdit(row.index);
              Router.push(`/manage/flows/${row.original?.flow?.id}`);
            }}>
            <Box>
              <Box>{row.original?.flow?.name}</Box>
            </Box>
            <Drawer open={false} setOpen={() => {}}>
              <FlowForm
                setOpen={() => {}}
                // cId={row.original.id}
              />
            </Drawer>
          </Button>
        );
      },
    },
    {
      id: 'content.updated_at',
      header: 'Updated',
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
      id: 'content.id',
      header: '',
      accessor: 'content.id',
      enableSorting: false,
      cell: ({ row }: any) => {
        return (
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
                open={isOpen == row.index}
                onClose={() => setIsOpen(null)}>
                <Button
                  variant="text"
                  onClick={() => {
                    setIsOpen(null);
                    setDeleteFlow(row.index);
                  }}>
                  <MenuItem as={Box} px={3} py={2}>
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
            </MenuProvider>
          </Flex>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box mx={0} sx={{ width: '100%' }}>
        {!loading && (
          <Box>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}

        <Box sx={{ width: '100%' }}>
          <Box mx={0} mb={3} sx={{ width: '100%' }}>
            {contents && <Table data={contents} columns={columns} />}
          </Box>
          <Box mx={2}>
            <Paginate
              changePage={changePage}
              {...pageMeta}
              info={`${page} of ${total} pages`}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default Form;
