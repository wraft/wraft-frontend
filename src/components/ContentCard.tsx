import React from 'react';
import { Box, Text, Flex, Badge, Avatar } from 'theme-ui';
import MenuItem from './NavLink';

import {
  BoltCircle as Check,
  InfoCircle,
} from '@styled-icons/boxicons-regular';

import { TimeAgo } from './ContentDetail';

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
  <Badge sx={{ bg: 'transparent', color: 'gray.6', p: 0, pt: 1 }}>
    <Text sx={{ fontWeight: 'body' }}>{props.type}</Text>
  </Badge>
);

const ContentCardBase = (props: IField) => {
  return (
    <Flex
      sx={{
        pl: 3,
        bg: 'gray.0',
        borderBottom: 'solid 1px',
        borderColor: 'gray.3',
        ':hover': {
          bg: 'blue.0',
        },
      }}>
      <Box
        variant="cTyeMark"
        sx={{
          borderRadius: 99,
          height: '38px',
          width: '38px',
          bg: props.content_type.color,
          mr: 2,
          mt: 3,
        }}
      />
      <Box sx={{ p: 3 }}>
        <Text sx={{ fontSize: 0, color: 'gray.6' }}>
          {props.content.instance_id}
        </Text>
        <MenuItem
          variant="rel"
          href={`/content/[id]`}
          path={`content/${props.content.id}`}>
          <Text>{props.content.serialized.title}</Text>
        </MenuItem>
      </Box>
      <Box sx={{ p: 3 }}>
        <TimeAgo time={props.content.updated_at} />
      </Box>
      <Box sx={{ p: 3 }}>
        <Avatar
          width="20px"
          src="https://wraft.x.aurut.com//uploads/avatars/1/profilepic_Richard%20Hendricks.jpg?v=63783661237"
        />
      </Box>
      <Box sx={{ ml: 'auto', p: 3 }}>
        <Text
          pt={1}
          sx={{
            pl: 1,
            color: 'green.8',
            display: 'inline-block',
            textTransform: 'uppercase',
            fontSize: '11px',
            bg: 'green.0',
            border: 'solid 1px',
            borderColor: 'green.3',
            paddingTop: 0,
            paddingRight: 1,
            paddingLeft: 1,
            borderRadius: 3,
          }}>
          {props.state.state}
        </Text>
      </Box>
    </Flex>
  );
};

const ContentCard = (props: IField) => {
  return (
    <Box key={props.content.instance_id} pb={3} pt={3}>
      <Flex sx={{ position: 'relative' }}>
        <Box variant="cTyeMark" bg={props.content_type.color} />
        <MenuItem
          variant="rel"
          href={`/content/[id]`}
          path={`content/${props.content.id}`}>
          <Text>{props.content.serialized.title}</Text>
        </MenuItem>
        <Box ml="auto" mr={3}>
          {props.state.state === 'Published' && (
            <Check width={16} color="#2b8a3e" />
          )}

          {props.state.state === 'Draft' && (
            <InfoCircle width={16} color="#5c7cfa" />
          )}
          <Text
            pt={1}
            sx={{
              pl: 1,
              color: 'gray.7',
              display: 'inline-block',
              textTransform: 'uppercase',
              fontSize: '11px',
              bg: 'green.0',
              border: 'solid 1px',
              borderColor: 'green.1',
              paddingTop: 0,
              paddingRight: 1,
              paddingLeft: 1,
              borderRadius: 1,
            }}>
            {props.state.state}
          </Text>
          <Flex>{/* props.content_type.name */}</Flex>
        </Box>
      </Flex>
      <Flex>
        <Tablet type={props.content.instance_id} pr={2} />
        <Text color="gray.6" sx={{ fontSize: '8px', pt: 2, pl: 1, pr: 1 }}>
          •
        </Text>
        <TimeAgo time={props.content.updated_at} />
      </Flex>
    </Box>
  );
};

export default ContentCardBase;
