import React, { useEffect } from 'react';
import { Box, Flex, Text, Image } from 'theme-ui';
import cookie from 'js-cookie';

import { useStoreState, useStoreActions } from 'easy-peasy';
// import { useHotkeys } from 'react-hotkeys-hook';
// relative
import Link from './NavLink';
import { checkUser } from '../utils/models';
import { Bell, ArrowBack } from './Icons';
// import Dropdown from './common/Dropdown';

import ModeToggle from './ModeToggle';
import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';

// import { usePopper } from 'react-popper';

export interface IUser {
  name: string;
}

interface INav {
  navtitle: string;
  onToggleEdit?: any;
}

const Nav = ({ navtitle, onToggleEdit }: INav) => {
  // const [user, setUser] = useState<IUser>();
  const setToken = useStoreActions((actions: any) => actions.auth.addToken);
  const setProfile = useStoreActions(
    (actions: any) => actions.profile.updateProfile,
  );
  const userLogout = useStoreActions((actions: any) => actions.auth.logout);
  const token = useStoreState((state) => state.auth.token);
  const profile = useStoreState((state) => state.profile.profile);

  // const menu = useMenuState();

  // const [showSearch, setShowSearch] = useState<boolean>(false);

  const onProfileLoad = (data: any) => {
    setProfile(data);
  };

  useEffect(() => {
    // check if token is there
    const t = cookie.get('token') || false;
    // login to check
    if (t) {
      checkUser(t, onProfileLoad);
      setToken(t);
    }
  }, []);

  return (
    <Box
      variant="header"
      sx={{
        p: 0,
        bg: 'neutral.0',
        borderBottom: 'solid 1px',
        borderColor: 'gray.0',
        pt: 1,
        pb: 3,
      }}>
      <Flex>
        <Box
          sx={{
            flexBasis: ['auto', '100%'],
            order: -1,
          }}>
          <Box
            sx={{
              p: 0,
              pt: 1,
              pl: 3,
              borderRight: 'solid 1px',
              borderColor: 'neutral.1',
              color: 'gray.8',
            }}>
            <Flex>
              <Link href="/contents">
                <ArrowBack width={22} />
              </Link>
              {navtitle && (
                <Text
                  onClick={onToggleEdit}
                  variant="navtitle"
                  sx={{ p: 2, pt: 1, fontWeight: 'heading' }}>
                  <Text
                    as="span"
                    sx={{
                      fontSize: '10.24px',
                      textTransform: 'uppercase',
                      fontWeight: 300,
                      display: 'block',
                    }}>
                    OFFLET
                  </Text>
                  <Text sx={{ fontSize: 2, fontWeight: 500 }}>{navtitle}</Text>
                </Text>
              )}
            </Flex>
          </Box>
        </Box>

        <Box ml="auto" mr={3}>
          <Flex>
            <Flex>
              <Box variant="button" sx={{ mt: 1, pt: 2, ml: 3 }}>
                <Bell width={22} />
              </Box>
            </Flex>
            {!token && (
              <Link href="/login">
                <Text>Login</Text>
              </Link>
            )}
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
                      <MenuProvider>
                        <MenuButton as={Box} sx={{ cursor: 'pointer' }}>
                          <Image
                            sx={{ borderRadius: '3rem', bg: 'red' }}
                            width="32px"
                            height="32px"
                            src={profile?.profile_pic}
                            // src={`https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg`} // image
                          />
                        </MenuButton>
                        <Menu
                          as={Box}
                          // sx={{ border: 'solid 1px #eee' }}
                          variant="layout.menuBlockWrapper"
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
                            onClick={userLogout}
                            variant="layout.menuItem">
                            Signout
                          </MenuItem>
                        </Menu>
                      </MenuProvider>
                    </Box>
                  </Flex>
                )}
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
export default Nav;
