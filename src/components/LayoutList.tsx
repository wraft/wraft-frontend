import React, { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import { Box, Flex, Text } from 'theme-ui';

import { fetchAPI, deleteAPI } from '../utils/models';

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

interface Props {
  rerender?: boolean;
}

const LayoutList = ({ rerender }: Props) => {
  // const token = useSelector(({ login }: any) => login.token);
  // const dispatch = useDispatch();
  const [contents, setContents] = useState<Array<IField>>([]);

  /**
   * Delete a Layout
   * @param _id  layout_id
   */
  const onDelete = (_id: string) => {
    deleteAPI(`layouts/${_id}`).then(() => {
      toast.success('Deleted Theme', {
        duration: 1000,
        position: 'top-right',
      });
      loadLayout();
    });
  };

  /**
   * Load all Engines
   */
  const loadLayout = () => {
    fetchAPI('layouts?sort=inserted_at_desc')
      .then((data: any) => {
        const res: IField[] = data.layouts;
        setContents(res);
      })
      .catch();
  };

  useEffect(() => {
    loadLayout();
  }, [rerender]);

  return (
    <Box py={3} mt={4}>
      <Text as="h3" variant="pagetitle">
        Layouts
      </Text>
      <Box mx={0} mb={3}>
        <Flex sx={{ flexWrap: 'wrap' }}>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => (
              <LayoutCard
                model="layouts"
                key={m.id}
                {...m}
                onDelete={onDelete}
              />
            ))}
        </Flex>
      </Box>
    </Box>
  );
};
export default LayoutList;
