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
  prefix?: string;
}

const LayoutCard = ({
  id,
  name,
  model = 'content-types',
  color,
  prefix,
  // decription,
  screenshot,
  onDelete,
}: IItemField) => {
  return (
    <Box variant="m" sx={{ borderLeftColor: `${color}`, mb: 4 }}>
      <Flex bg="white">
        <Box
          variant="boxCard"
          sx={{
            mb: 1,
            mr: 4,
            borderRadius: 0,
            border: 0,
            bg: color || 'red',
            backgroundSize: 'cover',
            alignContent: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            // height: '80px',
            backgroundImage: `url(${API_HOST}${screenshot ? screenshot : ''}`,
          }}>
          <Text sx={{ pt: 4, color: 'white', fontSize: 4, fontWeight: 600 }}>{prefix}</Text>
          <Text sx={{ pt: 0, color: 'white', fontSize: 0, fontWeight: 100 }}>25k docs</Text>
        </Box>
        <Box sx={{ pt: 4, pr: 4}}>
          <Link href={`/${model}/[id]`} path={`/${model}/${id}`}>
            <Text sx={{ fontSize: 1, fontWeight: 500 }}>{name}</Text>
          </Link>
          <Flex mt={2} sx={{ opacity: 1 }}>
            <Link href={`/${model}/edit/[id]`} path={`/${model}/edit/${id}`}>
              <Edit width={20} />
            </Link>
            <Button sx={{ bg: 'white', p: 0 }} onClick={() => onDelete(id)}>
              <Box as={TrashAlt} color="red.4" ml={1} sx={{ width: '20px' }} />
            </Button>
          </Flex>
        </Box>
        {/* <Text sx={{ fontSize: 0}} color="gray.6">
          {decription}
        </Text> */}
      </Flex>
    </Box>
  );
};

export default LayoutCard;
