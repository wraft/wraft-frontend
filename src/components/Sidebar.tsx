import React, { useState } from 'react';
import { Box, Flex, Text, Button, Input, Image } from 'theme-ui';
import { useHotkeys } from 'react-hotkeys-hook';
import { Bell, Search } from '@styled-icons/boxicons-regular';
import Modal from './Modal';
import Blok from './Blok';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useMenuState, Menu, MenuItem, MenuButton } from 'reakit/Menu';

import { useRouter } from 'next/router';

import DefaultMenuItem from '../../src/components/MenuItem';
import Link from '../../src/components/NavLink';
import { BrandLogo } from '../../src/components/Icons';

// import Modal from 'react-modal';

import {
  Note,
  Like,
  Cabinet as BookOpen,
  Carousel,
  Cog,
  UserVoice,
  Wrench,
  Text as TextIcon,
} from '@styled-icons/boxicons-regular';

import ModeToggle from './ModeToggle';

const listMenu = [
  {
    section: 'content',
    menus: [
      {
        name: 'Documents',
        logo: <Note width={20} />,
        path: '/contents',
      },
      {
        name: 'Approvals',
        logo: <Like width={20} />,
        path: '/approvals',
      },
    ],
  },
  {
    section: 'structure',
    menus: [
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
        name: 'Blocks',
        logo: <TextIcon width={20} />,
        path: '/blocks',
      },
      {
        name: 'Vendors',
        logo: <UserVoice width={20} />,
        path: '/vendors',
      },
      {
        name: 'Manage',
        logo: <Wrench width={20} />,
        path: '/manage',
      },
      {
        name: 'Settings',
        logo: <Cog width={20} />,
        path: '/account',
      },
    ],
  },

  // {
  //   name: 'Frames',
  //   logo: <Layout width={20} />,
  //   path: '/layouts',
  // },

  // {
  //   name: 'Forms',
  //   logo: <Water width={20} />,
  //   path: '/forms',
  // },
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
];

export interface INav {
  showFull: boolean;
}

const Nav = (props: any) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const userLogout = useStoreActions((actions: any) => actions.auth.logout);
  const token = useStoreState((state) => state.auth.token);
  const profile = useStoreState((state) => state.profile.profile);
  const menu = useMenuState();

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

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const closeSearch = () => {
    setShowSearch(false);
  };

  useHotkeys('/', () => {
    toggleSearch();
  });

  return (
    <>
      <Flex
        sx={{
          flexDirection: 'column',
          maxHeight: '100%',
          justifyContent: 'space-between',
        }}>
        <Flex
          sx={{
            py: 3,
            px: 3,
            borderBottom: 'solid 1px',
            borderColor: 'neutral.1',
            mb: 3,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Box>
            <Link href="/">
              <Flex color="primary" sx={{ fill: 'text' }}>
                <BrandLogo width="5rem" height="2rem" />
              </Flex>
            </Link>
          </Box>
          <Flex>
            <Flex sx={{ ':hover': { bg: 'gray.1' } }}>
              <Box as="span" sx={{ mt: 2 }}></Box>

              <Box
                variant="button"
                sx={{ mt: 1, pt: 1, px: 3, svg: { fill: 'gray.6' } }}>
                <Link href="/activities">
                  <Bell width="20px" />
                </Link>
              </Box>
            </Flex>

            {token && token !== '' && (
              <Flex ml={1}>
                {profile && (
                  <Flex
                    sx={{
                      alignContent: 'top',
                      verticalAlign: 'top',
                      mt: 2,
                    }}>
                    <Box>
                      <MenuButton as={Box} {...menu}>
                        <Image
                          sx={{ borderRadius: '3rem' }}
                          width="30px"
                          // src={API_HOST + '/' + profile?.profile_pic}
                          src={`https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg`} // image
                        />
                      </MenuButton>
                      <Menu
                        as={Box}
                        // sx={{ border: 'solid 1px #eee' }}
                        {...menu}
                        sx={{ border: 'solid 1px #eee', minWidth: '20ch' }}
                        aria-label="Preferences">
                        <MenuItem
                          as={Box}
                          sx={{
                            p: 3,
                            py: 2,
                            bg: 'gray.0',
                            borderBottom: 'solid 1px #eee',
                            '&:hover': {
                              bg: 'gray.1',
                            },
                          }}
                          {...menu}>
                          <Box>
                            <Text as="h4">{profile?.name}</Text>

                            {profile?.roles?.size > 0 && (
                              <Text
                                as="p"
                                sx={{ fontSize: 0, color: 'gray.6' }}>
                                {profile?.roles[0]?.name}
                              </Text>
                            )}
                          </Box>
                        </MenuItem>
                        <MenuItem
                          as={Box}
                          sx={{
                            p: 3,
                            py: 2,
                            bg: 'gray.0',
                            borderBottom: 'solid 1px',
                            '&:hover': {
                              bg: 'gray.1',
                            },
                          }}
                          {...menu}>
                          Settings
                        </MenuItem>
                        <MenuItem
                          as={Box}
                          sx={{
                            p: 3,
                            py: 2,
                            bg: 'gray.0',
                            borderBottom: 'solid 1px red',
                            '&:hover': {
                              bg: 'gray.1',
                            },
                          }}
                          {...menu}>
                          Profile
                        </MenuItem>
                        <MenuItem
                          as={Box}
                          onClick={userLogout}
                          {...menu}
                          sx={{ p: 3, bg: 'gray.0', borderBottom: 0 }}>
                          Signout
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Flex>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
        <Box sx={{ flex: 1 }}>
          <Flex
            sx={{
              // position: 'relative',
              // height: '40px',
              pt: 1,
              pb: 1,
              border: 'solid 1px',
              borderColor: 'neutral.1',
              borderRadius: '4px',
              mx: 3,
              alignItems: 'center',
              bg: 'dimGray',
              my: 1,
              mb: 3,
              input: {
                border: 'none',
                outline: 'none',
                '::placeholder': {
                  color: 'gray.4',
                },
              },
            }}>
            <Box
              sx={{
                // position: 'absolute',
                pl: 2,
                left: 1,
                top: 0,
                bottom: 0,
                svg: {
                  fill: 'gray.0',
                  pr: 2,
                },
              }}>
              <Search width={26} />
            </Box>
            <Input
              variant="small"
              placeholder="Search for docs"
              sx={{
                borderRadius: 0,
                width: '130% !important',
                fontSize: 2,
                pl: 2,
                color: 'gray.4',
              }}
            />
          </Flex>
          {listMenu.map((m, i) => (
            <Box key={i} sx={{ mb: 4 }}>
              <Box
                sx={{
                  textTransform: 'uppercase',
                  fontSize: '9.6px',
                  fontWeight: '500',
                  px: 3,
                  mb: '12px',
                  color: 'gray.1',
                }}>
                {m.section}
              </Box>
              {m.menus.map((menu) => (
                <DefaultMenuItem
                  href={menu.path}
                  key={menu.path}
                  variant="layout.menuWrapper">
                  <Flex
                    variant={
                      checkActive(pathname, m)
                        ? 'layout.menuLinkActive'
                        : 'layout.menuLink'
                    }>
                    <Box
                      sx={{
                        mr: 2,
                        color: checkActive(pathname, m) ? 'teal.2' : 'gray.3',
                      }}>
                      {menu.logo}
                    </Box>
                    {showFull && (
                      <Text
                        sx={{
                          color: 'gray.8',
                          fontWeight: checkActive(pathname, m) ? 600 : 500,
                          fontSize: 3,
                        }}>
                        {menu.name}
                      </Text>
                    )}
                  </Flex>
                </DefaultMenuItem>
              ))}
            </Box>
          ))}
        </Box>

        <Box>
          <Box
            pl={3}
            pb={3}
            pt={3}
            sx={{
              mb: 3,
            }}>
            <ModeToggle variant="button" />
          </Box>
          <Box
            sx={{
              pl: 3,
              pr: 3,
              mb: 2,
              pb: 3,
            }}>
            <Button onClick={() => toggleSearch()} sx={{ width: '100%' }}>
              New Document
            </Button>
          </Box>
        </Box>
      </Flex>
      <Modal isOpen={showSearch} onClose={closeSearch}>
        <Blok />
      </Modal>
    </>
  );
};

export default Nav;
