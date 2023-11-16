import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button, Input, Image } from 'theme-ui';
import { useHotkeys } from 'react-hotkeys-hook';
import { useStoreState, useStoreActions } from 'easy-peasy';

import { MenuProvider, Menu, MenuItem, MenuButton } from '@ariakit/react';

import { useRouter } from 'next/router';

import { Bell, Search } from './Icons';
import Modal from './Modal';
import Blok from './Blok';

import DefaultMenuItem from '../../src/components/MenuItem';
import Link from '../../src/components/NavLink';
import {
  Note,
  Like,
  Cabinet as BookOpen,
  Carousel,
  Cog,
  Wrench,
  TextIcon,
} from '../../src/components/Icons';

import {
  checkUser,
  createEntity,
  loadEntity,
  switchProfile,
} from '../utils/models';
import { Organisation, OrganisationList } from '../store/profile';
import { useToasts } from 'react-toast-notifications';
import ModeToggle from './ModeToggle';

/**
 * Sidebar Static Items
 */
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

      {
        name: 'Templates',
        logo: <Carousel width={20} height={20} />,
        path: '/templates',
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
        name: 'Blocks',
        logo: <TextIcon width={20} />,
        path: '/blocks',
      },
      // {
      //   name: 'Vendors',
      //   logo: <UserVoice width={20} />,
      //   path: '/vendors',
      // },
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
];

export interface INav {
  showFull: boolean;
}

const Nav = (props: any) => {
  const { addToast } = useToasts();
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const userLogout = useStoreActions((actions: any) => actions.auth.logout);
  const token = useStoreState((state) => state.auth.token);
  const profile = useStoreState((state) => state.profile.profile);

  const [workspaces, setWorkspaces] = useState<OrganisationList>();
  const [activeSpace, setActiveSpace] = useState<Organisation>();

  const setProfile = useStoreActions(
    (actions: any) => actions.profile.updateProfile,
  );

  const setCurrentOrgName = useStoreActions(
    (actions: any) => actions.currentOrg.set,
  );

  useEffect(() => {
    setCurrentOrgName({ name: 'hai' });
  }, [profile]);

  const showFull = props && props.showFull ? true : true;
  const router = useRouter();
  const pathname: string = router.pathname as any;

  const checkActive = (pathname: string, m: any) => {
    if (pathname === '/content/[id]' && m.path === '/contents') {
      return true;
    }

    return pathname === m.path ? true : false;
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const closeSearch = () => {
    setShowSearch(false);
  };

  /**
   * Load Organizations
   */

  const loadOrgs = (token: string) => {
    loadEntity(token, `/users/organisations`, setWorkspaces);
  };

  useHotkeys('/', () => {
    toggleSearch();
  });

  const setToken = useStoreActions((actions: any) => actions.auth.addToken);
  const onSwitch = (_result: any) => {
    switchProfile(_result);
    setToken(_result.access_token);
  };

  /**
   * Swith Organization
   * POST /switch_organisations
   */

  const switchOrg = (id: string) => {
    createEntity(
      { organisation_id: id },
      `/switch_organisations`,
      token,
      onSwitch,
    );

    addToast('Workspace Switched', { appearance: 'success' });
  };

  /** Load Workspaces for the current user */
  const onProfileLoad = (data: any) => {
    setProfile(data);
  };
  useEffect(() => {
    loadOrgs(token);
    if (token) {
      checkUser(token, onProfileLoad);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const allOrgs = workspaces?.organisations;
    const currentOrg = allOrgs?.find(
      (og: Organisation) => og.id == profile?.organisation_id,
    );
    setCurrentOrgName(currentOrg?.name);

    setActiveSpace(currentOrg);
  }, [profile, workspaces]);

  return (
    <>
      <Flex
        sx={{
          flexDirection: 'column',
          maxHeight: '100%',
          height: '100vh',
          justifyContent: 'stretch',
        }}>
        <Flex
          sx={{
            py: 2,
            px: 3,
            pt: 1,
            borderBottom: 'solid 1px',
            borderColor: 'neutral.1',
            mb: 3,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Box>
            <MenuProvider>
              <MenuButton as={Box} sx={{ cursor: 'pointer' }}>
                <Flex color="primary" sx={{ fill: 'text' }}>
                  {activeSpace && (
                    <Flex sx={{ pt: 2 }}>
                      <Image
                        src={activeSpace.logo}
                        width={24}
                        height={24}
                        alt="Workspace"
                        sx={{
                          borderRadius: '99rem',
                          height: `24px`,
                          width: `24px`,
                          mr: 2,
                        }}
                      />
                      <Box>
                        <Text
                          as="p"
                          sx={{
                            fontWeight: `bold`,
                            color: 'gray.9',
                            lineHeight: 1,
                            fontSize: 1,
                          }}>
                          {activeSpace.name}
                        </Text>
                        <Text as="p" sx={{ fontSize: 1, color: 'gray.3' }}>
                          3 members
                        </Text>
                      </Box>
                    </Flex>
                  )}
                </Flex>
              </MenuButton>
              <Menu
                as={Box}
                variant="layout.menuBlockWrapper"
                aria-label="Switch Workspace">
                <MenuItem variant="layout.menuItemHeading" as={Box}>
                  Switch Workspace
                </MenuItem>
                {workspaces &&
                  workspaces.organisations.map((org: Organisation) => (
                    <MenuItem
                      key={org.id}
                      variant="layout.menuItem"
                      onClick={() => switchOrg(org?.id)}
                      as={Box}>
                      <Image
                        src={org?.logo}
                        width={24}
                        height={24}
                        alt="Workspace"
                        sx={{
                          borderRadius: '99rem',
                          height: `18px`,
                          width: `18px`,
                          mr: 2,
                        }}
                      />
                      {org.name}
                    </MenuItem>
                  ))}
                <MenuItem variant="layout.menuItemHeading" as={Box}>
                  Create or join a workspace
                </MenuItem>
              </Menu>
            </MenuProvider>
          </Box>
          <MenuProvider>
            <Flex sx={{ ':hover': { bg: 'gray.1' } }}>
              <Box
                variant="button"
                sx={{ mt: 0, pt: 0, px: 0, svg: { fill: 'gray.6' } }}>
                <Link href="/activities">
                  <Bell width={20} height={20} />
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
                      <MenuButton as={Box}>
                        <Image
                          sx={{ borderRadius: '3rem', bg: 'red' }}
                          width="24px"
                          height="24px"
                          src={profile?.profile_pic}
                        />
                      </MenuButton>
                      <Menu
                        as={Box}
                        sx={{
                          border: 'solid 1px',
                          borderColor: 'neutral.1',
                          minWidth: '20ch',
                          bg: 'neutral.0',
                        }}
                        aria-label="Preferences">
                        <MenuItem as={Box} variant="layout.menuItem">
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
                        <MenuItem as={Box} variant="layout.menuItem">
                          <Flex>
                            <Text>Theme</Text>
                            <Box
                              sx={{
                                // mb: 0,
                                ml: 'auto',
                              }}>
                              <ModeToggle
                                sx={{ pt: 0, m: 0 }}
                                variant="button"
                              />
                            </Box>
                          </Flex>
                        </MenuItem>
                        <MenuItem as={Box} variant="layout.menuItem">
                          Settings
                        </MenuItem>
                        <MenuItem as={Box} variant="layout.menuItem">
                          Profile
                        </MenuItem>
                        <MenuItem
                          as={Box}
                          variant="layout.menuItem"
                          onClick={() => userLogout()}>
                          Signout
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Flex>
                )}
              </Flex>
            )}
          </MenuProvider>
        </Flex>
        <Box as={MenuProvider} sx={{ flex: 1 }}>
          <Flex
            sx={{
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
                          fontSize: 2,
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
            sx={{
              pl: 3,
              pr: 3,
              mb: 2,
              pb: 3,
            }}>
            <Button
              variant="btnPrimary"
              onClick={() => toggleSearch()}
              sx={{ width: '100%', borderRadius: 6, py: 2 }}>
              + New Document
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
