import React, { useEffect, useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import { DeleteIcon, EllipsisHIcon, FontIcon } from '@wraft/icon';
import toast from 'react-hot-toast';
import { Box, Flex, Text, useThemeUI } from 'theme-ui';
import { Button, Table } from '@wraft/ui';
import { Drawer } from '@wraft-ui/Drawer';

import { fetchAPI, deleteAPI } from '../utils/models';
import Link from './NavLink';
import { useRouter } from 'next/router';
import PipelineTypeForm from './PipelineTypeForm';

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

const Form = () => {
  const { theme } = useThemeUI();
  const [loading, setLoading] = useState<boolean>(false);
  const [pipelineData, setPipelineData] = useState<any>()
  const [isOpen, setIsOpen] = useState<boolean>(false);


  const router = useRouter();

  const cId: string = router.query.id as string;

  const loadDetails = () => {
    fetchAPI(`pipelines/${cId}`).then((data:any) => {
      setPipelineData(data)
      console.log(data,"das");
    });
  };

  useEffect(() => {
    loadDetails();
  }, [cId]);

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
 {pipelineData?.stages && (
        <Table data={pipelineData.stages} columns={columns} isLoading={loading} />
      )}      <Box mt="auto" mb="4">
        <Box className="first-step" py={4}>
          <Button variant="secondary" onClick={() => setIsOpen(true)}>+ Add pipeline step</Button>
        </Box>
      </Box>
      <Drawer open={isOpen} setOpen={() => setIsOpen(false)}>
        {isOpen && (
          <PipelineTypeForm setIsOpen={setIsOpen} pipelineData={pipelineData} />
        )}
      </Drawer>
    </Box>
  );
};
export default Form;
