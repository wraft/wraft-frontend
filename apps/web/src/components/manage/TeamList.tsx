import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Image } from 'theme-ui';
import { ThreeDotIcon, AddIcon, CloseIcon } from '@wraft/icon';
import { Button, Table, Modal, DropdownMenu, Flex, Box, Text } from '@wraft/ui';

import { TimeAgo } from 'common/Atoms';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, deleteAPI, postAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

import AssignRole from './AssignRole';

interface Role {
  id: string;
  name: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  inserted_at: string;
  updated_at: string;
  email_verify: boolean;
  roles: Role[];
  profile_pic: string;
  joined_at: string;
}

interface MembersList {
  members: Member[];
  page_number: number;
  total_entries: number;
  total_pages: number;
}

interface MemberData {
  members: {
    name: string;
    profilePic: string;
    memberId: string;
  };
  roles: {
    roleName: string;
    roleId: string;
  }[];
}

export type RoleType = {
  id: string;
  name: string;
  permissions: string[];
  user_count: number;
};

const TeamList = () => {
  const [contents, setContents] = useState<MembersList>();
  const [currentRole, setCurrentRole] = useState<any>();
  const [tableList, setTableList] = useState<Array<any>>([]);
  const [currentRoleList, _setCurrentRoleList] = useState<string[]>([]);
  const [_isAssignRole, setIsAssignRole] = useState<number | null>(null);
  const [isUnassignModalOpen, setUnassignModalOpen] = useState<boolean>(false);
  const [isOpenUnassignUserModal, setOpenUnassignUserModal] =
    useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { userProfile } = useAuth();

  const organisationId = userProfile?.organisation_id;
  const { hasPermission } = usePermission();

  useEffect(() => {
    fetchAPI('roles').then((data: any) => {
      setRoles(data);
    });
  }, []);

  const loadData = (id: string) => {
    fetchAPI(`organisations/${id}/members?sort=joined_at`).then((data: any) => {
      setContents(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (organisationId) {
      loadData(organisationId);
    }
  }, [organisationId, rerender]);

  useEffect(() => {
    if (contents) {
      const memberData: MemberData[] =
        contents.members &&
        contents?.members.map((member) => {
          return {
            members: {
              name: member.name,
              id: member.id,
              profilePic: member.profile_pic,
              memberId: member.id,
              joined_at: member.joined_at || null,
              updated_at: member.updated_at || null,
              email: member.email || null,
              is_current: member.id === userProfile.id,
            },
            roles: member.roles.map((role) => ({
              roleName: role.name,
              roleId: role.id,
            })),
          };
        });

      setTableList(memberData);
    }
  }, [contents]);

  const data = useMemo(() => tableList, [tableList]);

  const onConfirmDelete = (uid: number, rid: number) => {
    deleteAPI(`users/${uid}/roles/${rid}`)
      .then((response: any) => {
        toast.success(`${response?.info}`, {
          duration: 1000,
          position: 'top-center',
        });
        setRerender((prev) => !prev);
        setCurrentRole(null);
        setUnassignModalOpen(false);
      })
      .catch(() => {
        toast.error(`Failed to Delete!`, {
          duration: 1000,
          position: 'top-center',
        });
      });
  };

  const onUnassignRole = (role: any, member: any) => {
    setCurrentRole({ role: role, member: member });
    setUnassignModalOpen(true);
  };

  const onUnassignUserConfirm = (member: any) => {
    setCurrentRole({ member: member });
    setOpenUnassignUserModal(true);
  };

  const onUnassignUser = (memberId: any) => {
    postAPI(`organisations/remove_user/${memberId}`, {})
      .then(() => {
        toast.success('User removed Successfully', {
          duration: 2000,
          position: 'top-center',
        });
        setRerender((prev) => !prev);
        setOpenUnassignUserModal(false);
      })
      .catch(() => {
        toast.error('User removed Failed', {
          duration: 2000,
          position: 'top-center',
        });
      });
  };

  return (
    <Flex flex="1">
      <Table
        data={data}
        isLoading={loading}
        columns={[
          {
            id: 'content.name',
            header: 'NAME',
            accessorKey: 'content.name',
            isPlaceholder: true,
            cell: ({ row }: any) => (
              <Flex gap="sm" align="center">
                <Image
                  src={row.original.members.profilePic}
                  alt="memberImg"
                  sx={{
                    width: '28px',
                    height: '28px',
                    maxWidth: 'auto',
                    borderRadius: 99,
                    border: 'solid 1px',
                    borderColor: 'gray.300',
                    overflow: 'hidden',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
                <Flex direction="column">
                  <Text>
                    {row.original.members.name}{' '}
                    {row.original.members.is_current ? `(You)` : ''}
                  </Text>
                  <Text color="text-secondary">
                    {row.original.members.email}
                  </Text>
                </Flex>
              </Flex>
            ),
            width: '100%',
            enableSorting: false,
          },

          {
            id: 'content.user_count',
            header: 'ROLE',
            accessorKey: 'content.user_count',
            isPlaceholder: true,
            cell: ({ row }: any) => (
              <Flex gap="sm" align="center">
                {row.original.roles.map(
                  (role: { roleName: string; roleId: string }) => (
                    <Flex
                      key={role.roleId}
                      color="text-secondary"
                      align="center"
                      bg="green.400"
                      borderRadius="md"
                      justify="center"
                      gap="sm"
                      px="sm"
                      py="xs"
                      fontSize="sm">
                      <Text>{role.roleName}</Text>
                      {hasPermission('members', 'manage') && (
                        <Box
                          onClick={() =>
                            onUnassignRole(role, row.original.members)
                          }>
                          <CloseIcon width={16} color="black" />
                        </Box>
                      )}
                    </Flex>
                  ),
                )}
                <Box>
                  <DropdownMenu.Provider>
                    {hasPermission('members', 'manage') && (
                      <DropdownMenu.Trigger>
                        <AddIcon />
                      </DropdownMenu.Trigger>
                    )}
                    <DropdownMenu aria-label="dropdown role">
                      <AssignRole
                        setIsAssignRole={setIsAssignRole}
                        roles={roles}
                        setRerender={setRerender}
                        currentRoleList={currentRoleList}
                        userId={row.original?.members?.memberId}
                      />
                    </DropdownMenu>
                  </DropdownMenu.Provider>
                </Box>
              </Flex>
            ),
            enableSorting: false,
          },
          {
            id: 'content.joined_at',
            header: 'JOIN AT',
            accessorKey: 'joined_at',
            cell: ({ row }: any) => (
              <Box>
                <TimeAgo time={row.original?.members?.joined_at} />
              </Box>
            ),
            enableSorting: false,
          },
          {
            id: 'content.updated_at',
            header: 'UPDATED AT',
            accessorKey: 'updated_at',
            cell: ({ row }: any) => (
              <Box>
                <TimeAgo time={row.original?.members?.updated_at} />
              </Box>
            ),
            enableSorting: false,
          },
          {
            id: 'editor',
            header: '',
            cell: ({ row }: any) => (
              <DropdownMenu.Provider>
                <DropdownMenu.Trigger>
                  <ThreeDotIcon />
                </DropdownMenu.Trigger>
                {hasPermission('members', 'manage') && (
                  <DropdownMenu aria-label="dropdown role">
                    <DropdownMenu.Item
                      onClick={() =>
                        onUnassignUserConfirm(row.original.members)
                      }>
                      <Text>Remove</Text>
                    </DropdownMenu.Item>
                  </DropdownMenu>
                )}
              </DropdownMenu.Provider>
            ),
            enableSorting: false,
          },
        ]}
      />
      <Modal
        open={isUnassignModalOpen}
        ariaLabel="unassign role modal popup"
        onClose={() => setUnassignModalOpen(false)}>
        <Box>
          <Modal.Header>Are you sure</Modal.Header>
          <Box my={3}>
            {`Are you sure you want to delete ${currentRole?.role?.roleName} ?`}
          </Box>
          <Flex
          // sx={{ gap: '8px' }}
          >
            <Button
              variant="secondary"
              onClick={() => setUnassignModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                onConfirmDelete(
                  currentRole.member.memberId,
                  currentRole.role.roleId,
                )
              }>
              Confirm
            </Button>
          </Flex>
        </Box>
      </Modal>

      <Modal
        open={isOpenUnassignUserModal}
        ariaLabel="unassign user modal popup"
        onClose={() => setOpenUnassignUserModal(false)}>
        <Box>
          <Modal.Header>Are you sure</Modal.Header>
          <Box my={3} color="text-secondary">
            {`Are you sure you want to delete ${currentRole?.member?.name} ?`}
          </Box>
          <Flex gap="sm" mt="md">
            <Button
              variant="secondary"
              onClick={() => setOpenUnassignUserModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => onUnassignUser(currentRole.member.memberId)}>
              Confirm
            </Button>
          </Flex>
        </Box>
      </Modal>
    </Flex>
  );
};

export default TeamList;
