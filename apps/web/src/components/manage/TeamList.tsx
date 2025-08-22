import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { ThreeDotIcon, AddIcon, CloseIcon } from '@wraft/icon';
import {
  Button,
  Table,
  Modal,
  DropdownMenu,
  Flex,
  Box,
  Text,
  Avatar,
  useTab,
  Tab,
} from '@wraft/ui';

import { TimeAgo } from 'common/Atoms';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, deleteAPI, postAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

import AssignRole from './AssignRole';

interface InvitedUser {
  id: string;
  email: string;
  status: string;
}

interface InvitedUsersList {
  invited_users: InvitedUser[];
}

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
  const [_isAssignRole, setIsAssignRole] = useState<number | null>(null);
  const [isUnassignModalOpen, setUnassignModalOpen] = useState<boolean>(false);
  const [isOpenUnassignUserModal, setOpenUnassignUserModal] =
    useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [invitedUsers, setInvitedUsers] = useState<InvitedUsersList>();
  const [invitedTableList, setInvitedTableList] = useState<Array<any>>([]);
  const [invitedLoading, setInvitedLoading] = useState<boolean>(true);

  const { userProfile } = useAuth();
  const tabStore = useTab();
  const selectedTabId = tabStore.useState('selectedId');
  const selectedTabIndex = parseInt(selectedTabId?.split('-')[1] || '0');

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

  const loadInvitedUsers = () => {
    fetchAPI('organisations/users/invite')
      .then((data: any) => {
        setInvitedUsers({ invited_users: data });
        setInvitedLoading(false);
      })
      .catch(() => {
        setInvitedLoading(false);
      });
  };

  const onResendInvite = (inviteId: string) => {
    postAPI(`organisations/users/invite/${inviteId}/resend`, {})
      .then((response: any) => {
        toast.success(response?.info || 'Invitation resent successfully', {
          duration: 2000,
          position: 'top-center',
        });
      })
      .catch((error) => {
        if (error?.status === 404) {
          toast.error('Invited user not found', {
            duration: 2000,
            position: 'top-center',
          });
          setRerender((prev) => !prev);
        } else {
          toast.error('Failed to resend invitation', {
            duration: 2000,
            position: 'top-center',
          });
        }
      });
  };

  const onCancelInvite = (inviteId: string) => {
    deleteAPI(`organisations/users/invite/${inviteId}/revoke`)
      .then((response: any) => {
        toast.success(response?.info || 'Invitation cancelled successfully', {
          duration: 2000,
          position: 'top-center',
        });
        setRerender((prev) => !prev);
      })
      .catch(() => {
        toast.error('Failed to cancel invitation', {
          duration: 2000,
          position: 'top-center',
        });
      });
  };

  useEffect(() => {
    if (!organisationId) return;

    loadData(organisationId);
    loadInvitedUsers();

    const interval = setInterval(() => {
      loadData(organisationId);
      loadInvitedUsers();
    }, 5000);

    return () => clearInterval(interval);
  }, [organisationId, rerender]);

  useEffect(() => {
    if (invitedUsers) {
      const invitedData =
        invitedUsers.invited_users?.map((invitedUser) => ({
          id: invitedUser.id,
          email: invitedUser.email,
          status: invitedUser.status,
        })) || [];

      setInvitedTableList(invitedData);
    }
  }, [invitedUsers]);

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
    <Flex flex="1" direction="column">
      {/* Tab Section - Remove count badges */}
      <Box mb="md">
        <Tab.List store={tabStore}>
          <Tab id="tab-0" store={tabStore}>
            <Text fontWeight="semibold">Members</Text>
          </Tab>
          <Tab id="tab-1" store={tabStore}>
            <Text fontWeight="semibold">Invited</Text>
          </Tab>
        </Tab.List>
      </Box>

      {selectedTabIndex === 0 ? (
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
                  <Avatar
                    src={row.original.members.profilePic}
                    alt="memberImg"
                    size="sm"
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
              cell: ({ row }: any) => {
                const totalRoles = row.original.roles.length;
                const displayedRoles = row.original.roles.slice(0, 3);
                const hasMoreRoles = totalRoles > 3;

                return (
                  <Flex gap="sm" align="center">
                    {displayedRoles.map(
                      (role: { roleName: string; roleId: string }) => (
                        <Flex
                          key={role.roleId}
                          color="text-secondary"
                          align="center"
                          bg="green.400"
                          borderRadius="md"
                          justify="space-between"
                          px="sm"
                          // py="xs"
                          fontSize="sm"
                          w="auto">
                          <Text flex="1" mr="sm" fontSize="sm">
                            {role.roleName}
                          </Text>
                          {hasPermission('members', 'manage') && (
                            <Box
                              mt="xs"
                              onClick={() =>
                                onUnassignRole(role, row.original.members)
                              }>
                              <CloseIcon
                                width={12}
                                color="var(--theme-ui-colors-gray-1200)"
                              />
                            </Box>
                          )}
                        </Flex>
                      ),
                    )}

                    {hasMoreRoles && (
                      <DropdownMenu.Provider>
                        <DropdownMenu.Trigger>
                          <Flex
                            color="text-secondary"
                            align="center"
                            bg="gray.200"
                            borderRadius="md"
                            justify="center"
                            gap="sm"
                            px="sm"
                            py="xs"
                            fontSize="sm">
                            <Text>+ {totalRoles - 3} more</Text>
                          </Flex>
                        </DropdownMenu.Trigger>
                        <DropdownMenu aria-label="more roles">
                          {row.original.roles
                            .slice(3)
                            .map(
                              (role: { roleName: string; roleId: string }) => (
                                <DropdownMenu.Item key={role.roleId}>
                                  <Flex align="center" w="100%">
                                    <Text flex="1">{role.roleName}</Text>
                                    {hasPermission('members', 'manage') && (
                                      <Box
                                        onClick={() =>
                                          onUnassignRole(
                                            role,
                                            row.original.members,
                                          )
                                        }
                                        ml="auto"
                                        px="sm"
                                        pt="xs">
                                        <CloseIcon width={16} />
                                      </Box>
                                    )}
                                  </Flex>
                                </DropdownMenu.Item>
                              ),
                            )}
                        </DropdownMenu>
                      </DropdownMenu.Provider>
                    )}

                    <Box>
                      <DropdownMenu.Provider>
                        {hasPermission('members', 'manage') && (
                          <DropdownMenu.Trigger>
                            <AddIcon
                              width={16}
                              height={16}
                              color="var(--theme-ui-colors-gray-1200)"
                            />
                          </DropdownMenu.Trigger>
                        )}
                        <DropdownMenu aria-label="dropdown role">
                          <AssignRole
                            setIsAssignRole={setIsAssignRole}
                            roles={roles}
                            setRerender={setRerender}
                            currentMemberRoles={row.original.roles}
                            userId={row.original?.members?.memberId}
                          />
                        </DropdownMenu>
                      </DropdownMenu.Provider>
                    </Box>
                  </Flex>
                );
              },
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
      ) : (
        <Table
          data={invitedTableList}
          isLoading={invitedLoading}
          columns={[
            {
              id: 'email',
              header: 'EMAIL',
              accessorKey: 'email',
              cell: ({ row }: any) => <Text>{row.original.email}</Text>,
              enableSorting: false,
            },
            {
              id: 'status',
              header: 'STATUS',
              accessorKey: 'status',
              cell: ({ row }: any) => (
                <Flex
                  color="text-secondary"
                  align="center"
                  bg={
                    row.original.status === 'pending'
                      ? 'yellow.400'
                      : 'gray.400'
                  }
                  borderRadius="md"
                  justify="center"
                  px="sm"
                  py="xs"
                  fontSize="sm"
                  w="auto">
                  <Text fontSize="sm" textTransform="capitalize">
                    {row.original.status}
                  </Text>
                </Flex>
              ),
              enableSorting: false,
            },
            {
              id: 'actions',
              header: '',
              cell: ({ row }: any) => (
                <DropdownMenu.Provider>
                  <DropdownMenu.Trigger>
                    <ThreeDotIcon />
                  </DropdownMenu.Trigger>
                  {hasPermission('members', 'manage') && (
                    <DropdownMenu aria-label="invite actions">
                      <DropdownMenu.Item
                        onClick={() => onResendInvite(row.original.id)}>
                        <Text>Resend Invite</Text>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => onCancelInvite(row.original.id)}>
                        <Text>Cancel Invite</Text>
                      </DropdownMenu.Item>
                    </DropdownMenu>
                  )}
                </DropdownMenu.Provider>
              ),
              enableSorting: false,
            },
          ]}
        />
      )}

      <Modal
        open={isUnassignModalOpen}
        ariaLabel="unassign role modal popup"
        onClose={() => setUnassignModalOpen(false)}>
        <Box>
          <Modal.Header>Are you sure</Modal.Header>
          <Box my={3}>
            {`Are you sure you want to delete ${currentRole?.role?.roleName} ?`}
          </Box>
          <Flex gap="sm" mt="md">
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
