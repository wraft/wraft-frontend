import React, { useEffect, useState } from 'react';
import { FontIcon } from '@wraft/icon';
import toast from 'react-hot-toast';
import { Box, DropdownMenu, Flex, Text, Modal } from '@wraft/ui';
import { Table } from '@wraft/ui';
import { DotsThree } from '@phosphor-icons/react';

import ConfirmDelete from 'common/ConfirmDelete';
import Link from 'common/NavLink';
import { fetchAPI, deleteAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

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
};

const ThemeList = ({ rerender }: Props) => {
  const [contents, setContents] = useState<Array<ThemeElement>>([]);
  const [deleteTheme, setDeleteTheme] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { hasPermission } = usePermission();

  useEffect(() => {
    loadData();
  }, [rerender]);

  const loadData = async () => {
    setLoading(true);

    try {
      const res: any = await fetchAPI('themes?sort=inserted_at_desc');
      setContents(res.themes);
    } catch (err) {
      console.error('Error loading themes:', err);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      const request = deleteAPI(`themes/${id}`);
      await request;
      toast.success('Successfully deleted theme');
    } catch (err) {
      console.error('Error deleting theme:', err);
      toast.error('Failed to delete theme');
    }
  };

  const columns = [
    {
      id: 'content.name',
      header: 'Name',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Link href={`/manage/themes/${row.original.id}`} key={row.index}>
          <Text fontWeight={500}>{row.original.name}</Text>
        </Link>
      ),
      enableSorting: false,
    },
    {
      id: 'content.font',
      header: 'Font',
      accessorKey: 'content.font',
      cell: ({ row }: any) => (
        <Flex key={row.index} align="center" gap="xs" py="0">
          <FontIcon height={18} width={18} />
          <Text fontWeight="500" fontSize="sm2">
            {row.original.font}
          </Text>
        </Flex>
      ),
      enableSorting: false,
    },
    {
      id: 'content.color',
      header: 'Colors',
      accessorKey: 'content.color',
      cell: ({ row }: any) => (
        <Flex key={row.index} align="center" gap="sm">
          <Box
            h="12px"
            w="12px"
            borderRadius="sm"
            bg={row.original.primary_color}
          />
          <Box
            h="12px"
            w="12px"
            borderRadius="sm"
            bg={row.original.secondary_color}
          />
          <Box
            h="12px"
            w="12px"
            borderRadius="sm"
            bg={row.original.body_color}
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
          <Flex justify="space-between">
            <DropdownMenu.Provider>
              <DropdownMenu.Trigger>
                <DotsThree size={12} color="red" />
              </DropdownMenu.Trigger>
              {hasPermission('theme', 'delete') && (
                <DropdownMenu aria-label="dropdown role">
                  <DropdownMenu.Item onClick={() => setDeleteTheme(row.index)}>
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu>
              )}
            </DropdownMenu.Provider>
            <Modal
              ariaLabel="delete theme"
              open={deleteTheme === row.index}
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
          </Flex>
        );
      },
      size: 10,
    },
  ];

  return (
    <Box w="100%">
      <Table data={contents} columns={columns} isLoading={loading} />
    </Box>
  );
};
export default ThemeList;
