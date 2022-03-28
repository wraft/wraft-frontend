import React, { FC, useEffect, useState } from 'react';
import { Box, Text, Flex } from 'theme-ui';
import Link from './NavLink';
import { Plus } from './Icons';
import { fetchAPI, deleteEntity } from '../utils/models';
import { useStoreState } from 'easy-peasy';
import { Button } from 'theme-ui';

import { useToasts } from 'react-toast-notifications';

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

const ItemField = (props: any) => {
  return (
    <Box
      variant="boxy"
      key={props.id}
      p={3}
      sx={{ position: 'relative', bg: '#fff', borderBottom: 'solid 1px #eee', borderRadius: '3px', ':hover': {
        '.merry': {
          display: 'block',
        }
      } }}>
        <Box sx={{ width: '33ch', mb: 1 }}>
          <Link href={`/manage/themes/edit/${props.id}`}>
            <Text as="h4" sx={{ mb:0, p: 0, pb: 0 }}>{props.name}</Text>
          </Link>
          <Text as="p" sx={{ mt: 0, p: 0}}pt={0} color="grey">
            Sample Field Description
          </Text>
        </Box>
      <Box className="merry" sx={{ display: 'none', position: 'absolute', top: 0, right: 0, mt: 3, mr: 3}}>
        <Button variant="secondary" onClick={() => props.onDelete(props.id)}>Delete</Button>
      </Box>
    </Box>
  );
};

const Form: FC = () => {
  const token = useStoreState((state) => state.auth.token);
  const [contents, setContents] = useState<Array<ThemeElement>>([]);
  const { addToast } = useToasts();

  const loadData = () => {
    fetchAPI('themes')
      .then((data: any) => {
        const res: ThemeElement[] = data.themes;
        setContents(res);
      })
      .catch();
  };

  const onDelete = (id: string) => {
    deleteEntity(`themes/${id}`, token);
    addToast('Deleted Theme', { appearance: 'success' });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Box py={3} mt={0}>
      <Box mx={0} mb={3}>
        <Box>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => (
              <ItemField key={m.id} {...m} onDelete={onDelete} />
            ))}
        </Box>
      </Box>
    </Box>
  );
};
export default Form;
