import React, { useState } from 'react';

import { MenuProvider, Menu, MenuItem, MenuButton } from '@ariakit/react';
// import { useTour } from '@reactour/tour';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useHotkeys } from 'react-hotkeys-hook';
import { Box, Flex, Text, Button, Input, Image, useColorMode } from 'theme-ui';

import {
  Note,
  Like,
  Cabinet as BookOpen,
  Carousel,
  Cog,
  Wrench,
  TextIcon,
} from '../../src/components/Icons';
import DefaultMenuItem from '../../src/components/MenuItem';
import Link from '../components/NavLink';
import { useAuth } from '../contexts/AuthContext';
import { Organisation } from '../store/profile';
import { postAPI } from '../utils/models';

import Blok from './Blok';
import { Search } from './Icons';
import WorkspaceCreate from './manage/WorkspaceCreate';
import Modal from './Modal';
import ModalCustom from './ModalCustom';
import ModeToggle from './ModeToggle';

import Btn from '@wraft-ui/Button';

/**
 * Sidebar Static Items
 */
const listMenu = [
  {
    section: 'content',
    menus: [
      {
        name: 'Dashboard',
        logo: <Note width={20} />,
        path: '/',
      },
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
        name: 'Templates',
        logo: <Carousel width={20} height={20} />,
        path: '/templates',
      },
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

// type StepType = {
//   selector: string;
//   content: string;
// };

const Nav = (props: any) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isOpen, setIssOpen] = useState<boolean>(false);
  // const { setIsOpen, setSteps, setCurrentStep } = useTour();
  // const [rerender, setRerender] = useState<boolean>(false);

  const [mode, setMode] = useColorMode();

  const { userProfile, accessToken, login, logout } = useAuth();
  const router = useRouter();

  console.log('userProfile', userProfile);

  const showFull = props && props.showFull ? true : true;
  const pathname: string = router.pathname as any;

  const checkActive = (pathname: string, m: any) => {
    if (pathname === '/content/[id]' && m.path === '/contents') {
      return true;
    }

    return m.path === pathname;
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

  const onSwitchOrganization = async (id: string) => {
    const organRequest = postAPI('switch_organisations', {
      organisation_id: id,
    })
      .then((res: any) => {
        login(res);
        router.push('/');
      })
      .catch(() => {
        toast.error('failed Switch', {
          duration: 1000,
          position: 'top-center',
        });
      });

    toast.promise(organRequest, {
      loading: 'switching...',
      success: <b>Switched workspace!</b>,
      error: <b>Could not switch workspace.</b>,
    });
  };

  const onUserlogout = () => {
    logout();
    router.push('/login');
  };

  // const steps: StepType[] = [
  //   {
  //     selector: '.first-step',
  //     content: 'This is the first element on the page.',
  //   },
  // ];

  // React.useEffect(() => {
  //   setCurrentStep(0);
  //   if (steps) {
  //     setSteps!(steps);
  //   }
  //   setIsOpen(() => {
  //     return true;
  //   });
  //   // setSteps(steps);
  //   // setIsOpen(true);
  // }, []);

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
            py: 3,
            px: 3,
            borderBottom: 'solid 1px',
            borderColor: 'border',
            mb: 3,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Box>
            <MenuProvider>
              <MenuButton as={Box} sx={{ cursor: 'pointer' }}>
                <Flex color="primary" sx={{ fill: 'text' }}>
                  {userProfile?.currentOrganisation && (
                    <Flex>
                      <Image
                        src={userProfile?.currentOrganisation?.logo}
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
                            color: 'gray.1000',
                            lineHeight: 1,
                            fontSize: 1,
                          }}>
                          {userProfile?.currentOrganisation?.name}
                        </Text>
                        <Text as="p" sx={{ fontSize: 1, color: 'gray.400' }}>
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
                {userProfile?.organisations?.map((org: Organisation) => (
                  <MenuItem
                    key={org.id}
                    variant="layout.menuItem"
                    onClick={() => onSwitchOrganization(org?.id)}
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
                  <Button
                    variant="base"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setIssOpen(true)}>
                    Create a workspace
                  </Button>
                  <ModalCustom
                    isOpen={isOpen}
                    setOpen={setIssOpen}
                    varient="center">
                    <WorkspaceCreate
                      setOpen={setIssOpen}
                      // setRerender={setRerender}
                    />
                  </ModalCustom>
                </MenuItem>
              </Menu>
            </MenuProvider>
          </Box>
          <MenuProvider>
            {accessToken && (
              <Flex ml={1}>
                {userProfile && (
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
                          alt=""
                          width="24px"
                          height="24px"
                          src={userProfile?.profile_pic}
                        />
                      </MenuButton>
                      <Menu
                        as={Box}
                        sx={{
                          border: 'solid 1px',
                          borderColor: 'border',
                          minWidth: '20ch',
                          bg: 'neutral.100',
                          zIndex: 1000,
                        }}
                        aria-label="Preferences">
                        <MenuItem as={Box} variant="layout.menuItem">
                          <Box>
                            <Text as="h4">{userProfile?.name}</Text>

                            {userProfile?.roles?.size > 0 && (
                              <Text as="p" sx={{ fontSize: 0, color: 'text' }}>
                                {userProfile?.roles[0]?.name}
                              </Text>
                            )}
                          </Box>
                        </MenuItem>
                        <MenuItem as={Box} variant="layout.menuItem">
                          <Flex
                            onClick={() => {
                              const next = mode === 'dark' ? 'light' : 'dark';
                              setMode(next);
                            }}>
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
                        <Link href="/account" path="/account">
                          <MenuItem as={Box} variant="layout.menuItem">
                            Settings
                          </MenuItem>
                        </Link>
                        <Link href="/account/profile" path="/account/profile">
                          <MenuItem as={Box} variant="layout.menuItem">
                            Profile
                          </MenuItem>
                        </Link>
                        <MenuItem
                          as={Box}
                          variant="layout.menuItem"
                          onClick={() => onUserlogout()}>
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
              borderColor: 'border',
              borderRadius: '4px',
              mx: 3,
              alignItems: 'center',
              bg: 'neutral.100',
              // bg: 'backgroundGray',
              my: 1,
              mb: 3,
              input: {
                border: 'none',
                outline: 'none',
                '::placeholder': {
                  color: 'gray.500',
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
                  fill: 'gray.100',
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
                color: 'gray.500',
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
                  color: 'gray.200',
                }}>
                {m.section}
              </Box>
              {m.menus.map((menu) => (
                <DefaultMenuItem
                  href={menu.path}
                  key={menu.path}
                  variant="layout.menuWrapper">
                  <Flex>
                    <Flex
                      sx={{
                        mr: 2,
                        color: checkActive(pathname, m)
                          ? '#004A0F'
                          : 'gray.400',
                      }}>
                      {menu.logo}
                    </Flex>
                    {showFull && (
                      <Text
                        sx={{
                          color: 'text',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '18.8px',
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

        <Box sx={{ mt: 'auto', mb: 4 }}>
          <Box
            className="first-step"
            sx={{
              px: 3,
              py: 3,
            }}>
            {/* <Button
              variant="btnPrimary"
              onClick={() => toggleSearch()}
              sx={{ width: '100%', borderRadius: 6, py: 2 }}>
              + New Document
            </Button> */}
            <Btn variant="primary" onClick={toggleSearch}>
              + New Document
            </Btn>
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
