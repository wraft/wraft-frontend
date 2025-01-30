import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Drawer, useDrawer, Text, Box, Flex } from '@wraft/ui';
// import { useTour } from '@reactour/tour';
import { useHotkeys } from 'react-hotkeys-hook';
import { useThemeUI } from 'theme-ui';
import { Plus, X } from '@phosphor-icons/react';

import CreateDocument from 'components/DocumentCreate';
import DefaultMenuItem from 'common/MenuItem';

import Header from './Header';
import Menulist from './Menulist';

export interface INav {
  showFull: boolean;
}

const Sidebar = (props: any) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const router = useRouter();
  const mobileMenuDrawer = useDrawer();

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
      <Flex direction="column" h="100vh" maxHeight="100%" justify="stretch">
        <Header />
        <Flex flex={1} direction="column">
          {/* <SearchBlock /> */}

          {Menulist.map((m, i) => (
            <Box key={i} mb="lg">
              <Text
                as="h6"
                variant="sm"
                p="md"
                textTransform="uppercase"
                fontWeight="heading">
                {m.section}
              </Text>
              {m.menus.map(({ name, icon, path }: any) => (
                <DefaultMenuItem
                  href={path}
                  key={name}
                  variant="layout.menuWrapper">
                  <Flex alignItems="center" gap="8px">
                    <Flex>
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
            </Box>
          ))}
        </Flex>

        <Box mt="auto" className="first-step" mb="xxl" px="md">
          <Button variant="primary" fullWidth={true} onClick={toggleSearch}>
            <Plus size={14} /> New Document
          </Button>
        </Box>
      </Flex>
      <Drawer
        open={showSearch}
        store={mobileMenuDrawer}
        aria-label="Menu backdrop"
        withBackdrop={true}
        onClose={() => setShowSearch(false)}>
        {showSearch && (
          <>
            <Drawer.Header>
              <Drawer.Title>Create New Document</Drawer.Title>
              <X
                size={20}
                weight="bold"
                cursor="pointer"
                onClick={() => setShowSearch(false)}
              />
            </Drawer.Header>

            <CreateDocument />
          </>
        )}
      </Drawer>
    </>
  );
};

export default Sidebar;
