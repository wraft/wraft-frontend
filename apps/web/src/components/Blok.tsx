import React, { useEffect, useState } from 'react';

import { Box, Text, Flex } from 'theme-ui';

import { fetchAPI } from '../utils/models';

import Link from './NavLink';
// import { SearchIcon } from './Icons';

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

// interface ContentTypeList {
//   isEdit?: boolean;
// }

const Blok = () => {
  // const token = useStoreState((state) => state.auth.token);

  const [contents, setContents] = useState<Array<IField>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  /** DELETE content
   * @TODO move to inner page [design]
   */
  // const delData = (id: string) => {
  //   deleteEntity(`content_types/${id}`, token);
  // };

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
    <Box bg="gray.0" sx={{ border: 'solid 1px', borderColor: 'border' }}>
      <Box>{loading && <></>}</Box>
      {/* <Flex>
        <Input placeholder="Search eg: Offer Letter" sx={{ fontSize: 0, mb: 0 }} />
        <Button sx={{ bg: 'primary', borderRadius: 0 }}>
          <SearchIcon />
        </Button>
      </Flex> */}
      <Box sx={{ p: 0, borderTop: 'solid 1px', borderColor: 'border' }}>
        <Box
          variant="caps"
          sx={{
            // fontSize: 0,
            bg: 'gray.200',
            py: 1,
            pl: 3,
            color: 'text',
            width: '100%',
            borderBottom: 'solid 1px',
            borderColor: 'border',
          }}>
          <Text as="h4" sx={{ fontSize: 2, fontWeight: 'heading' }}>
            Select a variant
          </Text>
        </Box>
        {contents && contents.map((x: any) => <BlockItem key={x.id} {...x} />)}
      </Box>
    </Box>
  );
};
export default Blok;

interface BlockItemProps {
  name: string;
  color: string;
  prefix: string;
  id: string;
}

export const BlockItem = ({ id, name, color, prefix }: BlockItemProps) => {
  return (
    <Flex
      sx={{
        px: 3,
        py: 2,
        borderBottom: 'solid 1px',
        bg: 'neutral.100',
        borderColor: 'border',
        cursor: 'pointer',
        '&:hover': { bg: 'neutral.200' },
      }}>
      <Box
        sx={{
          width: '16px',
          borderRadius: 4,
          mr: 2,
          mt: 1,
          borderColor: 'border',
          height: '16px',
          bg: color,
        }}
      />

      <Link href={`/new?template=${id}`}>{name}</Link>
      <Text
        as="h4"
        sx={{
          fontSize: 0,
          m: 0,
          ml: 'auto',
          color: 'text',
          fontWeight: 300,
        }}>
        {prefix}
      </Text>
    </Flex>
  );
};
