import React, { useEffect, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { Box, Text, Flex, Spinner } from 'theme-ui';
import { Plus } from '@styled-icons/boxicons-regular';

import Link from './NavLink';
import { deleteEntity, loadEntity } from '../utils/models';
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

  const loadDataSuccess = (data: any) => {
    setLoading(true);
    const res: IField[] = data.content_types;
    setContents(res);
  };

  /** DELETE content
   * @TODO move to inner page [design]
   */
  const delData = (id: string) => {
    deleteEntity(`content_types/${id}`, token);
  };

  const loadData = (t: string) => {
    loadEntity(t, 'content_types', loadDataSuccess);
  };

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);

  return (
    <Box py={3} sx={{ width: '100%'}}>
      <Flex sx={{ width: '100%'}}>
        <Text variant="pagetitle">All Contents</Text>

        {!loading && (
          <Box>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}
        <Box sx={{ ml: 'auto' }}>
          <Link
            variant="button"
            href="/content-types/new"
            icon={<Plus width={20} />}>
            <Text>New Content Type</Text>
          </Link>
        </Box>
      </Flex>
      <Flex bg='gray.0' sx={{ width: '100%'}}>
        <Flex sx={{ width:'100%'}}>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => (
              <LayoutCard key={m.id} {...m} onDelete={delData} />
            ))}
        </Flex>
        <Box bg='white' ml="auto" sx={{ width: '30%', p: 4, border: 'solid 1px', borderColor: 'gray.1', borderRadius: 2}}>
          <Text>Heading 1</Text>
        </Box>
      </Flex>
    </Box>
  );
};
export default ContentTypeList;
