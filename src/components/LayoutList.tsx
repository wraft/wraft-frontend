import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button } from 'rebass';
import { TrashAlt } from '@styled-icons/boxicons-regular';
import { loadEntity, deleteEntity } from '../utils/models';

import Link from './NavLink';
import { useStoreState } from 'easy-peasy';

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

const ItemField = (props: any) => {
  const token = useStoreState(state => state.auth.token);
  const delData = (id: string) => {
    deleteEntity(`layouts/${id}`, token);
  };

  return (
    <Flex pb={2} pt={2} sx={{ borderBottom: 'solid 1px #eee' }} ml="auto">
      <Link href={`/layouts/edit/[id]`} path={`/layouts/edit/${props.id}`}>
        <Text fontSize={2}>{props.name}</Text>
      </Link>
      <Button
        sx={{ bg: '#fff', p: 1, ml: 2, border: 'solid 1px #eee' }}
        onClick={() => delData(props.id)}>
        <TrashAlt width={20} height={20} color="#555" />
      </Button>
    </Flex>
  );
};

const Form = () => {
  // const token = useSelector(({ login }: any) => login.token);
  // const dispatch = useDispatch();
  const token = useStoreState(state => state.auth.token);

  const [contents, setContents] = useState<Array<IField>>([]);

  /**
   * on Engine Load Success
   * @param data
   */
  const loadLayoutSuccess = (data: any) => {
    const res: IField[] = data.layouts;
    setContents(res);
  };

  /**
   * Load all Engines
   * @param token
   */
  const loadLayout = (token: string) => {
    loadEntity(token, 'layouts', loadLayoutSuccess);
  };

  useEffect(() => {
    if (token) {
      loadLayout(token);
    }
  }, [token]);

  return (
    <Box py={3} width={1} mt={4}>
      <Text variant="pagetitle">Layouts</Text>
      <Box mx={0} mb={3} width={1}>
        <Box>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => <ItemField key={m.id} {...m} />)}
        </Box>
      </Box>
    </Box>
  );
};
export default Form;
