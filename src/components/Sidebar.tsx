import React from 'react';
import { Box, Flex, Text } from 'rebass';

import { useRouter } from 'next/router';
import styled from '@emotion/styled';

import MenuItem from '../../src/components/MenuItem';

import { Logo } from './Icons';

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;

const MenuWrapper = styled(Flex)`
opacity: 1;
`;
const MenuWrapperInactive = styled(Flex)`
  opacity: 0.7;
`;

import {
  Note,
  Brush as ColorFill,
  Layout,
  GitMerge,
  // NetworkChart,
  Collection,
  Water,
  Cabinet as BookOpen,
  Carousel,
  Rename as Spreadsheet,
  Cog,
} from '@styled-icons/boxicons-regular';

export const IconWrapper = styled(Layout)`
  color: '#999';
`;

const Sidebar = styled(Box)`
  border-bottom: solid 1px #eee;
  padding-bottom: 12px;
  padding-top: 12px;
  padding-left: 8px;
  a {
    text-decoration: none;
    color: #000;
    font-weight: bold;
    padding-left: 8px;
  }

  a:hover {
    text-decoration: none;
    color: #092682;
    font-weight: bold;
    padding-left: 8px;
  }
`;

const listMenu = [
  {
    name: 'Contents',
    logo: <Note width={20} />,
    path: '/contents',
  },
  {
    name: 'Content Types',
    logo: <BookOpen width={20} />,
    path: '/content-types',
  },
  {
    name: 'Layouts',
    logo: <Layout width={20} />,
    path: '/layouts',
  },
  {
    name: 'Templates',
    logo: <Carousel width={20} />,
    path: '/templates',
  },
  {
    name: 'Blocks',
    logo: <Water width={20} />,
    path: '/block_templates',
  },
  {
    name: 'Flows',
    logo: <GitMerge width={20} />,
    path: '/flows',
  },
  {
    name: 'Fields',
    logo: <Spreadsheet width={20} />,
    path: '/fields',
  },
  {
    name: 'Pipelines',
    logo: <Collection width={20} />,
    path: '/pipelines',
  },
  {
    name: 'Themes',
    logo: <ColorFill width={20} />,
    path: '/themes',
  },
  {
    name: 'My Account',
    logo: <Cog width={20} />,
    path: '/account',
  },
];

export interface INav {
  showFull: boolean;
}

const Nav = (props: INav) => {
  const showFull = props && props.showFull ? false : true;
  const sidebarW = props && props.showFull ? '90px' : 2 / 12;
  const router = useRouter();
  const pathname: string = router.pathname as any;

  return (
    <Sidebar width={sidebarW} sx={{ borderRight: 'solid 1px #eee' }}>
      <Box pl={2} pb={3} pt={2}>
        <Logo/>
      </Box>
      {listMenu.map(m => (
        <MenuItem href={m.path} key={m.path}>          
          <Box>            
            {pathname === m.path && (
              <MenuWrapper>
                <IconStyleWrapper>{m.logo}</IconStyleWrapper>
                {showFull && <Text fontSize={1} color="grays.0">{m.name}</Text>}
              </MenuWrapper>
            )}

            {pathname != m.path && (
              <MenuWrapperInactive>
                <IconStyleWrapper>{m.logo}</IconStyleWrapper>
                {showFull && <Text fontSize={1}>{m.name}</Text>}
              </MenuWrapperInactive>
            )}
          </Box>
        </MenuItem>
      ))}
    </Sidebar>
  );
};

export default Nav;
