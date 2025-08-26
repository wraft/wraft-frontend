import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Drawer, useDrawer, Text, Box, Flex, Button } from '@wraft/ui';
// import { useTour } from '@reactour/tour';
import { useHotkeys } from 'react-hotkeys-hook';
import { useThemeUI } from 'theme-ui';
import { Lightning } from '@phosphor-icons/react';

import CreateDocument from 'components/DocumentCreate';
import DefaultMenuItem from 'common/MenuItem';
import { useAuth } from 'contexts/AuthContext';
import { checkSubRoutePermission } from 'utils/permissions';

import SearchBlock from './SearchBlock';
import Header from './Header';
import { Menulist } from './Menulist';
import UserSettingsMenu from './UserSettingsMenu';

const Divider = () => (
  <Box
    className="line"
    borderTop="solid 1px"
    borderColor="gray.300"
    maxHeight="1px"
    ml="sm"
    mr="sm"
    mt="sm"
  />
);

export interface INav {
  showFull: boolean;
}

const Sidebar = (props: any) => {
  const [isDocumentCreatorOpen, setIsDocumentCreatorOpen] =
    useState<boolean>(false);
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

  const toggleCreateDocument = () => {
    setIsDocumentCreatorOpen(!isDocumentCreatorOpen);
  };

  useHotkeys('/', () => {
    toggleCreateDocument();
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
        <Header toggleCreateDocument={toggleCreateDocument} />
        <Flex flex={1} direction="column">
          <SearchBlock />

          <Box id="sidebars" px="md" pt="lg">
            {mainMenuList.map((m: any, i: any) => (
              <Box key={i} mb="md" borderRadius="md" className="menu-group">
                <Text
                  as="span"
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
                        </Flex>
                        {showFull && (
                          <Text
                            color={
                              checkActive(pathname, path)
                                ? rawColors?.green?.[1200]
                                : rawColors?.gray?.[1200]
                            }
                            as="span"
                            fontWeight="500"
                            fontSize="base"
                            lineHeight={1}
                            letterSpacing="-0.25px">
                            {name}
                          </Text>
                        )}
                      </Flex>
                    </DefaultMenuItem>
                  ))}
                  <Divider />
                </Box>
              </Box>
            ))}
          </Box>
        </Flex>

        <Box mt="auto" className="first-step">
          <Box py="md" mx="lg" my="sm" display="none">
            <Button variant="secondary">
              <Lightning size={18} color="#127D5D" />
              <Text textAlign="center" fontSize="sm2" fontWeight="bold">
                Upgrade Plan
              </Text>
            </Button>
          </Box>

          <Box
            px="lg"
            py="lg"
            // borderTop="solid 1px"
            // borderColor="gray.400"
            alignItems="center">
            <UserSettingsMenu compact={false} />
          </Box>
        </Box>
      </Flex>
      <Drawer
        open={isDocumentCreatorOpen}
        store={mobileMenuDrawer}
        aria-label="Menu backdrop"
        withBackdrop={true}
        onClose={() => setIsDocumentCreatorOpen(false)}>
        <CreateDocument setIsOpen={setIsDocumentCreatorOpen} />
      </Drawer>
    </>
  );
};

export default Sidebar;
