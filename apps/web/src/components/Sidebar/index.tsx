import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Drawer, useDrawer } from '@wraft/ui';
// import { useTour } from '@reactour/tour';
import { useHotkeys } from 'react-hotkeys-hook';
import { Box, Flex, Text, useThemeUI } from 'theme-ui';
import { Plus, X } from '@phosphor-icons/react';

import DefaultMenuItem from 'components/MenuItem';
import CreateDocument from 'components/DocumentCreate';

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
    if (currentPath === '/content/[id]' && path.path === '/contents') {
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
        sx={{
          flexDirection: 'column',
          maxHeight: '100%',
          height: '100vh',
          justifyContent: 'stretch',
        }}>
        <Header />
        <Box sx={{ flex: 1 }}>
          {/* <SearchBlock /> */}

          {Menulist.map((m, i) => (
            <Box key={i} sx={{ mb: 4 }}>
              <Box
                sx={{
                  textTransform: 'uppercase',
                  fontSize: '9.6px',
                  fontWeight: '500',
                  px: 3,
                  mb: '12px',
                  color: 'gray.900',
                }}>
                {m.section}
              </Box>
              {m.menus.map(({ name, icon, path }: any) => (
                <DefaultMenuItem
                  href={path}
                  key={name}
                  variant="layout.menuWrapper">
                  <Flex sx={{ alignItems: 'center', gap: '8px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                      }}>
                      {React.cloneElement(icon, {
                        color: checkActive(pathname, path)
                          ? rawColors?.green?.[900]
                          : rawColors?.gray?.[900],
                      })}
                      {/* {icon} */}
                    </Box>
                    {showFull && (
                      <Text
                        sx={{
                          color: checkActive(pathname, path)
                            ? rawColors?.green?.[1200]
                            : rawColors?.gray?.[1200],
                          fontWeight: 500,
                          fontSize: 'base',
                          lineHeight: '18.8px',
                          letterSpacing: '-0.25px',
                        }}>
                        {name}
                      </Text>
                    )}
                  </Flex>
                </DefaultMenuItem>
              ))}
            </Box>
          ))}
        </Box>

        <Box mt="auto" mb="4">
          <Box className="first-step" p={3}>
            <Button variant="primary" size="full" onClick={toggleSearch}>
              <Plus size={16} /> New Document
            </Button>
          </Box>
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
