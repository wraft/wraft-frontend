import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from 'rebass';
import Link from './NavLink';
import { Plus } from './Icons';
import { loadEntity } from '../utils/models';
import { useStoreState } from 'easy-peasy';

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

const ItemField = (props: any) => {
  return (
    <Box
      variant="boxy"
      width={1 / 4}
      key={props.id}
      p={3}
      sx={{ bg: '#fff', borderBottom: 'solid 1px #eee', borderRadius: '3px' }}>
      <Text fontSize={1} fontWeight="bold">
        {props.name}
      </Text>
      <Text fontSize={0} pt={1} color="grey">
        Sample Field Description
      </Text>
    </Box>
  );
};

const Form = () => {
  const token = useStoreState(state => state.auth.token);
  const [contents, setContents] = useState<Array<FieldType>>([]);

  const loadDataSuccess = (data: any) => {
    const res: FieldTypeList = data;
    setContents(res.field_types);
  };

  const loadData = (t: string) => {
    loadEntity(t, 'field_types', loadDataSuccess);
  };

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);

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
