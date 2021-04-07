import React, { useEffect, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { Box, Text, Flex, Spinner, Grid } from 'theme-ui';
import { Plus } from '@styled-icons/boxicons-regular';

import Link from './NavLink';
import { deleteEntity, fetchAPI } from '../utils/models';
import LayoutCard from './Card';

export interface ILayout {
  width: number;
  updated_at: string;
  unit: string;
  slug: string;
  name: string;
  id: string;
  height: number;
  description: string;
}

export interface IField {
  id: string;
  name: string;
  layout_id: string;
  layout: ILayout;
  description: string;
}

export interface IFieldItem {
  name: string;
  type: string;
}

const ContentTypeList = () => {
  const token = useStoreState(state => state.auth.token);

  const [contents, setContents] = useState<Array<IField>>([]);
  const [loading, setLoading] = useState<boolean>(false);


  /** DELETE content
   * @TODO move to inner page [design]
   */
  const delData = (id: string) => {
    deleteEntity(`content_types/${id}`, token);
  };

  const loadData = () => {
    fetchAPI('content_types')
        .then((data: any) => {
          setLoading(true);
          const res: IField[] = data.content_types;
          setContents(res);
        })
        .catch(() => {
          setLoading(true);
        });
  };

  useEffect(() => {
    loadData()
  }, []);

  return (
    <Box py={3} sx={{ width: '100%', pl: 3}}>
      <Flex sx={{ width: '100%'}}>
        <Text variant="pagetitle">Variants</Text>

        {!loading && (
          <Box>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}
        <Box sx={{ ml: 'auto', display: 'inline-flex' }}>
          <Link
            variant="button"
            href="/content-types/new"
            icon={<Plus width={20} sx={{ mt: 1}} />}>
            <Text sx={{ml: 1, pt: 0, fontSize: 1, fontWeight: 600}}>Create Variant</Text>
          </Link>
        </Box>
      </Flex>
      <Flex bg='gray.0' sx={{ width: '100%', pt: 4}}>
        <Grid columns={3}>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => (
              <LayoutCard key={m.id} {...m} onDelete={delData} />
            ))}
        </Grid>
        {/* <Box bg='white' ml="auto" sx={{ width: '30%', p: 4, border: 'solid 1px', borderColor: 'gray.1', borderRadius: 2}}>
          <Text>Heading 1</Text>
        </Box> */}
      </Flex>
    </Box>
  );
};
export default ContentTypeList;
