import React, { useState, useEffect } from 'react';
import { loadEntity, deleteEntity } from '../../utils/models';
import { useStoreState } from 'easy-peasy';
import { Table } from '../Table';
import { Flex, Box, Text, Button } from 'theme-ui';
import Image from 'next/image';
import { OptionsIcon } from '../Icons';
import AddRole from '../icon/add.svg';
import RemoveRole from '../icon/remove.svg';
import { ConfirmDelete } from '../common';
import ModalCustom from '../ModalCustom';
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

  const profile = useStoreState((state) => state.profile.profile);
  const organisationId = profile?.organisation_id;
  console.log(organisationId);

  const loadDataSuccess = (data: any) => {
    setContents(data);
  };

  const loadData = (token: string, id: string) => {
    const path = `organisations/${id}/members`;
    loadEntity(token, path, loadDataSuccess);
  };
  useEffect(() => {
    if (updatedRoleList.length > 0) {
      setCurrentRoleList([...updatedRoleList]);
    }
  }, [updatedRoleList]);

  useEffect(() => {
    if (token && organisationId) {
      loadData(token, organisationId);
    }
  }, [token, organisationId, isRemoveRole, isRemoveUser, isAssignRole]);

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

  return (
    <Flex>
      <Table
        options={{
          columns: [
            {
              Header: () => (
                <Flex
                  sx={{ ml: '24px', fontSize: '12px', fontWeight: 'heading' }}>
                  NAME
                </Flex>
              ),
              accessor: 'members',
              Cell: ({ row }) => {
                return (
                  <Flex sx={{ ml: '24px', gap: '18px' }}>
                    <Image
                      src={row.original.members.profilePic}
                      alt="memberImg"
                      width={32}
                      height={32}
                    />
                    <Text sx={{ fontWeight: 'heading', color: 'dark_600' }}>
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
                      color: 'dark_500',
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
                              onConfirmDelete={() => {
                                deleteEntity(
                                  `users/${userId}/roles/${isRemoveRole}`,
                                  token,
                                );
                                setIsRemoveRole(null);
                              }}
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
                          bg: 'bgWhite',
                          // p: 3,
                          right: 0,
                          top: 0,
                          zIndex: 10,
                          border: '1px solid',
                          borderColor: 'neutral.1',
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
                            bg: 'bgWhite',
                            color: 'gray.6',
                            p: 3,
                            ':disabled': {
                              color: 'gray.2',
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
