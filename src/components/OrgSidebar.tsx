import React from 'react';
import { Box, Text } from 'theme-ui';

// import { useRouter } from 'next/router';
import styled from '@emotion/styled';

// import MenuItem from '../../src/components/MenuItem';

// import { Logo } from './Icons';

export const IconStyleWrapper = styled.div`
  color: #444;
  margin-right: 12px;
`;

// const MenuWrapper = styled(Flex)`
//   opacity: 1;
// `;
// const MenuWrapperInactive = styled(Flex)`
//   opacity: 0.7;
// `;

import {
  // Note,
  // Brush as ColorFill,
  Layout,
  // GitMerge,
  // // NetworkChart,
  // Collection,
  // Water,
  // Cabinet as BookOpen,
  // Carousel,
  // Rename as Spreadsheet,
  // Cog,
} from '@styled-icons/boxicons-regular';

import NavLink from './NavLink';

export const IconWrapper = styled(Layout)`
  color: '#999';
`;

// const OrgSidebar = styled(Box)`
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

// const listMenu = [
//   {
//     name: 'Documents',
//     logo: <Note width={20} />,
//     path: '/contents',
//   },
//   {
//     name: 'Variants',
//     logo: <BookOpen width={20} />,
//     path: '/content-types',
//   },  
//   {
//     name: 'Templates',
//     logo: <Carousel width={20} />,
//     path: '/templates',
//   },
//   {
//     name: 'Layouts',
//     logo: <Layout width={20} />,
//     path: '/layouts',
//   },
//   {
//     name: 'Blocks',
//     logo: <Water width={20} />,
//     path: '/block_templates',
//   },
//   {
//     name: 'Flows',
//     logo: <GitMerge width={20} />,
//     path: '/flows',
//   },
//   {
//     name: 'Fields',
//     logo: <Spreadsheet width={20} />,
//     path: '/fields',
//   },
//   {
//     name: 'Pipelines',
//     logo: <Collection width={20} />,
//     path: '/pipelines',
//   },
//   {
//     name: 'Themes',
//     logo: <ColorFill width={20} />,
//     path: '/themes',
//   },
//   {
//     name: 'My Account',
//     logo: <Cog width={20} />,
//     path: '/account',
//   },
// ];

export interface INav {
  showFull?: boolean;
}

const OrgSidebar = (_props: INav) => {
  return (
    <Box sx={{ width: '22%', pt: 5, pl: 3}}>
      <NavLink href={'/account'}>
        <Text sx={{ fontWeight: 'body', mb: 1 }}>My Profile</Text>
      </NavLink>
      <NavLink href={'/account/company'}>
        <Text sx={{ fontWeight: 'body', mb: 1 }}>Manage Company</Text>
      </NavLink>
      <NavLink href={'/account/permissions'}>
        <Text sx={{ fontWeight: 'body', mb: 1 }}>Permissions</Text>
      </NavLink>
      <NavLink href={'/account/members'}>
        <Text sx={{ fontWeight: 'body', mb: 1 }}>Members</Text>
      </NavLink>
      <Text sx={{ fontWeight: 'body', mb: 1 }}>Notifications</Text>
      <Text sx={{ fontWeight: 'body', mb: 1 }}>Settings</Text>
    </Box>
  );
};

export default OrgSidebar;
