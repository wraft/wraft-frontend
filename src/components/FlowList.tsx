import React, { FC, useEffect, useState } from 'react';
import { Box, Text } from 'rebass';
import MenuItem from './NavLink';
import { fetchAPI } from '../utils/models';

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

const ItemField: FC<any> = ({ flow }) => {
  return (
    <Box key={flow.id} pb={2} pt={2} sx={{ borderBottom: 'solid 1px #eee' }}>
      <MenuItem href={`/flows/edit/[id]`} path={`/flows/edit/${flow.id}`}>
        <Box>
          <Text fontSize={2} mb={1}>
            {flow.name}
          </Text>
          <Text color="#666">{flow.id}</Text>
        </Box>
      </MenuItem>
    </Box>
  );
};

const Form: FC = () => {
  const [contents, setContents] = useState<Array<IField>>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    fetchAPI('flows')
      .then((data: any) => {
        const res: IField[] = data.flows;
        setContents(res);
      })
      .catch();
  };

  return (
    <Box py={3} width={1} mt={4}>
      <Text variant="pagetitle">Flows</Text>
      <Box mx={0} mb={3} width={1}>
        <Box>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => <ItemField key={m.flow.id} {...m} />)}
        </Box>
      </Box>
    </Box>
  );
};
export default Form;
