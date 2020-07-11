import React, { useEffect, useState } from 'react';
import { Box, Text, Button, Flex } from 'rebass';
import styled from 'styled-components';

import { useStoreState } from 'easy-peasy';

import Link from './NavLink';
import { Abstract } from './Icons';

import {
  TrashAlt,
  Edit,
  Plus
} from '@styled-icons/boxicons-regular';

import { deleteEntity, loadEntity } from '../utils/models';
import { Spinner } from 'theme-ui';

const Block = styled(Box)`
  border-radius: 4px;
  border: solid 1px #eee;
  padding: 4px;
  margin-top: 13px !important;
`;

const ButtonLink = styled(Link)`
  border: solid 1px #4444;
  border-radius: 4px;
  padding-top: 5px;
  padding-bottom: 4px;
  padding-left: 8px;
  padding-right: 16px;
  font-weight: bold;
  display: flex;
`;

const ColorPill = styled(Box)`
  width: 10px;
  height: 10px;
  display: inline-block;
  border-radius: 3px;
`

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

const ItemField = (props: any) => {
  return (
    <Block p={4} mr={3} bg="#fff" sx={{ borderBottom: 'solid 1px #eee' }} width={1 / 4}>
      <Abstract/>
      <Link href={`/content-types/[id]`} path={`/content-types/${props.id}`}>
        <ColorPill bg={props.color}/>
        <Text fontSize={2} fontWeight={600}>
          {props.name}
        </Text>
      </Link>
      <Text py={1} fontSize={0} color="#666">
        {props.decription}
      </Text>
      <Flex mt={2}>        
        <Link href={`/content-types/edit/[id]`} path={`/content-types/edit/${props.id}`}>
          <Edit width={20} />
        </Link>
        <Button sx={{ bg: '#fff', p: 0 }} onClick={() => props.onDelete(props.id)}>
          <TrashAlt width={20} height={20} color="red"/>
        </Button>
      </Flex>
    </Block>
  );
};

const Form = () => {
  const token = useStoreState(state => state.auth.token);

  const [contents, setContents] = useState<Array<IField>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const loadDataSuccess = (data:any) => {
    setLoading(true);
    const res: IField[] = data.content_types;
    setContents(res);
  }

  /** DELETE content
   * @TODO move to inner page [design]
   */
  const delData = (id: string) => {
    console.log('token', token)
    deleteEntity(`content_types/${id}`, token)    
  };
  
  const loadData = (t: string) => {
    loadEntity(t, 'content_types', loadDataSuccess);
  };

  useEffect(() => {
    if (token) {
      // dispatch({ type: 'LOGIN_SUCCESS', payload: token });
    }

    loadData(token);
  }, [token]);

  return (
    <Box py={3} width={1} mt={4}>
      <Flex width={1}>
        <Text variant="pagetitle">
          All Contents
        </Text>

        {!loading && (
        <Box>
          <Spinner width={40} height={40} color="primary" />
        </Box>
      )}
        <Box sx={{ ml: 'auto' }}>
          <ButtonLink variant="button" href="/content-types/new" icon={<Plus width={20} />}>
            <Text>New Content Type</Text>
          </ButtonLink>
        </Box>
      </Flex>
      <Box mx={0} mb={3} width={1}>
        <Flex>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => <ItemField key={m.id} {...m} onDelete={delData} />)}
        </Flex>
      </Box>
    </Box>
  );
};
export default Form;
