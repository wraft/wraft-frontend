import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Button } from 'theme-ui';
import { deleteEntity, loadEntity } from '../../utils/models';
import { useStoreState } from 'easy-peasy';

import { Table } from '../Table';
import ContentLoader from 'react-content-loader';
import { BigErrorIcon, OptionsIcon } from '../Icons';
import ModalCustom from '../ModalCustom';
import { RolesEdit } from '.';
import { ConfirmDelete } from '../common';

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
}

const RolesList = ({ render, setRender, searchTerm }: Props) => {
  const token = useStoreState((state) => state.auth.token);
  const [contents, setContents] = useState<Array<RolesItem>>([]);
  const [tableList, setTableList] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [isDelete, setIsDelete] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState<number | null>(null);

  const loadDataSuccess = (data: any) => {
    setLoading(true);
    setContents(data);
  };

  const loadData = (t: string) => {
    loadEntity(t, 'roles', loadDataSuccess);
  };

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token, render]);

  useEffect(() => {
    const contentCopy = [...contents];
    const filteredContents = contentCopy.filter((e: any) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setContents([...filteredContents]);
  }, [searchTerm]);

  useEffect(() => setIsOpen(null), []);
  useEffect(() => {
    if (contents && contents.length > 0) {
      const row: any = [];
      contents.map((r: any) => {
        const rFormated = {
          name: (
            <Text variant="text.pM" sx={{ color: 'gray.5' }}>
              {r.name}
            </Text>
          ),
          users: (
            <Text variant="pM" sx={{ color: 'gray.5' }}>
              {r.user_count}
            </Text>
          ),
        };

        row.push(rFormated);
      });

      setTableList(row);
    }
  }, [contents, deleteEntity]);

  return (
    <Flex sx={{ width: '100%' }}>
      {!loading && <ContentLoader />}
      {loading && !contents && (
        <Box
          sx={{
            p: 4,
            bg: 'gray.0',
            border: 'solid 1px',
            borderColor: 'gray.2',
          }}>
          <Text>Nothing to approve</Text>
        </Box>
      )}
      {loading && contents && (
        <Table
          options={{
            columns: [
              {
                Header: 'Role Name',
                accessor: 'name',
                width: '50%',
              },
              {
                Header: 'Users',
                accessor: 'users',
                width: '30%',
              },
              {
                Header: '',
                accessor: 'col3',
                Cell: ({ row }) => {
                  return (
                    <>
                      <Box
                        sx={{ cursor: 'pointer', position: 'relative' }}
                        onClick={() => {
                          setIsOpen(row.index);
                          console.log(row.index, isOpen, isOpen === row.index);
                        }}
                        onMouseLeave={() => setIsOpen(null)}>
                        <OptionsIcon />
                        {isOpen === row.index ? (
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
                              disabled={
                                contents[row.index]?.name === 'superadmin'
                              }
                              onClick={() => {
                                setIsOpen(null);
                                setIsEdit(row.index);
                                console.log(
                                  'passedroleid',
                                  contents[row.index].id,
                                );
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
                              Edit
                            </Button>
                            <Button
                              disabled={
                                contents[row.index]?.name === 'superadmin'
                              }
                              variant="text.pM"
                              onClick={() => {
                                setIsOpen(null);
                                setIsDelete(row.index);
                              }}
                              sx={{
                                cursor: 'pointer',
                                textAlign: 'left',
                                width: '100%',
                                bg: 'bgWhite',
                                color: 'red.5',
                                p: 3,
                                ':disabled': {
                                  color: 'gray.2',
                                },
                              }}>
                              Delete
                            </Button>
                          </Box>
                        ) : (
                          <Box />
                        )}
                      </Box>
                      <ModalCustom
                        varient="right"
                        isOpen={isEdit === row.index}
                        setOpen={setIsEdit}>
                        <RolesEdit
                          setRender={setRender}
                          setOpen={setIsEdit}
                          roleId={contents[row.index]?.id}
                        />
                      </ModalCustom>

                      <ModalCustom
                        varient="center"
                        isOpen={isDelete === row.index}
                        setOpen={setIsDelete}>
                        {contents[row.index] &&
                        contents[row.index].user_count > 0 ? (
                          <Flex
                            sx={{
                              width: '403px',
                              flexDirection: 'column',
                              alignItems: 'center',
                              p: 4,
                              gap: 3,
                            }}>
                            <BigErrorIcon />
                            <Text variant="pR" sx={{ color: 'gray.8' }}>
                              You cannot remove a role that is in use
                            </Text>
                            <Button
                              sx={{ mt: 2 }}
                              variant="buttonPrimary"
                              onClick={() => setIsDelete(null)}>
                              Okay
                            </Button>
                          </Flex>
                        ) : (
                          <ConfirmDelete
                            title="Delete role"
                            text={`Are you sure you want to delete ‘${contents[
                              row.index
                            ]?.name}’?`}
                            setOpen={setIsDelete}
                            setRender={setRender}
                            onConfirmDelete={() => {
                              deleteEntity(
                                `roles/${contents[row.index].id}`,
                                token,
                              );
                              setIsDelete(null);
                              if (setRender) {
                                setRender((prev: boolean) => !prev);
                              }
                            }}
                          />
                        )}
                      </ModalCustom>
                    </>
                  );
                },
                width: '3%',
              },
            ],
            data: tableList,
          }}
        />
      )}
    </Flex>
  );
};
export default RolesList;
