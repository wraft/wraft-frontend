import React, { useState, useEffect } from 'react';

import { useStoreState } from 'easy-peasy';
import Image from 'next/image';
import { Flex, Box, Text, Button } from 'theme-ui';

import { fetchAPI, deleteAPI } from '../../utils/models';
import { ConfirmDelete } from '../common';
import AddRole from '../icon/add.svg';
import RemoveRole from '../icon/remove.svg';
import { FilterArrowDown, OptionsIcon } from '../Icons';
import ModalCustom from '../ModalCustom';
import { Table } from '../Table';

import AssignRole from './AssignRole';
export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';

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
  const token = useStoreState((state) => state.auth.token);
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

  const profile = useStoreState((state) => state.profile.profile);
  const organisationId = profile?.organisation_id;
  console.log(organisationId);

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
  }, [organisationId, isRemoveRole, isRemoveUser, isAssignRole, sort]);

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

      console.log(memberData);
      setTableList(memberData);
    }
  }, [contents]);

  const onConfirmDelete = () => {
    deleteAPI(`users/${userId}/roles/${isRemoveRole}`);
    setIsRemoveRole(null);
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
                    }}>
                    <Box
                      sx={{
                        borderRadius: '999px',
                        overflow: 'hidden',
                        objectFit: 'cover',
                      }}>
                      <Image
                        src={row.original.members.profilePic}
                        alt="memberImg"
                        width={32}
                        height={32}
                      />
                    </Box>
                    <Text sx={{ fontWeight: 'heading', color: 'dark.600' }}>
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
                      color: 'dark.500',
                      gap: '12px',
                      alignItems: 'center',
                    }}>
                    {row.original.roles.map(
                      (role: { roleName: string; roleId: string }) => (
                        <>
                          <Flex
                            key={role.roleId}
                            sx={{
                              fontWeight: 'body',
                              px: '12px',
                              py: '4px',
                              backgroundColor: '#EFF2F6',
                              borderRadius: '60px',
                              gap: '6px',
                              alignItems: 'center',
                            }}>
                            {role.roleName}
                            <Button
                              onClick={() => {
                                setIsRemoveRole(role.roleId);
                                console.log(tableList[row.index].members.name);
                                console.log(
                                  tableList[row.index].members.memberId,
                                );
                                setUserID(
                                  tableList[row.index].members.memberId,
                                );
                              }}
                              disabled={role.roleName === 'superadmin'}
                              sx={{
                                cursor: 'pointer',
                                margin: '0px',
                                padding: '0px',
                                bg: 'transparent',
                                ':disabled': {
                                  display: 'none',
                                },
                              }}>
                              <img
                                src={RemoveRole}
                                alt="remove role from user"
                              />
                            </Button>
                          </Flex>
                          <ModalCustom
                            varient="center"
                            isOpen={isRemoveRole === role.roleId}
                            setOpen={setIsRemoveRole}>
                            <ConfirmDelete
                              title="Delete role"
                              text={`Are you sure you want to delete ${role.roleName} ?`}
                              setOpen={setIsRemoveRole}
                              onConfirmDelete={onConfirmDelete}
                            />
                          </ModalCustom>
                        </>
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
                      <Button
                        onClick={() => {
                          setIsAssignRole(row.index);
                          setUserID(tableList[row.index].members.memberId);
                          setUpdatedRoleList(
                            tableList[row.index].roles.map(
                              (role: { roleName: string; roleId: string }) =>
                                role.roleId,
                            ),
                          );
                          console.log(currentRoleList);
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
                        <img src={AddRole} alt="assign role to the user" />
                      </Button>
                    </Box>
                    <ModalCustom
                      varient="center"
                      isOpen={isAssignRole === row.index}
                      setOpen={setIsAssignRole}>
                      <AssignRole
                        currentRoleList={currentRoleList}
                        setCurrentRoleList={setCurrentRoleList}
                        setIsAssignRole={setIsAssignRole}
                        userId={userId}
                      />
                    </ModalCustom>
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
                    <Button
                      sx={{
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
                    {isOpen === row.index && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bg: 'backgroundWhite',
                          // p: 3,
                          right: 0,
                          top: 0,
                          zIndex: 10,
                          border: '1px solid',
                          borderColor: 'border',
                          width: '155px',
                        }}>
                        <Button
                          onClick={() => {
                            setIsOpen(null);
                            setIsRemoveUser(row.index);
                          }}
                          variant="text.pM"
                          sx={{
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            bg: 'backgroundWhite',
                            color: 'text',
                            p: 3,
                            ':disabled': {
                              color: 'gray.300',
                            },
                          }}>
                          Remove User
                        </Button>
                      </Box>
                    )}
                    <ModalCustom
                      varient="center"
                      isOpen={isRemoveUser === row.index}
                      setOpen={setIsRemoveUser}>
                      {
                        <ConfirmDelete
                          title="Delete role"
                          text={`Are you sure you want to delete ‘${tableList[
                            row.index
                          ]?.members.name}’?`}
                          setOpen={setIsRemoveUser}
                          onConfirmDelete={async () => {
                            try {
                              const response = await fetch(
                                `${API_HOST}/api/v1/organisations/remove_user/${userId}`,
                                {
                                  method: 'POST',
                                  headers: {
                                    Authorization: `Bearer ${token}`, // Add your authorization token here
                                  },
                                },
                              );

                              if (!response.ok) {
                                const errorData = await response.json();
                                console.error('Errorq:', errorData);
                                throw new Error('Team joining failed');
                              } else {
                                const responseData = await response;
                                console.log(responseData);
                              }
                            } catch (error) {
                              console.error('Network error:', error);
                            }
                            setIsRemoveUser(null);
                          }}
                        />
                      }
                    </ModalCustom>
                  </Box>
                );
              },
              width: '10%',
            },
          ],
          data: tableList,
        }}
      />
    </Flex>
  );
};

export default TeamList;
