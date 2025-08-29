import React, { useEffect, useState } from 'react';
import {
  Table,
  Drawer,
  useDrawer,
  DropdownMenu,
  Modal,
  Button,
  Box,
  Text,
  Flex,
} from '@wraft/ui';
import { ThreeDotIcon } from '@wraft/icon';

import { fetchAPI, deleteAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

import RolesForm from './RolesForm';

export interface RolesItem {
  id: string;
  name: string;
  permissions?: string[];
  user_count: number;
}

interface Props {
  searchTerm: string;
  render: boolean;
  setRender: any;
  setFilterLoading: (e: boolean) => void;
}

const columns = ({ openDrawer, onDeleteRole, hasPermission }: any) => [
  {
    id: 'content.name',
    header: 'ROLE NAME',
    accessorKey: 'content.name',
    isPlaceholder: true,
    cell: ({ row }: any) => <Text>{row.original.name}</Text>,
    width: '100%',
    enableSorting: false,
  },
  {
    id: 'content.user_count',
    header: 'USER',
    accessorKey: 'content.user_count',
    isPlaceholder: true,
    cell: ({ row }: any) => <Text>{row.original.user_count}</Text>,
    enableSorting: false,
  },
  {
    id: 'editor',
    header: '',
    cell: ({ row }: any) => (
      <Flex justify="right">
        {row.original?.name !== 'superadmin' && (
          <DropdownMenu.Provider>
            <DropdownMenu.Trigger>
              <ThreeDotIcon />
            </DropdownMenu.Trigger>
            {hasPermission('role', 'delete') && (
              <DropdownMenu aria-label="dropdown role">
                <DropdownMenu.Item
                  onClick={() => onDeleteRole(row.original.id)}>
                  <Text cursor="pointer">Delete</Text>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => openDrawer(row.original.id)}>
                  <Text cursor="pointer">Edit</Text>
                </DropdownMenu.Item>
              </DropdownMenu>
            )}
          </DropdownMenu.Provider>
        )}
      </Flex>
    ),
    enableSorting: false,
  },
];

const RolesList = ({
  render,
  setRender,
  searchTerm,
  setFilterLoading,
}: Props) => {
  const [contents, setContents] = useState<Array<RolesItem>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpenDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [sort, _setSort] = useState('');
  const { hasPermission } = usePermission();

  const mobileMenuDrawer = useDrawer();

  const loadData = async () => {
    setLoading(true);
    await fetchAPI(`roles?name=${searchTerm}&sort=${sort}`).then(
      (data: any) => {
        setLoading(false);
        setContents(data);
      },
    );
  };

  useEffect(() => {
    loadData()
      .then(() => setFilterLoading(false))
      .catch(() => setFilterLoading(false));
  }, [searchTerm]);

  useEffect(() => {
    loadData();
  }, [render, sort]);

  const onDelete = (id: any) => {
    deleteAPI(`roles/${id}`);
    setOpenDeleteModal(false);
    if (setRender) {
      setRender((prev: boolean) => !prev);
      loadData();
    }
  };

  const openDrawer = (id: any) => {
    setOpen(true);
    const content = contents.find((x) => x.id === id);
    setCurrentContent(content);
  };

  const onDeleteRole = (id: any) => {
    setOpenDeleteModal(true);
    const content = contents.find((x) => x.id === id);
    setCurrentContent(content);
  };

  return (
    <Flex w="100%" h="100%">
      <Table
        data={contents}
        isLoading={loading}
        columns={columns({ openDrawer, onDeleteRole, hasPermission })}
        skeletonRows={12}
      />
      <Drawer
        open={isOpen}
        store={mobileMenuDrawer}
        withBackdrop={true}
        onClose={() => setOpen(false)}>
        {currentContent && (
          <RolesForm
            setRender={setRender}
            setOpen={setOpen}
            roleId={currentContent.id}
          />
        )}
      </Drawer>
      <Modal
        open={isOpenDeleteModal}
        ariaLabel="delete modal"
        onClose={() => setOpenDeleteModal(false)}>
        <>
          {currentContent && currentContent.user_count > 0 && (
            <Box>
              <Modal.Header>Are you sure</Modal.Header>
              <Box my={3}>You cannot remove a role that is in use</Box>
              <Flex gap="sm">
                <Button
                  variant="secondary"
                  onClick={() => setOpenDeleteModal(false)}>
                  Cancel
                </Button>
              </Flex>
            </Box>
          )}
          {currentContent && currentContent.user_count === 0 && (
            <Box>
              <Modal.Header>Are you sure</Modal.Header>
              <Box my={3}>Are you sure you want to delete?</Box>
              <Flex gap="sm">
                <Button
                  variant="secondary"
                  onClick={() => setOpenDeleteModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => onDelete(currentContent.id)}>
                  Confirm
                </Button>
              </Flex>
            </Box>
          )}
        </>
      </Modal>
    </Flex>
  );
};
export default RolesList;
