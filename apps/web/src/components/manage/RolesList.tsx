import React, { useEffect, useState } from 'react';
import { MenuProvider, MenuButton, Menu, MenuItem } from '@ariakit/react';
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
  setFilterLoading: (e: boolean) => void;
}

const RolesList = ({
  render,
  setRender,
  searchTerm,
  setFilterLoading,
}: Props) => {
  const [contents, setContents] = useState<Array<RolesItem>>([]);
  const [tableList, setTableList] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [isDelete, setIsDelete] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState<number | null>(null);
  const [sort, setSort] = useState('');

  const loadData = async () => {
    await fetchAPI(`roles?name=${searchTerm}&sort=${sort}`).then(
      (data: any) => {
        setLoading(true);
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

  const onDelete = (row: any) => {
    deleteAPI(`roles/${contents[row.index].id}`);
    setIsDelete(null);
    if (setRender) {
      setRender((prev: boolean) => !prev);
    }
  };

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
                      fontSize: 'xs',
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
                  return (
                    <Box
                      sx={{ ml: '24px', cursor: 'pointer' }}
                      onClick={() => {
                        setIsEdit(row.index);
                      }}>
                      {row.original.name}
                      <Drawer
                        open={isEdit === row.index}
                        setOpen={() => setIsEdit(null)}>
                        {isEdit === row.index && (
                          <RolesForm
                            setRender={setRender}
                            setOpen={setIsEdit}
                            roleId={contents[row.index]?.id}
                          />
                        )}
                      </Drawer>
                    </Box>
                  );
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
                    <Box>
                      {contents[row.index]?.name !== 'superadmin' && (
                        <MenuProvider>
                          <MenuButton
                            as={Box}
                            variant="none"
                            sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
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
                              }}>
                              <OptionsIcon />
                            </Box>
                          </MenuButton>
                          <Menu
                            as={Box}
                            variant="layout.menu"
                            open={isOpen == row.index}
                            onClose={() => setIsOpen(null)}>
                            <Button
                              variant="base"
                              onClick={() => {
                                setIsOpen(null);
                                setIsDelete(row.index);
                              }}>
                              <MenuItem as={Box} sx={{ width: 'fit-content' }}>
                                <Text
                                  sx={{
                                    cursor: 'pointer',
                                    color: 'red.600',
                                    textAlign: 'left',
                                  }}>
                                  Delete
                                </Text>
                              </MenuItem>
                            </Button>
                          </Menu>
                        </MenuProvider>
                      )}
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
                            onConfirmDelete={() => onDelete(row)}
                          />
                        )}
                      </Modal>
                    </Box>
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
