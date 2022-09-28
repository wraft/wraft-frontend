import React, { FC, useEffect, useState } from 'react';
import { Box, Text, Flex } from 'theme-ui';
import Link from './NavLink';
import { EmptyForm } from './Icons';
import { fetchAPI, deleteEntity } from '../utils/models';
import { useStoreState } from 'easy-peasy';
import { Button } from 'theme-ui';

import { useToasts } from 'react-toast-notifications';

export interface Theme {
  total_pages: number;
  total_entries: number;
  form_collections: FormElement[];
  page_number: number;
}

export interface FormElement {
  updated_at: string;
  title: string;
  inserted_at: string;
  id: string;
  description: string;
}

const ItemField = (props: any) => {
  return (
    <Box
      variant="boxy"
      key={props.id}
      p={3}
      sx={{
        position: 'relative',
        bg: '#fff',
        borderBottom: 'solid 1px #eee',
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
        <Text as="p" sx={{ mt: 0, p: 0 }} pt={0} color="grey">
          Sample Field Description
        </Text>
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
        <Button variant="secondary" onClick={() => props.onDelete(props.id)}>
          Delete
        </Button>
      </Box>
    </Box>
  );
};

const FormList: FC = () => {
  const token = useStoreState((state) => state.auth.token);
  const [contents, setContents] = useState<Array<FormElement>>([]);
  const { addToast } = useToasts();

  const loadData = () => {
    fetchAPI('collection_forms')
      .then((data: any) => {
        const res: FormElement[] = data.collection_forms;
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
    <Box py={3} mt={4}>
      <Box mx={0} mb={3}>
        {contents.length < 1 && (
          <Box>
            <Flex>
              <Box sx={{ color: 'gray.5', width: 'auto' }}>
                <EmptyForm />
              </Box>
              <Box sx={{ m: 2, pb: 0 }}>
                <Text as="h2" sx={{ fontWeight: 300 }}>
                  No Forms present
                </Text>
                <Text as="h3" sx={{ fontWeight: 200, color: 'gray.6' }}>
                  You have not created a collection form yet, click below to
                  create one
                </Text>
                <Box sx={{ mt: 3, pb: 0 }}>
                  <Button>Add Form</Button>
                </Box>
              </Box>
            </Flex>
          </Box>
        )}
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

export default FormList;
