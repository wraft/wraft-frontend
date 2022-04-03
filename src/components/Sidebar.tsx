import React from 'react';
import { Box, Flex, Text } from 'theme-ui';

import { useRouter } from 'next/router';

import MenuItem from '../../src/components/MenuItem';
import Link from '../../src/components/NavLink';
import { BrandLogo } from '../../src/components/Icons';

// import Modal from 'react-modal';

import {
  Note,
  Layout,
  Water,
  Cabinet as BookOpen,
  Carousel,
  Cog,
} from '@styled-icons/boxicons-regular';
import ModeToggle from './ModeToggle';
// import ContentTypeDashboard from './ContentTypeDashboard';

// export const IconWrapper = styled(Layout)`
//   color: '#999';
// `;

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
    name: 'Approvals',
    logo: <Layout width={20} />,
    path: '/approvals',
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
  // {
  //   name: 'Frames',
  //   logo: <Layout width={20} />,
  //   path: '/layouts',
  // },

  {
    name: 'Blocks',
    logo: <Water width={20} />,
    path: '/blocks',
  },

  {
    name: 'Forms',
    logo: <Water width={20} />,
    path: '/forms',
  },
  // {
  //   name: 'Flows',
  //   logo: <GitMerge width={20} />,
  //   path: '/flows',
  // },
  // {
  //   name: 'Fields',
  //   logo: <Spreadsheet width={20} />,
  //   path: '/fields',
  // },
  // {
  //   name: 'Pipelines',
  //   logo: <Collection width={20} />,
  //   path: '/pipelines',
  // },
  // {
  //   name: 'Themes',
  //   logo: <ColorFill width={20} />,
  //   path: '/themes',
  // },
  {
    name: 'Manage',
    logo: <Cog width={20} />,
    path: '/manage',
  },
  {
    name: 'Vendors',
    logo: <Cog width={20} />,
    path: '/vendors',
  },
  {
    name: 'Settings',
    logo: <Cog width={20} />,
    path: '/account',
  },
];

export interface INav {
  showFull: boolean;
}

const Nav = (props: any) => {
  const showFull = props && props.showFull ? true : true;
  // const sidebarW = 'auto'; //props && props.showFull ? '90px' : '16%';
  const router = useRouter();
  const pathname: string = router.pathname as any;

  // const [showSearch, setShowSearch] = useState<boolean>(false);
  // popper
  // const [toggleDrop, setToggleDrop] = useState<boolean>(false);
  // const [referenceElement, setReferenceElement] = useState(null);
  // const [popperElement, setPopperElement] = useState(null);
  // const [arrowElement, setArrowElement] = useState(null);
  // const { styles, attributes } = usePopper(referenceElement, popperElement, {
  //   modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  // });

  // const toggleSearch = () => {
  //   setShowSearch(!showSearch);
  // };

  // const closeSearch = () => {
  //   setShowSearch(false);
  // };

  const checkActive = (pathname: string, m: any) => {
    if (pathname === '/content/[id]' && m.path === '/contents') {
      return true;
    }

    // console.log(pathname, m.path);
    return pathname === m.path ? true : false;
  };

  return (
    <Box>
      {/* <Modal
        isOpen={showSearch}
        onRequestClose={closeSearch}
        ariaHideApp={false}
        contentLabel="SearchWraft">
        <Flex sx={{ p: 2 }}>
          <Input placeholder="Search " sx={{ mb: 0 }} />
          <Button
            sx={{
              ml: 2,
              bg: 'gray.0',
              pl: 3,
              border: 'solid 1px',
              borderColor: 'gray.4',
              color: 'gray.7',
              pt: 0,
              pb: 0,
            }}>
            <Search width="16px" height="16px"/>
          </Button>
        </Flex>
        <Box sx={{ p: 0 }}>
          <Box p={4}>
            <ContentTypeDashboard />
          </Box>
        </Box>
      </Modal> */}
      <Box
        sx={{
          pl: 3,
          pb: 3,
          borderBottom: 'solid 1px',
          borderColor: 'gray.2',
          mb: 3,
          pt: 1,
        }}>
        <Link href="/">
          <Flex color="primary" sx={{ fill: 'text' }}>
            <BrandLogo width="5rem" height="2rem" />
          </Flex>
        </Link>
      </Box>
      {/* <Box
        sx={{
          pl: 3,
          pr: 3,
          mb: 2,
          pb: 3,
          borderBottom: 'solid 1px',
          borderColor: 'gray.2',
        }}>
        <Button onClick={toggleSearch} variant="btnMain">
          New Doc
        </Button>
      </Box> */}
      <Box>
        {listMenu.map((m) => (
          <MenuItem href={m.path} key={m.path} variant="layout.menuWrapper">
            <Flex
              variant={
                checkActive(pathname, m)
                  ? 'layout.menuLinkActive'
                  : 'layout.menuLink'
              }
              >
              <Box
                sx={{
                  mr: 2,
                  color: checkActive(pathname, m) ? 'teal.4' : 'gray.5',                  
                  // opacity: 0.6,
                }}>
                {m.logo}
              </Box>
              {showFull && <Text sx={{ fontWeight: checkActive(pathname, m) ? 600 : 500 }}>{m.name}</Text>}
            </Flex>
          </MenuItem>
        ))}
      </Box>

      <Box
        pl={3}
        pb={3}
        pt={3}
        sx={{
          mb: 3,
          borderBottom: 'solid 1px',
          bg: 'gray.0',
          borderColor: 'gray.1',
        }}>
        <ModeToggle variant="button" />
      </Box>
    </Box>
  );
};

export default Nav;
