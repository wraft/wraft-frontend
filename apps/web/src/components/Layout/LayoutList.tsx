import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import toast from 'react-hot-toast';
import { Table, Box, Flex, Text, DropdownMenu, Modal } from '@wraft/ui';
import { ThreeDotIcon } from '@wraft/icon';

import { TimeAgo } from 'common/Atoms';
import ConfirmDelete from 'common/ConfirmDelete';
import { Drawer } from 'common/Drawer';
import { fetchAPI, deleteAPI } from 'utils/models';

import LayoutForm from './LayoutForm';

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
  const [deleteLayout, setDeleteLayout] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState<number | boolean>(false);
  const [loading, setIslLoading] = useState<number | boolean>(false);

  useEffect(() => {
    loadLayout();
  }, [rerender]);

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
    setIslLoading(true);
    fetchAPI('layouts?sort=inserted_at_desc')
      .then((data: any) => {
        const res: IField[] = data.layouts;
        setContents(res);
        setIslLoading(false);
      })
      .catch(() => {
        setIslLoading(false);
      });
  };

  const columns = [
    {
      id: 'content.name',
      header: 'NAME',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <>
          <NextLink href={`/manage/layouts/${row.original.id}`}>
            <Text>{row.original?.name}</Text>
          </NextLink>
          <Drawer open={isEdit === row.index} setOpen={setIsEdit}>
            <LayoutForm setOpen={setIsEdit} cId={row.original.id} />
          </Drawer>
        </>
      ),
      enableSorting: false,
    },
    {
      id: 'content.description',
      header: 'DESCRIPTION',
      accessorKey: 'description',
      cell: ({ row }: any) => <Text>{row.original?.description}</Text>,
      enableSorting: false,
    },
    {
      id: 'content.slug',
      header: 'SLUG',
      accessorKey: 'slug',
      cell: ({ row }: any) => <Text>{row.original?.slug}</Text>,
      enableSorting: false,
    },
    {
      id: 'content.size',
      header: 'SIZE',
      accessorKey: 'size',
      cell: ({ row }: any) => (
        <Text>{`${row.original?.width} X ${row.original?.height} ${row.original?.unit}`}</Text>
      ),
      enableSorting: false,
    },
    {
      id: 'content.engine.name',
      header: 'ENGINE',
      accessorKey: 'name',
      cell: ({ row }: any) => <Text>{row.original?.engine?.name}</Text>,
      enableSorting: false,
    },
    {
      id: 'content.update_at',
      header: 'DATE',
      accessorKey: 'update_at',
      cell: ({ row }: any) => (
        <Box>
          <TimeAgo time={row.original?.update_at} />
        </Box>
      ),
      enableSorting: false,
    },
    {
      id: 'content.id',
      header: '',
      accessor: 'content.id',
      cell: ({ row }: any) => {
        return (
          <Flex justifyContent="flex-end">
            <DropdownMenu.Provider>
              <DropdownMenu.Trigger>
                <ThreeDotIcon />
              </DropdownMenu.Trigger>
              <DropdownMenu aria-label="dropdown role">
                <DropdownMenu.Item
                  onClick={() => {
                    setDeleteLayout(row.index);
                  }}>
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu>
            </DropdownMenu.Provider>
            <Modal
              ariaLabel="Delete Layout"
              open={deleteLayout === row.index}
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
          </Flex>
        );
      },
    },
  ];

  return (
    <Box w="100%">
      <Table data={contents} columns={columns} isLoading={loading} />
    </Box>
  );
};
export default LayoutList;
