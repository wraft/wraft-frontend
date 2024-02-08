import React, { FC, useEffect, useState } from 'react';

import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import { EllipsisHIcon, FontIcon } from '@wraft/icon';
import toast from 'react-hot-toast';
import { Box, Flex, Text, useThemeUI } from 'theme-ui';

import { fetchAPI, deleteAPI } from '../utils/models';

import { Button, ConfirmDelete, Table } from './common';
import Modal from './Modal';
import Link from './NavLink';

export interface Theme {
  total_pages: number;
  total_entries: number;
  themes: ThemeElement[];
  page_number: number;
}
export interface ThemeElement {
  updated_at: string;
  typescale: any;
  name: string;
  inserted_at: string;
  id: string;
  font: string;
  file: null;
}

const Form: FC = () => {
  const { theme } = useThemeUI();
  const [contents, setContents] = useState<Array<ThemeElement>>([]);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [deleteTheme, setDeleteTheme] = useState<number | null>(null);
  const [rerender, setRerender] = useState<boolean>(false);

  const loadData = () => {
    const getRequest = fetchAPI('themes?sort=inserted_at_desc');
    toast.promise(
      getRequest,
      {
        loading: 'Loading...',
        success: (data: any) => {
          const res: ThemeElement[] = data.themes;
          console.log('theme', res);
          setContents(res);
          return 'Successfully loaded theme';
        },
        error: 'Failed to load theme',
      },
      {
        position: 'top-right',
        duration: 1000,
      },
    );
  };

  const onDelete = (id: string) => {
    const deleteRequest = deleteAPI(`themes/${id}`);
    toast.promise(
      deleteRequest,
      {
        loading: 'Loading...',
        success: () => {
          setRerender((prev) => !prev);
          return 'Successfully deleted theme';
        },
        error: 'Failed to delete theme',
      },
      {
        position: 'top-right',
        duration: 1000,
      },
    );
  };

  useEffect(() => {
    loadData();
  }, [rerender]);

  const columns = [
    {
      id: 'content.name',
      header: 'NAME',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Box key={row.index}>
          <Link href={`/manage/themes/edit/${row.original.id}`}>
            <Text as="p" variant="pM">
              {row.original.name}
            </Text>
            {row.original.primary && <Box sx={{ bg: 'red' }}>Primary</Box>}
          </Link>
        </Box>
      ),
      size: 50,
      enableSorting: false,
    },
    {
      id: 'content.font',
      header: 'FONT',
      accessorKey: 'content.font',
      cell: ({ row }: any) => (
        <Flex key={row.index} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              bg: 'neutral.200',
              height: '14px',
              width: '14px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '2px',
            }}>
            <FontIcon height={12} width={12} viewBox="0 0 24 24" />
          </Box>
          <Text as="p" variant="pM" sx={{ color: 'gray.300', ml: 2 }}>
            {row.original.font}
          </Text>
        </Flex>
      ),
      size: 50,
      enableSorting: false,
    },
    {
      id: 'content.id',
      header: '',
      accessor: 'content.id',
      cell: ({ row }: any) => {
        return (
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
                    setDeleteTheme(row.index);
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
                isOpen={deleteTheme === row.index}
                onClose={() => setDeleteTheme(null)}>
                {
                  <ConfirmDelete
                    title="Delete Theme"
                    text={`Are you sure you want to delete ‘${row.original.name}’?`}
                    setOpen={setDeleteTheme}
                    onConfirmDelete={async () => {
                      onDelete(row.original.id);
                    }}
                  />
                }
              </Modal>
            </MenuProvider>
          </Box>
        );
      },
      size: 10,
    },
  ];

  return (
    <Box>
      <Table data={contents} columns={columns} />
    </Box>
  );
};
export default Form;
