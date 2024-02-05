import React, { useEffect, useState } from 'react';

import { Drawer } from '@wraft-ui/Drawer';
import ContentLoader from 'react-content-loader';
import { Box, Text, Flex, Button } from 'theme-ui';

import { fetchAPI, deleteAPI } from '../../utils/models';
import { ConfirmDelete } from '../common';
import { BigErrorIcon, FilterArrowDown, OptionsIcon } from '../Icons';
import Modal from '../Modal';
import { Table } from '../Table';

import { RolesForm } from '.';

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
  const [contents, setContents] = useState<Array<RolesItem>>([]);
  const [tableList, setTableList] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [isDelete, setIsDelete] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState<number | null>(null);
  const [sort, setSort] = useState('');

  const loadData = () => {
    fetchAPI(`roles?sort=${sort}`).then((data: any) => {
      setLoading(true);
      setContents(data);
    });
  };

  useEffect(() => {
    loadData();
  }, [render, sort]);

  useEffect(() => {
    const contentCopy = [...contents];
    const filteredContents = contentCopy.filter((e: any) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setContents([...filteredContents]);
  }, [searchTerm]);

  useEffect(() => {
    if (contents && contents.length > 0) {
      const row: any = [];
      contents.map((r: any) => {
        const rFormated = {
          name: (
            <Text variant="text.pM" sx={{ color: 'gray.500' }}>
              {r.name}
            </Text>
          ),
          users: (
            <Text variant="pM" sx={{ color: 'gray.500' }}>
              {r.user_count}
            </Text>
          ),
        };

        row.push(rFormated);
      });

      setTableList(row);
    }
  }, [contents]);

  return (
    <Flex sx={{ width: '100%' }}>
      {!loading && <ContentLoader />}
      {loading && !contents && (
        <Box
          sx={{
            p: 4,
            bg: 'gray.100',
            border: 'solid 1px',
            borderColor: 'border',
          }}>
          <Text>Nothing to approve</Text>
        </Box>
      )}
      {loading && contents && (
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
                    ROLE NAME
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
                accessor: 'name',
                width: '50%',
                Cell: ({ row }) => {
                  return <Box sx={{ ml: '24px' }}>{row.original.name}</Box>;
                },
              },
              {
                Header: 'USERS',
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
                        }}
                        onMouseLeave={() => setIsOpen(null)}>
                        <OptionsIcon />
                        {isOpen === row.index ? (
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
                              disabled={
                                contents[row.index]?.name === 'superadmin'
                              }
                              onClick={() => {
                                setIsOpen(null);
                                setIsEdit(row.index);
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
                                bg: 'backgroundWhite',
                                color: 'red.600',
                                p: 3,
                                ':disabled': {
                                  color: 'gray.300',
                                },
                              }}>
                              Delete
                            </Button>
                          </Box>
                        ) : (
                          <Box />
                        )}
                      </Box>
                      <Drawer
                        open={isEdit === row.index}
                        setOpen={() => setIsEdit(null)}>
                        <RolesForm
                          setRender={setRender}
                          setOpen={setIsEdit}
                          roleId={contents[row.index]?.id}
                        />
                      </Drawer>

                      <Modal
                        isOpen={isDelete === row.index}
                        onClose={() => setIsDelete(null)}>
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
                            <Text variant="pR" sx={{ color: 'text' }}>
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
                            text={`Are you sure you want to delete ‘${
                              contents[row.index]?.name
                            }’?`}
                            setOpen={setIsDelete}
                            setRender={setRender}
                            onConfirmDelete={() => {
                              deleteAPI(`roles/${contents[row.index].id}`);
                              setIsDelete(null);
                              if (setRender) {
                                setRender((prev: boolean) => !prev);
                              }
                            }}
                          />
                        )}
                      </Modal>
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
