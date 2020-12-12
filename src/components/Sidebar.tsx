import React from 'react';
import { Box, Flex, Text } from 'theme-ui';

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

// const Sidebar = styled(Box)`
//   border-bottom: solid 1px #eee;
//   padding-bottom: 8px;
//   padding-top: 12px;
//   padding-left: 8px;
//   a {
//     text-decoration: none;
//     color: #000;
//     font-weight: bold;
//     padding-left: 8px;
//   }

//   a:hover {
//     text-decoration: none;
//     color: #092682;
//     font-weight: bold;
//     padding-left: 8px;
//   }
// `;

const listMenu = [
  {
    name: 'Documents',
    logo: <Note width={20} />,
    path: '/contents',
  },
  {
    name: 'Variants',
    logo: <BookOpen width={20} />,
    path: '/content-types',
  },  
  {
    name: 'Templates',
    logo: <Carousel width={20} />,
    path: '/templates',
  },
  {
    name: 'Frames',
    logo: <Layout width={20} />,
    path: '/layouts',
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
  const sidebarW = props && props.showFull ? '90px' : '16%';
  const router = useRouter();
  const pathname: string = router.pathname as any;

  return (
    <Box sx={{ width: sidebarW, borderRight: 'solid 1px', borderColor: 'gray.1' }}>
      <Box
        pl={3}
        pb={3}
        pt={3}
        sx={{ mb: 3, borderBottom: 'solid 1px', borderColor: 'gray.1' }}>
        <Logo />
      </Box>
      <Box
        sx={{
          pr: 3,
          pl: 2,
        }}>
        {listMenu.map(m => (
          <MenuItem href={m.path} key={m.path}>
            <Box>
              {pathname === m.path && (
                <MenuWrapper>
                  <IconStyleWrapper>{m.logo}</IconStyleWrapper>
                  {showFull && <Text variant="menulink">{m.name}</Text>}
                </MenuWrapper>
              )}

              {pathname != m.path && (
                <MenuWrapperInactive>
                  <IconStyleWrapper>{m.logo}</IconStyleWrapper>
                  {showFull && <Text variant="menulink">{m.name}</Text>}
                </MenuWrapperInactive>
              )}
            </Box>
          </MenuItem>
        ))}
      </Box>
    </Box>
  );
};

export default Nav;
