import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from 'theme-ui';
import { transparentize } from '@theme-ui/color';
import { loadEntity } from '../../utils/models';
import { useStoreState } from 'easy-peasy';

import { Table } from '../Table';
import ContentLoader from 'react-content-loader';
import { OptionsIcon } from '../Icons';

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
          //   <Box
          //     sx={{ cursor: 'pointer', position: 'relative' }}
          //     onClick={() => setIsOpen(true)}>
          //     <OptionsIcon />
          //     {isOpen && <Box>hello</Box>}
          //   </Box>
          // ),
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
                    <Box
                      sx={{ cursor: 'pointer', position: 'relative' }}
                      onClick={() => setIsOpen(row.index)}
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
                          <Box
                            variant="text.pM"
                            sx={{
                              color: 'gray.6',
                              ':hover': {
                                bg: transparentize('neutral.1', 0.5),
                              },
                              p: 3,
                            }}>
                            Edit
                          </Box>
                          <Box
                            variant="text.pM"
                            sx={{
                              color: 'red.5',
                              ':hover': {
                                bg: transparentize('neutral.1', 0.5),
                              },
                              p: 3,
                            }}>
                            Disable
                          </Box>
                        </Box>
                      ) : (
                        <Box />
                      )}
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
