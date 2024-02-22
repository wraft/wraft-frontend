import React, { useEffect, useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import { EllipsisHIcon, FontIcon } from '@wraft/icon';
import toast from 'react-hot-toast';
import { Box, Flex, Text, useThemeUI } from 'theme-ui';
import { Button, Table } from '@wraft/ui';

import { fetchAPI, deleteAPI } from '../utils/models';
import { ConfirmDelete } from './common';
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

type Props = {
  rerender: any;
  setRerender: (e: any) => void;
};

const Form = ({ rerender, setRerender }: Props) => {
  const { theme } = useThemeUI();
  const [contents, setContents] = useState<Array<ThemeElement>>([]);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [deleteTheme, setDeleteTheme] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = () => {
    setLoading(true);

    fetchAPI('themes?sort=inserted_at_desc')
      .then((data: any) => {
        const res: ThemeElement[] = data.themes;
        setContents(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDelete = (id: string) => {
    const deleteRequest = deleteAPI(`themes/${id}`);
    toast.promise(
      deleteRequest,
      {
        loading: 'Loading...',
        success: () => {
          setRerender((prev: boolean) => !prev);
          setDeleteTheme(null);
          return 'Successfully deleted theme';
        },
        error: 'Failed to delete theme',
      },
      {
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
          <Link href={`/manage/themes/${row.original.id}`}>
            <Text as="p" variant="pM">
              {row.original.name}
            </Text>
          </Link>
        </Box>
      ),
      size: 200,
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
      size: 180,
      enableSorting: false,
    },
    {
      id: 'content.color',
      header: 'COLOR',
      accessorKey: 'content.color',
      cell: ({ row }: any) => (
        <Flex key={row.index} sx={{ alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              height: '12px',
              width: '12px',
              borderRadius: '2px',
              bg: `${row.original.primary_color}`,
            }}
          />
          <Box
            sx={{
              height: '12px',
              width: '12px',
              borderRadius: '2px',
              bg: `${row.original.secondary_color}`,
            }}
          />
          <Box
            sx={{
              height: '12px',
              width: '12px',
              borderRadius: '2px',
              bg: `${row.original.body_color}`,
            }}
          />
        </Flex>
      ),
      enableSorting: false,
    },
    {
      id: 'content.id',
      header: '',
      accessor: 'content.id',
      cell: ({ row }: any) => {
        return (
          <Flex>
            <Box />

            <Box ml={'auto'}>
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
          </Flex>
        );
      },
      size: 10,
    },
  ];

  return (
    <Box>
      <Table data={contents} columns={columns} isLoading={loading} />
    </Box>
  );
};
export default Form;
