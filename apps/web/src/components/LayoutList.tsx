import React, { useEffect, useState } from 'react';

import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import Router from 'next/router';
import toast from 'react-hot-toast';
import { Box, Flex, Text } from 'theme-ui';

import { fetchAPI, deleteAPI } from '../utils/models';

import { Button, ConfirmDelete, Table } from './common';
import { Drawer } from './common/Drawer';
import { OptionsIcon } from './Icons';
import LayoutForm from './LayoutForm';
import Modal from './Modal';

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

interface Props {
  rerender?: boolean;
}

const LayoutList = ({ rerender }: Props) => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [deleteLayout, setDeleteLayout] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState<number | boolean>(false);

  /**
   * Delete a Layout
   * @param _id  layout_id
   */
  const onDelete = (_id: string) => {
    deleteAPI(`layouts/${_id}`)
      .then(() => {
        toast.success('Deleted Layout', {
          duration: 1000,
          position: 'top-right',
        });
        loadLayout();
        setDeleteLayout(null);
      })
      .catch(() => {
        toast.error('Failed to delete Layout', {
          duration: 1000,
          position: 'top-right',
        });
      });
  };

  /**
   * Load all Engines
   */
  const loadLayout = () => {
    fetchAPI('layouts?sort=inserted_at_desc')
      .then((data: any) => {
        const res: IField[] = data.layouts;
        setContents(res);
      })
      .catch();
  };

  useEffect(() => {
    loadLayout();
  }, [rerender]);

  const columns = [
    {
      id: 'content.name',
      header: 'NAME',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Button
          variant="text"
          onClick={() => {
            // setIsEdit(row.index);
            Router.push(`/manage/layouts/${row.original.id}`);
          }}>
          <Box>
            <Box>{row.original?.name}</Box>
          </Box>
          <Drawer open={isEdit === row.index} setOpen={setIsEdit}>
            <LayoutForm setOpen={setIsEdit} cId={row.original.id} />
          </Drawer>
        </Button>
      ),
      enableSorting: false,
    },
    {
      id: 'content.id',
      header: '',
      accessor: 'content.id',
      cell: ({ row }: any) => {
        return (
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
                      variant="text"
                      onClick={() => {
                        setIsOpen(null);
                        setDeleteLayout(row.index);
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
                  isOpen={deleteLayout === row.index}
                  onClose={() => setDeleteLayout(null)}>
                  {
                    <ConfirmDelete
                      title="Delete Layout"
                      text={`Are you sure you want to delete ‘${row.original.name}’?`}
                      setOpen={setDeleteLayout}
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
    },
  ];

  return (
    <Box>
      <Table data={contents} columns={columns} />
    </Box>
  );
};
export default LayoutList;
