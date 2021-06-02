import React, { FC, useEffect, useState } from 'react';
import { Box, Flex, Text } from 'theme-ui';
// import { TrashAlt } from '@styled-icons/boxicons-regular';
import { deleteEntity, fetchAPI } from '../utils/models';
import { useStoreState } from 'easy-peasy';
import LayoutCard from './Card';
import { useToasts } from 'react-toast-notifications';

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

const LayoutList: FC = () => {
  // const token = useSelector(({ login }: any) => login.token);
  // const dispatch = useDispatch();
  const token = useStoreState((state) => state.auth.token);

  const [contents, setContents] = useState<Array<IField>>([]);
  const { addToast } = useToasts();

  /**
   * Delete a Layout
   * @param _id  layout_id
   */
  const onDelete = (_id: string) => {
    deleteEntity(`layouts/${_id}`, token);
    addToast('Deleted Theme', { appearance: 'error' });
    loadLayout();
  };

  /**
   * Load all Engines
   */
  const loadLayout = () => {
    fetchAPI('layouts')
      .then((data: any) => {
        const res: IField[] = data.layouts;
        setContents(res);
      })
      .catch();
  };

  useEffect(() => {
    loadLayout();
  }, []);

  return (
    <Box py={3} mt={4}>
      <Text as="h3" variant="pagetitle">Layouts</Text>
      <Box mx={0} mb={3}>
        <Flex>
        {contents &&
          contents.length > 0 &&
          contents.map((m: any) => (
            <LayoutCard model="layouts" key={m.id} {...m} onDelete={onDelete} />
          ))}
          </Flex>
      </Box>
    </Box>
  );
};
export default LayoutList;
