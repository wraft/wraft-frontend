import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Button } from 'theme-ui';
import { transparentize } from '@theme-ui/color';
import { deleteEntity, loadEntity } from '../../utils/models';
import { useStoreState } from 'easy-peasy';

import { Table } from '../Table';
import ContentLoader from 'react-content-loader';
import { ErrorIcon, OptionsIcon } from '../Icons';
import ModalCustom from '../ModalCustom';

export interface RolesItem {
  id: string;
  name: string;
  permissions?: string[];
  user_count: number;
}

const RolesList = () => {
  const token = useStoreState((state) => state.auth.token);
  const [contents, setContents] = useState<Array<RolesItem>>([]);
  const [tableList, setTableList] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
  }, [token]);

  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [isDelete, setIsDelete] = useState<number | null>(null);
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
          // col3: (
          //   // <Box
          //   //   sx={{ cursor: 'pointer', position: 'relative' }}
          //   //   onClick={() => setIsOpen(true)}>
          //   //   <OptionsIcon />
          //   //   {isOpen && <Box>hello</Box>}
          //   // </Box>
          //   <Box
          //     sx={{ cursor: 'pointer', position: 'relative' }}
          //     // onClick={() => setIsOpen(r.)}
          //     onClick={() => {
          //       setIsOpen(index);
          //       console.log(index);
          //       console.log(isOpen);
          //       console.log(isOpen === index);
          //     }}>
          //     <OptionsIcon />
          //     {isOpen === index ? (
          //       <Box
          //         sx={{
          //           position: 'absolute',
          //           bg: 'bgWhite',
          //           // p: 3,
          //           right: 0,
          //           top: 0,
          //           zIndex: 10,
          //           border: '1px solid',
          //           borderColor: 'neutral.1',
          //           width: '155px',
          //         }}>
          //         <Box
          //           onClick={() => console.log('edit', row.index)}
          //           variant="text.pM"
          //           sx={{
          //             color: 'gray.6',
          //             ':hover': {
          //               bg: transparentize('neutral.1', 0.5),
          //             },
          //             p: 3,
          //           }}>
          //           Edit
          //         </Box>
          //         <Box
          //           variant="text.pM"
          //           sx={{
          //             color: 'red.5',
          //             ':hover': {
          //               bg: transparentize('neutral.1', 0.5),
          //             },
          //             p: 3,
          //           }}>
          //           Disable
          //         </Box>
          //       </Box>
          //     ) : (
          //       <Box></Box>
          //     )}
          //   </Box>
          // ),
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
                          // console.log(row);
                          // console.log(contents[row.index]);
                        }}
                        onMouseLeave={() => setIsOpen(null)}
                        // onMouseOut={() => setIsOpen(null)}
                      >
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
                                contents[row.index].name === 'superadmin'
                              }
                              onClick={() => console.log('edit', row.index)}
                              variant="text.pM"
                              sx={{
                                textAlign: 'left',
                                width: '100%',
                                bg: 'bgWhite',
                                color: 'gray.6',
                                p: 3,
                                ':hover': {
                                  bg: transparentize('neutral.1', 0.5),
                                },
                                ':disabled': {
                                  color: 'gray.2',
                                },
                              }}>
                              Edit
                            </Button>
                            <Button
                              disabled={
                                contents[row.index].name === 'superadmin'
                              }
                              variant="text.pM"
                              onClick={() => {
                                setIsOpen(null);
                                setIsDelete(row.index);
                              }}
                              sx={{
                                textAlign: 'left',
                                width: '100%',
                                bg: 'bgWhite',
                                color: 'red.5',
                                p: 3,
                                ':hover': {
                                  bg: transparentize('neutral.1', 0.5),
                                },
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
                        // transparent
                        varient="center"
                        isOpen={isDelete === row.index}
                        setOpen={setIsDelete}>
                        {contents[row.index] &&
                        contents[row.index].user_count > 0 ? (
                          <Flex
                            sx={{
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              p: 4,
                              gap: 3,
                            }}>
                            <ErrorIcon />
                            <Text>You cannot remove a role that is in use</Text>
                          </Flex>
                        ) : (
                          <Box>
                            <Flex
                              sx={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                p: 4,
                                gap: 3,
                              }}>
                              <Box>
                                Are you sure you want to delete{' '}
                                <Text
                                  as={'span'}
                                  sx={{ display: 'inline-block' }}>
                                  {contents[row.index]?.name}
                                </Text>
                                ?
                              </Box>
                              <Box>
                                <Flex sx={{ gap: 3 }}>
                                  <Button
                                    variant="delete"
                                    onClick={() => {
                                      deleteEntity(
                                        `roles/${contents[row.index].id}`,
                                        token,
                                      );
                                      loadData(token);
                                      setIsDelete(null);
                                    }}>
                                    Confirm
                                  </Button>
                                  <Button
                                    variant="cancel"
                                    onClick={() => setIsDelete(null)}>
                                    Cancel
                                  </Button>
                                </Flex>
                              </Box>
                            </Flex>
                          </Box>
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
