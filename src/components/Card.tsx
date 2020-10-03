import React from 'react';
import { Box, Flex, Text, Button } from 'theme-ui';
import { TrashAlt, Edit } from '@styled-icons/boxicons-regular';

import Link from './NavLink'

interface IItemField {
  id?: string;
  name?: string;
  color?: string;
  decription?: string;
  onDelete?: any;
  model?:string;
}

const LayoutCard = ({ id, name, model = 'content-types', color, decription, onDelete }: IItemField) => {
  return (
    <Box variant="plateBlock" sx={{ borderLeftColor: `${color}`}}>      
      <Link href={`/${model}/[id]`} path={`/${model}/${id}`}>
        <Text sx={{ color, fontSize: 2, fontWeight: 'body' }}>{name}</Text>
      </Link>
      <Text py={1} color="gray.6">{decription}</Text>
      <Flex mt={2}>
        <Link
          href={`/${model}/edit/[id]`}
          path={`/${model}/edit/${id}`}>
          <Edit width={20} />
        </Link>
        <Button sx={{ bg: '#fff', p: 0 }} onClick={() => onDelete(id)}>
          <Box as={TrashAlt} color="red.6" ml={1}/>
        </Button>
      </Flex>
    </Box>
  );
};

export default LayoutCard;