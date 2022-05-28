import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Button } from 'theme-ui';
import Link from './NavLink';

import { useStoreState } from 'easy-peasy';
// import CombinationCard from './CombinationCard';
import PageHeader from './PageHeader';
import { loadEntity } from '../utils/models';
import { Input } from 'theme-ui';

export interface Theme {
  total_pages: number;
  total_entries: number;
  themes: ThemeElement[];
  page_number: number;
}

export interface ThemeElement {
  updated_at: string;
  typescale: any;
  name: string;
  inserted_at: string;
  id: string;
  font: string;
  file: null;
}

const Form = () => {
  const token = useStoreState((state) => state.auth.token);
  // const token = useSelector(({ login }: any) => login.token);
  const [users, setUsers] = useState<any>([]);
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  const loadDataSuccess = (data: any) => {
    const res: any = data;
    setUsers(res);
  };

  const loadData = (t: string, page: number) => {
    loadEntity(t, `users?page=${page}`, loadDataSuccess);
  };

  const searchLoadData = (t: string, page: number, search: string) => {
    loadEntity(t, `users?page=${page}&name=${search}`, loadDataSuccess);
  };

  const loadDataPage = (page: number) => {
    setPage(page);
    loadData(token, page);
  };

  useEffect(() => {
    console.log('token', token);
    if (token) {
      loadData(token, page);
    }
  }, [token]);

  const doSearch = (e: any) => {
    const q: string = e.currentTarget.value;
    setSearch(q);
    searchLoadData(token, page, q);
  };

  return (
    <Box py={3} mt={4}>
      <PageHeader title="Customers" />
      <Box ml="auto">
        <Input onChange={doSearch} placeholder="Search for Users" mb={4} />
      </Box>
      <Box mx={0} mb={3} variant="table">
        <Box mb={2} sx={{ position: 'relative' }}>
          {search && search !== '' && (
            <Text
              onClick={() => setSearch('')}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              CLEAR
            </Text>
          )}
        </Box>
        {users &&
          users.users &&
          users.users.length > 0 &&
          users.users.map((_m: any) => (
            <Flex variant="tableItem">
              <Box p={2}>
                <Link href={`/users/${_m.profile?.id}`}>
                  <Text pb={2}>{_m.name}</Text>
                  <Box>{_m.email}</Box>
                </Link>
              </Box>
            </Flex>
          ))}
        <Flex p={4}>
          <Button mr={1} onClick={() => loadDataPage(1)}>
            1
          </Button>
          <Button mr={1} onClick={() => loadDataPage(2)}>
            2
          </Button>
          <Button mr={1} onClick={() => loadDataPage(3)}>
            3
          </Button>
          <Button mr={1} onClick={() => loadDataPage(4)}>
            4
          </Button>
          <Button mr={1} onClick={() => loadDataPage(5)}>
            5
          </Button>
          <Button mr={1} onClick={() => loadDataPage(6)}>
            6
          </Button>
          <Button mr={1} onClick={() => loadDataPage(7)}>
            7
          </Button>
          <Button mr={1} onClick={() => loadDataPage(8)}>
            8
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
export default Form;
