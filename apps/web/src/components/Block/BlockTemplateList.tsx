import React, { FC, useEffect, useState } from 'react';
import NavLink from 'next/link';
import Router, { useRouter } from 'next/router';
import { Table, DropdownMenu, Box, Text, Flex, Button, Modal } from '@wraft/ui';
import { ThreeDotIcon } from '@wraft/icon';
import toast from 'react-hot-toast';

import PageHeader from 'common/PageHeader';
import { TimeAgo } from 'common/Atoms';
import ConfirmDelete from 'common/ConfirmDelete';
import UserCard from 'common/UserCard';
import { deleteAPI, fetchAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

export interface IField {
  id: string;
  title: string;
  body: string;
  serialized: string;
}

export interface IFieldItem {
  name: string;
  type: string;
}

const BlockTemplateListFrame: FC = () => {
  const [contents, setContents] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [render, setRender] = useState(false);
  const [deleteBlock, setDeleteBlock] = useState<number | null>(null);
  const { hasPermission } = usePermission();

  const loadData = () => {
    setLoading(true);
    fetchAPI('block_templates')
      .then((data: any) => {
        const res: any = data.block_templates;
        setContents(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const blockDelete = (cId: any) => {
    if (cId) {
      deleteAPI(`block_templates/${cId}`).then(() => {
        Router.push(`/blocks`);
        toast.success('Deleted Block Successfully', {
          duration: 1000,
          position: 'top-right',
        });
        setRender((prev: boolean) => !prev);
        setDeleteBlock(null);
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [render]);

  const columns = [
    {
      id: 'Name',
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }: any) => (
        <NavLink href={`/blocks/edit/${row?.original?.id}`}>
          <Text fontWeight="heading">{row?.original?.title}</Text>
        </NavLink>
      ),
      size: '350',
      enableSorting: false,
    },
    {
      id: 'content.time',
      header: 'Time',
      accessorKey: 'time',
      cell: ({ row }: any) => <TimeAgo time={row.original?.updated_at} />,
      enableSorting: false,
    },
    {
      id: 'content.created',
      header: 'Created By',
      accessorKey: 'created',
      cell: ({ row }: any) => (
        <UserCard
          profilePic={row.original?.creator?.profile_pic}
          name={row.original?.creator?.name}
          size="sm"
        />
      ),
      enableSorting: false,
    },
    {
      id: 'content.name',
      header: '',
      cell: ({ row }: any) => (
        <>
          <Flex justifyContent="flex-end">
            <DropdownMenu.Provider>
              <DropdownMenu.Trigger>
                <ThreeDotIcon />
              </DropdownMenu.Trigger>
              <DropdownMenu aria-label="dropdown role">
                {hasPermission('block_template', 'manage') && (
                  <DropdownMenu.Item>
                    <NavLink href={`/blocks/edit/${row?.original?.id}`}>
                      <Text>Edit</Text>
                    </NavLink>
                  </DropdownMenu.Item>
                )}
                {hasPermission('block_template', 'delete') && (
                  <DropdownMenu.Item
                    onClick={() => {
                      setDeleteBlock(row.index);
                    }}>
                    <Text>Delete</Text>
                  </DropdownMenu.Item>
                )}
                <Modal
                  ariaLabel="Delete Variant"
                  open={deleteBlock === row.index}
                  onClose={() => setDeleteBlock(null)}>
                  {
                    <ConfirmDelete
                      title="Delete Variant"
                      text={`Are you sure you want to delete ‘${row?.original?.title}’?`}
                      setOpen={setDeleteBlock}
                      onConfirmDelete={async () => {
                        blockDelete(row.original.id);
                      }}
                    />
                  }
                </Modal>
              </DropdownMenu>
            </DropdownMenu.Provider>
          </Flex>
        </>
      ),
      enableSorting: false,
      textAlign: 'right',
    },
  ];

  return (
    <>
      <PageHeader title="Blocks" desc="Re-usable Content blocks">
        {hasPermission('block_template', 'manage') && (
          <Button onClick={() => Router.push(`/blocks/new`)} variant="tertiary">
            + New Block
          </Button>
        )}
      </PageHeader>
      <Box p="lg" minHeight="100%" bg="background-secondary">
        <Table
          data={contents}
          isLoading={loading}
          columns={columns}
          skeletonRows={10}
          emptyMessage="No blocks has been created yet."
        />
      </Box>
    </>
  );
};
export default BlockTemplateListFrame;
