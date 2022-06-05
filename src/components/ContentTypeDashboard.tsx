import React, { useEffect, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { Box, Text, Flex, Spinner, Grid } from 'theme-ui';

import Link from './NavLink';
import { deleteEntity, fetchAPI } from '../utils/models';

/**
 * DocType Cards
 * -------------
 *
 * @returns
 */

interface DocCardProps {
  id: any;
  name?: string;
  color?: string;
  isEdit?: boolean;
}

export const DocCard = ({ name, id, color, isEdit }: DocCardProps) => {
  return (
    <Box
      sx={{
        bg: 'background',
        minWidth: '220px',
        // maxHeight: '200px',
        border: 'solid 1px',
        borderColor: 'gray.3',
        borderRadius: 2,
        mr: 3,
      }}>
      <Link
        variant="base"
        href={
          isEdit
            ? `/content-types/edit/` + `${id}`
            : `/content-types/` + `${id}`
        }>
        <Box sx={{ height: '45px', bg: color }}></Box>
        {/* {isEdit ? 'yes' : 'no'} */}
        <Box pl={3} pt={1} pb={2} bg="gray.0">
          <Text sx={{ fontSize: 1, pt: 1, color: 'gray.8' }}>{name}</Text>
        </Box>
      </Link>
    </Box>
  );
};

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

interface ContentTypeDashboardProps {
  isEdit?: boolean;
}

const ContentTypeDashboard = ({ isEdit }: ContentTypeDashboardProps) => {
  const token = useStoreState((state) => state.auth.token);

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
    loadData();
  }, []);

  return (
    <Box>
      <Flex sx={{ width: '100%' }}>
        {!loading && (
          <Box>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}
      </Flex>
      <Flex sx={{ width: '100%', pt: 2 }}>
        <Grid columns={3}>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => (
              <DocCard key={m.id} {...m} isEdit={isEdit} onDelete={delData} />
            ))}
        </Grid>
      </Flex>
    </Box>
  );
};
export default ContentTypeDashboard;
