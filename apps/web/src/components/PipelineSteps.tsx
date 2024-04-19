import React, { useEffect, useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import { DeleteIcon, EllipsisHIcon, FontIcon } from '@wraft/icon';
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

  useEffect(() => {
    loadData();
  }, [rerender]);

  const columns = [
    {
      id: 'content.name',
      header: 'NAME',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Box sx={{ display: 'flex' }} key={row.index}>
          <Link href={`/manage/themes/${row.original.id}`}>
            <Text as="p" variant="pM">
              {row.original.name}
            </Text>
          </Link>
        </Box>
      ),
      enableSorting: false,
    },
    {
      id: 'content.status',
      header: 'STATUS',
      cell: ({ row }: any) => (
        <Flex
          key={row.index}
          sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Text as="p" variant="pM" sx={{ color: 'gray.300', ml: 2 }}>
            Approved
          </Text>
        </Flex>
      ),
      enableSorting: false,
    },
    {
      id: 'content.state',
      header: 'STATE',
      cell: ({ row }: any) => (
        <Flex key={row.index} sx={{ justifyContent: 'flex-end', gap: 5 }}>
          <Text as="p" variant="pM" sx={{ color: 'gray.300', ml: 2 }}>
            Published
          </Text>
          <Box>
            <DeleteIcon />
          </Box>
        </Flex>
      ),
      enableSorting: false,
    },
  ];

  return (
    <Box>
      <Table data={contents} columns={columns} isLoading={loading} />
      <Box mt="auto" mb="4">
        <Box className="first-step" py={4}>
          <Button variant="secondary">+ Add pipeline step</Button>
        </Box>
      </Box>
    </Box>
  );
};
export default Form;
