import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from 'theme-ui';
import Link from './NavLink';
import { Plus } from './Icons';
import { loadEntity } from '../utils/models';
import { useStoreState } from 'easy-peasy';
// import { Button } from 'theme-ui';

// import { useToasts } from 'react-toast-notifications';

export interface Theme {
  total_pages:   number;
  total_entries: number;
  themes:        ThemeElement[];
  page_number:   number;
}

export interface ThemeElement {
  updated_at:  string;
  typescale:   any;
  name:        string;
  inserted_at: string;
  id:          string;
  font:        string;
  file:        null;
}

const Form = () => {
  const token = useStoreState(state => state.auth.token);
  const [contents, setContents] = useState<Array<ThemeElement>>([]);
  // const { addToast } = useToasts();

  const loadDataSuccess = (data: any) => {
    const res: ThemeElement[] = data.themes;
    setContents(res);
  };

  const loadData = (t: string) => {
    loadEntity(t, 'themes', loadDataSuccess);
  };

  // const onDelete = (id: string) => {
  //   deleteEntity(`approval_systems/${id}`, token)
  //   addToast('Deleted Approval System', { appearance: 'success' });
  // }

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);

  return (
    <Box py={3} mt={4}>
      <Flex>
        <Link href="/approvals/new" icon={<Plus />}>
          <Text>New</Text>
        </Link>
      </Flex>
      <Text mb={3}>
        All Approval Systems
      </Text>
      <Box mx={0} mb={3}>

        { !contents &&
          <Text>Nothing to approve</Text>
        }
        {/* <Box>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => <ItemField key={m.id} {...m} onDelete={onDelete}/>)}
        </Box> */}
      </Box>
    </Box>
  );
};
export default Form;
