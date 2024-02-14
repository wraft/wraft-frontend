import React, { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { Box, Text, Flex, Grid } from 'theme-ui';
// import ContentLoader from 'react-content-loader';

import { useAuth } from '../contexts/AuthContext';
import { fetchAPI, deleteAPI } from '../utils/models';
import { EmptyForm } from './Icons';
import Link from './NavLink';

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
    <Link
      variant="base"
      href={
        isEdit ? `/content-types/edit/` + `${id}` : `/content-types/` + `${id}`
      }>
      <Box
        sx={{
          bg: 'neutral.100',
          minWidth: '220px',
          // maxHeight: '200px',
          border: 'solid 1px',
          borderColor: 'border',
          borderRadius: 6,
          cursor: 'pointer',
          mr: 3,
          ':hover': {
            bg: 'neutral.200',
          },
        }}>
        <Box sx={{ height: '79px', pt: '12px', pl: '12px' }}>
          <Box
            sx={{
              width: '53px',
              height: '10px',
              bg: color,
              borderRadius: '2px',
            }}
          />
        </Box>
        <Box px={3} py={2} sx={{ borderTop: '1px solid #E4E9EF' }}>
          <Text
            sx={{
              fontFamily: 'body',
              fontSize: 2,
              pt: 1,
              color: 'text',
              fontWeight: 500,
            }}>
            {name}
          </Text>
        </Box>
      </Box>

      {/* {isEdit ? 'yes' : 'no'} */}
      {/* <Box pl={3} pt={1} pb={2} bg="">
          <Text sx={{ fontSize: 2, pt: 1, color: 'gray.900' }}>{name}</Text>
        </Box> */}
    </Link>
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
  const [contents, setContents] = useState<Array<IField>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { accessToken } = useAuth();

  const delData = (id: string) => {
    deleteAPI(`content_types/${id}`);
  };

  const loadData = () => {
    setLoading(true);
    fetchAPI('content_types?sort=inserted_at_desc')
      .then((data: any) => {
        setLoading(false);
        const res: IField[] = data.content_types;
        setContents(res);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [accessToken]);

  console.log('loading[ww]', loading);

  return (
    <Box>
      <Box sx={{ width: '100wh', pt: 2 }}>
        {loading && <RepeatableTableRows />}
      </Box>

      {!loading && contents && contents.length > 0 && (
        <Flex sx={{ width: '100%', pt: 2 }}>
          <Grid columns={3}>
            {contents.map((m: any) => (
              <DocCard key={m.id} {...m} isEdit={isEdit} onDelete={delData} />
            ))}
          </Grid>
        </Flex>
      )}
      {!loading && contents && contents.length === 0 && (
        <Box>
          <Flex>
            <Box sx={{ color: 'gray.500', width: 'auto' }}>
              <EmptyForm />
            </Box>
            <Box sx={{ m: 2, pb: 0 }}>
              <Text as="h2" sx={{ fontWeight: 300 }}>
                Templates are empty
              </Text>
              <Text as="h3" sx={{ fontWeight: 200, color: 'text' }}>
                You havent created a templates yet
              </Text>
            </Box>
          </Flex>
        </Box>
      )}
    </Box>
  );
};
export default ContentTypeDashboard;

const RepeatableTableRows = (props: any) => {
  return (
    <ContentLoader
      width={800}
      height={575}
      viewBox="0 0 800 575"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}>
      <rect x="12" y="58" rx="2" ry="2" width="211" height="150" />
      <rect x="240" y="57" rx="2" ry="2" width="211" height="150" />
      <rect x="467" y="56" rx="2" ry="2" width="211" height="150" />
      <rect x="12" y="283" rx="2" ry="2" width="211" height="150" />
      <rect x="240" y="281" rx="2" ry="2" width="211" height="150" />
      <rect x="468" y="279" rx="2" ry="2" width="211" height="150" />
    </ContentLoader>
  );
};
RepeatableTableRows.metadata = {
  name: 'Lukas Werner',
  github: 'sherpaPSX',
  description:
    'Repeatable table rows. You can easily define number of rows in props and generate then in one svg',
  filename: 'RepeatableTableRows',
};
