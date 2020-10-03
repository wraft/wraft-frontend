import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from 'rebass';
import MenuItem from './NavLink';
import styled from 'styled-components';

import { parseISO, formatDistanceToNow } from 'date-fns';

import ReactPaginate from 'react-paginate';

import {
  BoltCircle as Check,
  InfoCircle,
} from '@styled-icons/boxicons-regular';
import { useStoreState } from 'easy-peasy';
import { loadEntity, deleteEntity } from '../utils/models';
import { Spinner } from 'theme-ui';

const TimeAgo = (time: any) => {
  const timetime = parseISO(time.time);
  const timed = formatDistanceToNow(timetime);
  return (
    <Text pl={2} pt={1} fontSize={0} mt={0} color="#777">
      \ {timed}
    </Text>
  );
};

const ColorPill = styled(Box)`
  width: 2px;
  position: absolute;
  top: 8;
  left: 0;
  height: 40px;
  display: inline-block;
  border-radius: 0px;
`;

const Pill = styled(Box)`
  border-radius: 1rem;
  font-size: 7px !important;
  opacity: 0.7;
  padding: 4px;
  display: inline-block;
  margin-top: 2px;
`;

const Block = styled(Box)`
  border-radius: 3px;
  padding: 4px;
  margin-top: 13px !important;
  border-bottom: solid 1px #ddd;
  padding-left: 40px;
  padding-bottom: 24px;
  position: relative;
`;

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

export interface IContentType {
  name: string;
  id: string;
  description: string;
  color: string;
}

export interface IContent {
  id: string;
  updated_at: string;
  instance_id: string;
  serialized: any;
}

export interface StateClass {
  updated_at: string;
  state: string;
  order: number;
  inserted_at: string;
  id: string;
}

export interface IField {
  content: IContent;
  content_type: IContentType;
  state: StateClass;
  doDelete: any;
}

export interface IFieldItem {
  name: string;
  type: string;
}

const Tablet = (props: any) => (
  <Pill pt={1} sx={{ p: 1, width: 'auto' }} {...props} rel={props.type}>
    <Text fontSize={0}>{props.type}</Text>
  </Pill>
);

const ItemField = (props: IField) => {
  return (
    <Block key={props.content.instance_id} pb={3} pt={3}>
      <MenuItem href={`/content/[id]`} path={`content/${props.content.id}`}>
        <Flex>
          <Text fontSize={1} mb={1} fontWeight={500}>
            {props.content.serialized.title}
          </Text>
          <Box ml="auto">
            {props.state.state === 'Published' && (
              <Check width={16} color="#2b8a3e" />
            )}

            {props.state.state === 'Draft' && (
              <InfoCircle width={16} color="#5c7cfa" />
            )}
            <Text fontSize={0} pt={1} sx={{ display: 'inline-block' }}>
              {props.state.state}
            </Text>
            <ColorPill bg={props.content_type.color} />
            <Flex>{/* props.content_type.name */}</Flex>
          </Box>
        </Flex>
        <Box>
          <Flex>
            <Box pr={1}>
              <Tablet type={props.content.instance_id} pr={2} />
            </Box>

            <TimeAgo time={props.content.updated_at} />
          </Flex>
        </Box>
      </MenuItem>
    </Block>
  );
};

export interface IPageMeta {
  page_number: number;
  total_entries: number;
  total_pages: number;
  contents?: any;
}

const ContentList = () => {
  const token = useStoreState(state => state.auth.token);

  const [contents, setContents] = useState<Array<IField>>([]);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [loading, setLoading] = useState<boolean>(false);

  const loadDataSuccess = (data: IPageMeta) => {
    setLoading(true);
    const res: IField[] = data.contents;
    setContents(res);
    setPageMeta(data);
  };

  const loadData = (token: string) => {
    loadEntity(token, 'contents', loadDataSuccess);
  };

  /** DELETE content
   * @TODO move to inner page [design]
   */
  const delData = (id: string) => {
    deleteEntity(`contents/${id}`, token);
  };

  const doDelete = (id: string) => {
    delData(id);
  };

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);

  return (
    <Box py={3} sx={{ width: '60%', float: 'left'}}>
      <Text variant="pagetitle">All Contents</Text>
      {!loading && (
        <Box>
          <Spinner width={40} height={40} color="primary" />
        </Box>
      )}
      <Text sx={{ display: 'none' }}>{token}</Text>
      <Box mx={0} mb={3} width={1}>
        <Box
          sx={{
            border: 'solid 1px #ddd',
            paddingLeft: '0',
            borderRadius: '4px',
            backgroundColor: '#fff',
          }}>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => (
              <ItemField key={m.content.id} doDelete={doDelete} {...m} />
            ))}
        </Box>
      </Box>
      {pageMeta && (
        <ReactPaginate
          pageCount={pageMeta.page_number}
          pageRangeDisplayed={2}
          marginPagesDisplayed={6}
          onPageChange={() => console.log('x')}
          activeClassName={'active'}
        />
      )}
    </Box>
  );
};
export default ContentList;
