import React, { useEffect, useState } from 'react';
import { Box, Text } from 'rebass';
import MenuItem from './NavLink'
import { loadEntity } from '../utils/models';

import { useStoreState } from 'easy-peasy';

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

export interface IFlow {
  name: string;
  inserted_at: string;
  id: string;
  email: string;
}

export interface ICreator {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  email: string;
}


export interface IField {
  flow: IFlow;
  creator: ICreator;
}

export interface IFieldItem {
  name: string;
  type: string;
}

const ItemField = (props:any) => {
  return(
    <Box key={props.flow.id} pb={2} pt={2} sx={{ borderBottom: 'solid 1px #eee'}}>
      <MenuItem href={`/flows/edit/[id]`} path={`/flows/edit/${props.flow.id}`}>
        <Box>
          <Text fontSize={2} mb={1}>{props.flow.name}</Text>
          <Text color="#666">{props.flow.id}</Text>
        </Box>
      </MenuItem>
    </Box>
  )
}

const Form = () => {
  const token = useStoreState(state => state.auth.token);

  const [contents, setContents] = useState<Array<IField>>([]);
  
  const loadDataSuccess = (data:any) => {
    const res: IField[] = data.flows;
    setContents(res);
  }
  
  const loadData = (t:string) => {
    loadEntity(t, 'flows', loadDataSuccess)
  };

  useEffect(() => {    
    if (token) {
      loadData(token);
    }    
  }, [token]);

  return (
    <Box py={3} width={1} mt={4}>
      <Text variant="pagetitle">Flows</Text>
      <Box mx={0} mb={3} width={1}>
        <Box>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => <ItemField key={m.flow.id} {...m}/>)}
        </Box>
      </Box>
    </Box>
  );
};
export default Form;
