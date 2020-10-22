import React from 'react';
import { Box, Flex, Text, Button } from 'theme-ui';
import { TrashAlt, Edit } from '@styled-icons/boxicons-regular';

import Link from './NavLink';
import { API_HOST } from '../utils/models';

interface IItemField {
  id?: string;
  name?: string;
  color?: string;
  decription?: string;
  onDelete?: any;
  model?: string;
  screenshot?: string;
}

const LayoutCard = ({
  id,
  name,
  model = 'content-types',
  color,
  // decription,
  screenshot,
  onDelete,
}: IItemField) => {
  return (
    <Box variant="m" sx={{ borderLeftColor: `${color}` }}>
      <Box
        variant="boxCard"
        sx={{
          mb: 2,
          mr: 4,
          bg: color || 'red',
          backgroundSize: 'cover',
          backgroundImage: `url(${API_HOST}${screenshot ? screenshot : ''}`,
        }}>

          {name}
        </Box>
      <Link href={`/${model}/[id]`} path={`/${model}/${id}`}>
        <Text sx={{ fontSize: 1, fontWeight: 400 }}>{name}</Text>
      </Link>
      {/* <Text sx={{ fontSize: 0}} color="gray.6">
        {decription}
      </Text> */}
      <Flex mt={2} sx={{ opacity: 1 }}>
        <Link href={`/${model}/edit/[id]`} path={`/${model}/edit/${id}`}>
          <Edit width={20} />
        </Link>
        <Button sx={{ bg: 'white', p: 0 }} onClick={() => onDelete(id)}>
          <Box as={TrashAlt} color="red.4" ml={1} sx={{ width: '20px' }} />
        </Button>
      </Flex>
    </Box>
  );
};

export default LayoutCard;
