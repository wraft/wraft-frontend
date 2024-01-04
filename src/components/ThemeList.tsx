import React, { FC, useEffect, useState } from 'react';
import { Box, Text } from 'theme-ui';
import Link from './NavLink';
import { fetchAPI, deleteAPI } from '../utils/models';
// import { Button } from 'theme-ui';

import toast from 'react-hot-toast';

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
      sx={{
        position: 'relative',
        borderBottom: 'solid 1px',
        borderBottomColor: 'gray.0',
        borderRadius: '3px',
        ':hover': {
          '.merry': {
            display: 'block',
          },
        },
      }}>
      <Box sx={{ width: '33ch', mb: 1 }}>
        <Link href={`/manage/themes/edit/${props.id}`}>
          <Text as="h4" sx={{ mb: 0, p: 0, pb: 0 }}>
            {props.name}
          </Text>
        </Link>
      </Box>
      <Box
        className="merry"
        sx={{
          display: 'none',
          position: 'absolute',
          top: 0,
          right: 0,
          mt: 3,
          mr: 3,
        }}>
        {/* <Button variant="secondary" onClick={() => props.onDelete(props.id)}>
          Delete
        </Button> */}
      </Box>
    </Box>
  );
};

const Form: FC = () => {
  const [contents, setContents] = useState<Array<ThemeElement>>([]);

  const loadData = () => {
    fetchAPI('themes?sort=inserted_at_desc')
      .then((data: any) => {
        const res: ThemeElement[] = data.themes;
        setContents(res);
      })
      .catch();
  };

  const onDelete = (id: string) => {
    deleteAPI(`themes/${id}`).then(() => {
      toast.success('Deleted Theme', {
        duration: 1000,
        position: 'top-right',
      });
    });
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
