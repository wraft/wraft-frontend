import React, { useEffect, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { Box, Text, Button, Flex, Spinner } from 'theme-ui';
import { TrashAlt, Edit, Plus } from '@styled-icons/boxicons-regular';

import Link from './NavLink';
import { deleteEntity, loadEntity } from '../utils/models';

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

interface IItemField {
  id?: string;
  name?: string;
  color?: string;
  decription?: string;
  onDelete?: any;
}

const ItemField = ({ id, name, color, decription, onDelete }: IItemField) => {
  return (
    <Box variant="plateBlock">
      <Flex>
        <Box
          sx={{
            bg: color,
            width: '16px',
            minHeight: '100%',
            display: 'inline-block',
            borderRadius: '11rem',
          }}></Box>
      </Flex>
      <Link href={`/content-types/[id]`} path={`/content-types/${id}`}>
        <Text sx={{ fontWeight: 'heading' }}>{name}</Text>
      </Link>
      <Text py={1}>{decription}</Text>
      <Flex mt={2}>
        <Link
          href={`/content-types/edit/[id]`}
          path={`/content-types/edit/${id}`}>
          <Edit width={20} />
        </Link>
        <Button sx={{ bg: '#fff', p: 0 }} onClick={() => onDelete(id)}>
          <TrashAlt width={20} height={20} color="red" />
        </Button>
      </Flex>
    </Box>
  );
};

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
    <Box py={3}>
      <Flex>
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
      <Box mx={0} mb={3}>
        <Flex>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => (
              <ItemField key={m.id} {...m} onDelete={delData} />
            ))}
        </Flex>
      </Box>
    </Box>
  );
};
export default ContentTypeList;
