import React, { FC, useEffect, useState } from 'react';
import { Box, Text, Flex } from 'rebass';
import Link from './NavLink';
import { Plus } from './Icons';
import { fetchAPI } from '../utils/models';
export interface FieldTypeList {
  total_pages: number;
  total_entries: number;
  page_number: number;
  field_types: FieldType[];
}
export interface FieldType {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
}

const ItemField: FC<any> = ({ id, name }) => {
  return (
    <Box
      variant="boxy"
      width={1 / 4}
      key={id}
      p={3}
      sx={{ bg: '#fff', borderBottom: 'solid 1px #eee', borderRadius: '3px' }}>
      <Text fontSize={1} fontWeight="bold">
        {name}
      </Text>
      <Text fontSize={0} pt={1} color="grey">
        Sample Field Description
      </Text>
    </Box>
  );
};

const Form: FC = () => {
  const [contents, setContents] = useState<Array<FieldType>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    fetchAPI('field_types')
      .then((data: any) => {
        const res: FieldTypeList = data;
        setContents(res.field_types);
      })
      .catch();
  };

  return (
    <Box py={3} width={1} mt={4}>
      <Flex>
        <Link href="/fields/new" icon={<Plus />}>
          <Text>New</Text>
        </Link>
      </Flex>
      <Text fontSize={2} mb={3}>
        All Field Types
      </Text>
      <Box mx={0} mb={3} width={1}>
        <Flex>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => <ItemField key={m.id} {...m} />)}
        </Flex>
      </Box>
    </Box>
  );
};
export default Form;
