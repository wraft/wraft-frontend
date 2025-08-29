import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  inserted_at: string;
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

export type RoleType = {
  id: string;
  name: string;
  permissions: string[];
  user_count: number;
};

interface TeamListProps {
  refresh?: number;
}

const useTeamData = (organisationId: string | undefined) => {
  const [contents, setContents] = useState<MembersList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = (await fetchAPI(
        `organisations/${id}/members?sort=joined_at`,
      )) as MembersList;
      setContents(data);
    } catch (err) {
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    if (organisationId) {
      loadData(organisationId);
    }
  }, [organisationId, loadData]);

  useEffect(() => {
    if (organisationId) {
      loadData(organisationId);
    }
  }, [organisationId, loadData]);

  return { contents, loading, error, refreshData };
};

const useInvitedUsers = () => {
  const [invitedUsers, setInvitedUsers] = useState<InvitedUsersList | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvitedUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = (await fetchAPI(
        'organisations/users/invite',
      )) as InvitedUser[];
      setInvitedUsers({ invited_users: data });
    } catch (err) {
      setError('Failed to load invited users');
      console.error('Error loading invited users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshInvitedUsers = useCallback(() => {
    loadInvitedUsers();
  }, [loadInvitedUsers]);

  useEffect(() => {
    loadInvitedUsers();
  }, [loadInvitedUsers]);

  return { invitedUsers, loading, error, refreshInvitedUsers };
};

const useRoles = () => {
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        const data = (await fetchAPI('roles')) as RoleType[];
        setRoles(data);
      } catch (err) {
        console.error('Error loading roles:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  return { roles, loading };
};

const useTeamActions = (
  refreshData: () => void,
  refreshInvitedUsers: () => void,
) => {
  const onResendInvite = useCallback(async (inviteId: string) => {
    try {
      const response = (await postAPI(
        `organisations/users/invite/${inviteId}/resend`,
        {},
      )) as { info?: string };
      toast.success(response?.info || 'Invitation resent successfully', {
        position: 'top-right',
      });
    } catch (error: any) {
      if (error?.status === 404) {
        toast.error('Invited user not found', {
          position: 'top-right',
        });
      } else {
        toast.error('Failed to resend invitation', {
          position: 'top-right',
        });
      }
    }
  }, []);

  const onCancelInvite = useCallback(
    async (inviteId: string) => {
      try {
        const response = (await deleteAPI(
          `organisations/users/invite/${inviteId}/revoke`,
        )) as { info?: string };
        toast.success(response?.info || 'Invitation cancelled successfully', {
          position: 'top-right',
        });
        refreshInvitedUsers();
      } catch (error) {
        toast.error('Failed to cancel invitation', {
          position: 'top-right',
        });
      }
    },
    [refreshInvitedUsers],
  );

  const onConfirmDelete = useCallback(
    async (uid: string, rid: string) => {
      try {
        const response = (await deleteAPI(`users/${uid}/roles/${rid}`)) as {
          info?: string;
        };
        toast.success(response?.info || 'Role removed successfully', {
          position: 'top-right',
        });
        refreshData();
      } catch (error) {
        toast.error('Failed to remove role', {
          position: 'top-right',
        });
      }
    },
    [refreshData],
  );

  const onUnassignUser = useCallback(
    async (memberId: string) => {
      try {
        await postAPI(`organisations/remove_user/${memberId}`, {});
        toast.success('User removed successfully', {
          position: 'top-right',
        });
        refreshData();
      } catch (error) {
        toast.error('Failed to remove user', {
          position: 'top-right',
        });
      }
    },
    [refreshData],
  );

  return {
    onResendInvite,
    onCancelInvite,
    onConfirmDelete,
    onUnassignUser,
  };
};

const useModalState = () => {
  const [isUnassignModalOpen, setUnassignModalOpen] = useState<boolean>(false);
  const [isOpenUnassignUserModal, setOpenUnassignUserModal] =
    useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<{
    role?: { roleName: string; roleId: string };
    member?: any;
  } | null>(null);

  const openUnassignRoleModal = useCallback((role: any, member: any) => {
    setCurrentRole({ role, member });
    setUnassignModalOpen(true);
  }, []);

  const openUnassignUserModal = useCallback((member: any) => {
    setCurrentRole({ member });
    setOpenUnassignUserModal(true);
  }, []);

  const closeUnassignRoleModal = useCallback(() => {
    setUnassignModalOpen(false);
    setCurrentRole(null);
  }, []);

  const closeUnassignUserModal = useCallback(() => {
    setOpenUnassignUserModal(false);
    setCurrentRole(null);
  }, []);

  return {
    isUnassignModalOpen,
    isOpenUnassignUserModal,
    currentRole,
    openUnassignRoleModal,
    openUnassignUserModal,
    closeUnassignRoleModal,
    closeUnassignUserModal,
  };
};

const TeamList = ({ refresh = 0 }: TeamListProps) => {
  const { userProfile } = useAuth();
  const { hasPermission } = usePermission();
  const tabStore = useTab({ defaultSelectedId: 'tab-0' });
  const selectedTabId = tabStore.useState('selectedId');
  const selectedTabIndex = parseInt(selectedTabId?.split('-')[1] || '0');

  const organisationId = userProfile?.organisation_id;

  const { contents, loading, error, refreshData } = useTeamData(organisationId);
  const {
    invitedUsers,
    loading: invitedLoading,
    error: invitedError,
    refreshInvitedUsers,
  } = useInvitedUsers();
  const { roles } = useRoles();
  const { onResendInvite, onCancelInvite, onConfirmDelete, onUnassignUser } =
    useTeamActions(refreshData, refreshInvitedUsers);
  const {
    isUnassignModalOpen,
    isOpenUnassignUserModal,
    currentRole,
    openUnassignRoleModal,
    openUnassignUserModal,
    closeUnassignRoleModal,
    closeUnassignUserModal,
  } = useModalState();

  useEffect(() => {
    if (refresh > 0) {
      refreshData();
      refreshInvitedUsers();
    }
  }, [refresh, refreshData, refreshInvitedUsers]);

  const tableList = useMemo(() => {
    if (!contents?.members) return [];

    return contents.members.map((member) => ({
      members: {
        name: member.name,
        id: member.id,
        profilePic: member.profile_pic,
        memberId: member.id,
        joined_at: member.joined_at || null,
        updated_at: member.updated_at || null,
        email: member.email || null,
        is_current: member.id === userProfile?.id,
      },
      roles: member.roles.map((role) => ({
        roleName: role.name,
        roleId: role.id,
      })),
    }));
  }, [contents, userProfile?.id]);

  const invitedTableList = useMemo(() => {
    if (!invitedUsers?.invited_users) return [];

    return invitedUsers.invited_users.map((invitedUser) => ({
      id: invitedUser.id,
      email: invitedUser.email,
      status: invitedUser.status,
      inserted_at: invitedUser.inserted_at,
    }));
  }, [invitedUsers]);

  const memberColumns = useMemo(
    () => [
      {
        id: 'content.name',
        header: 'NAME',
        accessorKey: 'content.name',
        isPlaceholder: true,
        cell: ({ row }: any) => (
          <Flex gap="sm" align="center">
            <Avatar
              src={row.original.members.profilePic}
              alt={`${row.original.members.name}'s profile`}
              name={row.original.members.name}
              size="sm"
            />
            <Flex direction="column">
              <Text display="flex" alignItems="center" gap="xs">
                {row.original.members.name}{' '}
                {row.original.members.is_current && (
                  <Text as="span" color="text-secondary">
                    (You)
                  </Text>
                )}
              </Text>
              <Text color="text-secondary">{row.original.members.email}</Text>
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
                    fontSize="sm"
                    w="auto">
                    <Text flex="1" mr="sm" fontSize="sm">
                      {role.roleName}
                    </Text>
                    {hasPermission('members', 'manage') && (
                      <Box
                        mt="xs"
                        onClick={() =>
                          openUnassignRoleModal(role, row.original.members)
                        }
                        role="button"
                        tabIndex={0}
                        aria-label={`Remove ${role.roleName} role`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            openUnassignRoleModal(role, row.original.members);
                          }
                        }}>
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
                      .map((role: { roleName: string; roleId: string }) => (
                        <DropdownMenu.Item key={role.roleId}>
                          <Flex align="center" w="100%">
                            <Text flex="1">{role.roleName}</Text>
                            {hasPermission('members', 'manage') && (
                              <Box
                                onClick={() =>
                                  openUnassignRoleModal(
                                    role,
                                    row.original.members,
                                  )
                                }
                                ml="auto"
                                px="sm"
                                pt="xs"
                                role="button"
                                tabIndex={0}
                                aria-label={`Remove ${role.roleName} role`}>
                                <CloseIcon width={16} />
                              </Box>
                            )}
                          </Flex>
                        </DropdownMenu.Item>
                      ))}
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
                        aria-label="Add role"
                      />
                    </DropdownMenu.Trigger>
                  )}
                  <DropdownMenu aria-label="dropdown role">
                    <AssignRole
                      setIsAssignRole={() => {}} // Empty function since we don't use this state anymore
                      roles={roles}
                      setRerender={refreshData}
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
              <ThreeDotIcon aria-label="More actions" />
            </DropdownMenu.Trigger>
            {hasPermission('members', 'manage') && (
              <DropdownMenu aria-label="member actions">
                <DropdownMenu.Item
                  onClick={() => openUnassignUserModal(row.original.members)}>
                  <Text>Remove</Text>
                </DropdownMenu.Item>
              </DropdownMenu>
            )}
          </DropdownMenu.Provider>
        ),
        enableSorting: false,
      },
    ],
    [
      hasPermission,
      openUnassignRoleModal,
      openUnassignUserModal,
      roles,
      refreshData,
    ],
  );

  const invitedColumns = useMemo(
    () => [
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
            borderRadius="md"
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
        id: 'inserted_at',
        header: 'INVITED AT',
        accessorKey: 'inserted_at',
        cell: ({ row }: any) => (
          <Box>
            <TimeAgo time={row.original.inserted_at} />
          </Box>
        ),
        enableSorting: false,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }: any) => (
          <DropdownMenu.Provider>
            <DropdownMenu.Trigger>
              <ThreeDotIcon aria-label="Invite actions" />
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
    ],
    [hasPermission, onResendInvite, onCancelInvite],
  );

  if (error || invitedError) {
    return (
      <Flex flex="1" direction="column" align="center" justify="center" p="lg">
        <Text color="error" mb="md">
          {error || invitedError}
        </Text>
        <Button
          onClick={() => {
            refreshData();
            refreshInvitedUsers();
          }}>
          Retry
        </Button>
      </Flex>
    );
  }

  return (
    <Flex flex="1" direction="column">
      <Box mb="md">
        <Tab.List store={tabStore}>
          <Tab id="tab-0" store={tabStore} aria-label="members tab">
            <Text fontWeight="semibold">Members</Text>
          </Tab>
          <Tab id="tab-1" store={tabStore} aria-label="pending invites tab">
            <Text fontWeight="semibold">Pending Invites</Text>
          </Tab>
        </Tab.List>
      </Box>

      {selectedTabIndex === 0 ? (
        <Table data={tableList} isLoading={loading} columns={memberColumns} />
      ) : (
        <Table
          data={invitedTableList}
          isLoading={invitedLoading}
          columns={invitedColumns}
        />
      )}

      <Modal
        open={isUnassignModalOpen}
        ariaLabel="unassign role modal popup"
        onClose={closeUnassignRoleModal}>
        <Box>
          <Modal.Header>Are you sure</Modal.Header>
          <Text my="sm" color="text-secondary">
            {`Are you sure you want to remove ${currentRole?.role?.roleName} role?`}
          </Text>
          <Flex gap="md" mt="xl">
            <Button variant="secondary" onClick={closeUnassignRoleModal}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (currentRole?.role && currentRole?.member) {
                  onConfirmDelete(
                    currentRole.member.memberId,
                    currentRole.role.roleId,
                  );
                  closeUnassignRoleModal();
                }
              }}>
              Confirm
            </Button>
          </Flex>
        </Box>
      </Modal>

      <Modal
        open={isOpenUnassignUserModal}
        ariaLabel="unassign user modal popup"
        onClose={closeUnassignUserModal}>
        <Box>
          <Modal.Header>Are you sure</Modal.Header>
          <Text my="sm" color="text-secondary">
            {`Are you sure you want to remove ${currentRole?.member?.name}?`}
          </Text>
          <Flex gap="md" mt="xl">
            <Button variant="secondary" onClick={closeUnassignUserModal}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (currentRole?.member) {
                  onUnassignUser(currentRole.member.memberId);
                  closeUnassignUserModal();
                }
              }}>
              Confirm
            </Button>
          </Flex>
        </Box>
      </Modal>
    </Flex>
  );
};

export default TeamList;
