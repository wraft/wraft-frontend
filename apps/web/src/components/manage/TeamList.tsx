import React, { useState, useEffect, useMemo } from 'react';

import { MenuProvider, Menu, MenuItem, MenuButton } from '@ariakit/react';
import { useStoreState } from 'easy-peasy';
import toast from 'react-hot-toast';
import { Flex, Box, Text, Button, Image } from 'theme-ui';

import { fetchAPI, deleteAPI, postAPI } from '../../utils/models';
import { ConfirmDelete } from '../common';
import { AddIcon, Close, FilterArrowDown, OptionsIcon } from '../Icons';
import Modal from '../Modal';
import { Table } from '../Table';

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

const TeamList = () => {
  const [contents, setContents] = useState<MembersList>();
  const [tableList, setTableList] = useState<Array<any>>([]);
  const [currentRoleList, setCurrentRoleList] = useState<string[]>([]);
  const [updatedRoleList, setUpdatedRoleList] = useState([]);
  const [userId, setUserID] = useState<string | null>(null);
  const [isAssignRole, setIsAssignRole] = useState<number | null>(null);
  const [isRemoveRole, setIsRemoveRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [isRemoveUser, setIsRemoveUser] = useState<number | null>(null);
  const [sort, setSort] = useState('joined_at');
  const [rerender, setRerender] = useState<boolean>(false);

  const profile = useStoreState((state) => state.profile.profile);
  const organisationId = profile?.organisation_id;

  const loadData = (id: string) => {
    fetchAPI(`organisations/${id}/members?sort=${sort}`).then((data: any) => {
      setContents(data);
    });
  };
  useEffect(() => {
    if (updatedRoleList.length > 0) {
      setCurrentRoleList([...updatedRoleList]);
    }
  }, [updatedRoleList]);

  useEffect(() => {
    if (organisationId) {
      loadData(organisationId);
    }
  }, [organisationId, sort, rerender]);

  useEffect(() => {
    if (contents) {
      const memberData: MemberData[] = contents.members.map((member) => {
        return {
          members: {
            name: member.name,
            profilePic: member.profile_pic,
            memberId: member.id,
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

  const onConfirmDelete = () => {
    deleteAPI(`users/${userId}/roles/${isRemoveRole}`)
      .then((response: any) => {
        toast.success(`${response?.info}`, {
          duration: 1000,
          position: 'top-center',
        });
        setRerender((prev) => !prev);
      })
      .catch(() => {
        toast.error(`Failed to Delete!`, {
          duration: 1000,
          position: 'top-center',
        });
      });
    setIsRemoveRole(null);
  };

  const AssignRoleFunc = (row: any) => {
    setIsAssignRole(row.index);
    setUserID(tableList[row.index].members.memberId);
    setUpdatedRoleList(
      tableList[row.index].roles.map(
        (role: { roleName: string; roleId: string }) => role.roleId,
      ),
    );
  };

  return (
    <Flex>
      <Table
        options={{
          columns: [
            {
              Header: () => (
                <Flex
                  onClick={() => {
                    if (sort == 'name') {
                      setSort('name_desc');
                    } else {
                      setSort('name');
                    }
                  }}
                  sx={{
                    cursor: 'pointer',
                    ml: '24px',
                    fontSize: '12px',
                    fontWeight: 'heading',
                  }}>
                  NAME
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      my: 'auto',
                      ml: 2,
                      rotate: sort === 'name_desc' ? '180deg' : '0deg',
                    }}>
                    <FilterArrowDown />
                  </Box>
                </Flex>
              ),
              accessor: 'members',
              Cell: ({ row }) => {
                return (
                  <Flex
                    sx={{
                      ml: '24px',
                      gap: '18px',
                      alignItems: 'center',
                    }}>
                    <Image
                      src={row.original.members.profilePic}
                      alt="memberImg"
                      sx={{
                        width: '32px',
                        height: '32px',
                        maxWidth: 'auto',
                        borderRadius: 99,
                        border: 'solid 1px',
                        borderColor: 'gray.300',
                        overflow: 'hidden',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />
                    <Text sx={{ fontWeight: 'heading', color: 'gray.600' }}>
                      {row.original.members.name}
                    </Text>
                  </Flex>
                );
              },
            },
            {
              Header: () => (
                <Flex
                  sx={{ ml: '24px', fontSize: '12px', fontWeight: 'heading' }}>
                  ROLE
                </Flex>
              ),
              accessor: 'roles',
              Cell: ({ row }) => {
                return (
                  <Flex
                    sx={{
                      color: 'gray.500',
                      gap: '12px',
                      alignItems: 'center',
                    }}>
                    {row.original.roles.map(
                      (role: { roleName: string; roleId: string }) => (
                        <Box
                          sx={{ display: 'flex', alignItems: 'center' }}
                          key={role.roleId}>
                          <Flex
                            sx={{
                              fontWeight: 'body',
                              px: '12px',
                              py: '4px',
                              backgroundColor: '#EFF2F6',
                              borderRadius: '60px',
                              gap: '6px',
                              alignItems: 'center',
                              my: 'auto',
                            }}>
                            {role.roleName}
                            <Button
                              onClick={() => {
                                setIsRemoveRole(role.roleId);
                                setUserID(
                                  tableList[row.index].members.memberId,
                                );
                              }}
                              sx={{
                                cursor: 'pointer',
                                margin: '0px',
                                padding: '0px',
                                bg: 'transparent',
                                ':disabled': {
                                  display: 'none',
                                },
                              }}>
                              <Box
                                sx={{
                                  color: 'gray.900',
                                  display: 'flex',
                                  alignItems: 'center',
                                  objectFit: 'contain',
                                }}>
                                <Close width={30} color="black" />
                              </Box>
                            </Button>
                            <Modal
                              isOpen={isRemoveRole === role.roleId}
                              onClose={() => setIsRemoveRole(null)}>
                              <ConfirmDelete
                                title="Delete role"
                                text={`Are you sure you want to delete ${role.roleName} ?`}
                                setOpen={setIsRemoveRole}
                                onConfirmDelete={onConfirmDelete}
                              />
                            </Modal>
                          </Flex>
                        </Box>
                      ),
                    )}
                    <Box
                      sx={{
                        margin: '0px',
                        padding: '3px',
                        borderRadius: '4px',
                        border: '1px solid #E4E9EF',
                        lineHeight: '0px',
                        height: 'fit-content',
                      }}>
                      <MenuProvider>
                        <MenuButton
                          as={Button}
                          onClick={() => {
                            AssignRoleFunc(row);
                          }}
                          sx={{
                            cursor: 'pointer',
                            margin: '0px',
                            padding: '0px',
                            bg: 'transparent',
                            ':disabled': {
                              display: 'none',
                            },
                          }}>
                          <AddIcon />
                        </MenuButton>
                        <Menu
                          as={Box}
                          variant="layout.menu"
                          sx={{ top: 16, left: 0 }}
                          open={isAssignRole === row.index}
                          onClose={() => {
                            setCurrentRoleList([]);
                            setIsAssignRole(null);
                          }}>
                          <AssignRole
                            setRerender={setRerender}
                            currentRoleList={currentRoleList}
                            setCurrentRoleList={setCurrentRoleList}
                            setIsAssignRole={setIsAssignRole}
                            userId={userId}
                          />
                        </Menu>
                      </MenuProvider>
                    </Box>
                  </Flex>
                );
              },
            },
            {
              Header: '',
              accessor: 'col3',
              Cell: ({ row }) => {
                return (
                  <Box sx={{ position: 'relative' }}>
                    <MenuProvider>
                      <MenuButton
                        as={Box}
                        sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
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
                            setUserID(tableList[row.index].members.memberId);
                          }}>
                          <OptionsIcon />
                        </Button>
                      </MenuButton>
                      <Menu
                        as={Box}
                        variant="layout.menu"
                        open={isOpen == row.index}
                        onClose={() => setIsOpen(null)}>
                        <MenuItem>
                          <Button
                            variant="base"
                            onClick={() => {
                              setIsOpen(null);
                              setIsRemoveUser(row.index);
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
                        isOpen={isRemoveUser === row.index}
                        onClose={() => setIsRemoveUser(null)}>
                        {
                          <ConfirmDelete
                            title="Delete role"
                            text={`Are you sure you want to delete ‘${tableList[
                              row.index
                            ]?.members.name}’?`}
                            setOpen={setIsRemoveUser}
                            onConfirmDelete={async () => {
                              postAPI(
                                `organisations/remove_user/${row.original.members.memberId}`,
                                {},
                              )
                                .then(() => {
                                  toast.success('User removed Successfully', {
                                    duration: 2000,
                                    position: 'top-center',
                                  });
                                  setRerender((prev) => !prev);
                                })
                                .catch(() => {
                                  toast.error('User removed Failed', {
                                    duration: 2000,
                                    position: 'top-center',
                                  });
                                });
                              setIsRemoveUser(null);
                            }}
                          />
                        }
                      </Modal>
                    </MenuProvider>
                  </Box>
                );
              },
              width: '10%',
            },
          ],
          data: data,
        }}
      />
    </Flex>
  );
};

export default TeamList;
