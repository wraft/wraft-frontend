import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Drawer, useDrawer, Text, Box, Flex } from '@wraft/ui';
// import { useTour } from '@reactour/tour';
import { useHotkeys } from 'react-hotkeys-hook';
import { useThemeUI } from 'theme-ui';
import { Lightning, Plus } from '@phosphor-icons/react';

import CreateDocument from 'components/DocumentCreate';
import DefaultMenuItem from 'common/MenuItem';
import { useAuth } from 'contexts/AuthContext';
import { checkSubRoutePermission } from 'utils/permissions';

import SearchBlock from './SearchBlock';
import Header from './Header';
import { Menulist } from './Menulist';
import UserSettingsMenu from './UserSettingsMenu';

export interface INav {
  showFull: boolean;
}

const Sidebar = (props: any) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const router = useRouter();
  const mobileMenuDrawer = useDrawer();
  const { permissions } = useAuth();

  const mainMenuList = permissions
    ? checkSubRoutePermission(Menulist, permissions)
    : Menulist;

  const {
    theme: { rawColors },
  } = useThemeUI();

  const showFull = props && props.showFull ? true : true;
  const pathname: string = router.pathname as any;

  const checkActive = (currentPath: string, path: any) => {
    if (currentPath === '/documents/[id]' && path.path === '/contents') {
      return true;
    }

    return (
      router.pathname === path ||
      (router.pathname.startsWith(path) && path !== '/')
    );
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  useHotkeys('/', () => {
    toggleSearch();
  });

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
        direction="column"
        h="100vh"
        maxHeight="100%"
        justify="stretch"
        borderRight="solid 1px"
        borderColor="border"
        bg="background-primary">
        <Header />
        <Flex flex={1} direction="column">
          <SearchBlock />

          <Box id="sidebars" px="lg" pt="sm">
            {mainMenuList.map((m: any, i: any) => (
              <Box key={i} mb="lg" borderRadius="md">
                <Text
                  as="h6"
                  variant="sm"
                  display="none"
                  opacity="0.5"
                  p="md"
                  textTransform="uppercase"
                  fontWeight="heading">
                  {m.section}
                </Text>
                <Box id="menus">
                  {m.menus.map(({ name, icon, path }: any) => (
                    <DefaultMenuItem
                      href={path}
                      key={name}
                      variant="layout.menuWrapper">
                      <Flex alignItems="center" gap="8px">
                        <Flex opacity="0.8">
                          {React.cloneElement(icon, {
                            color: checkActive(pathname, path)
                              ? rawColors?.green?.[900]
                              : rawColors?.gray?.[900],
                          })}
                          {/* {icon} */}
                        </Flex>
                        {showFull && (
                          <Text
                            color={
                              checkActive(pathname, path)
                                ? rawColors?.green?.[1200]
                                : rawColors?.gray?.[1200]
                            }
                            fontWeight="500"
                            fontSize="base"
                            lineHeight="heading"
                            letterSpacing="-0.25px">
                            {name}
                          </Text>
                        )}
                      </Flex>
                    </DefaultMenuItem>
                  ))}
                  <Box
                    mx="xs"
                    borderBottom="solid 1px"
                    borderColor="gray.a300"
                    pb="sm"></Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Flex>

        <Box mt="auto" className="first-step">
          <Flex
            alignItems="center"
            mb="lg"
            // p="md"
            display="none"
            border="1px solid"
            borderColor="gray.600"
            gap="sm"
            justify="center"
            py="6px"
            mx="1rem"
            borderRadius="md">
            <Lightning size={18} color="#127D5D" />
            <Text textAlign="center" fontSize="sm2" fontWeight="bold">
              Upgrade Plan
            </Text>
          </Flex>
          <Box py="lg" px="lg">
            <Button
              variant="secondary"
              // borderRadius="lg"
              fullWidth={true}
              onClick={toggleSearch}>
              <Plus size={14} /> New Document
            </Button>
          </Box>
          <Flex px="sm" py="lg" borderTop="solid 1px" borderColor="gray.400">
            <UserSettingsMenu compact={false} />
          </Flex>
        </Box>
      </Flex>
      <Drawer
        open={showSearch}
        store={mobileMenuDrawer}
        aria-label="Menu backdrop"
        withBackdrop={true}
        onClose={() => setShowSearch(false)}>
        <CreateDocument setIsOpen={setShowSearch} />
      </Drawer>
    </>
  );
};

export default Sidebar;
