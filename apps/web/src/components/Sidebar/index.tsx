import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Drawer, useDrawer } from '@wraft/ui';
// import { useTour } from '@reactour/tour';
import { useHotkeys } from 'react-hotkeys-hook';
import { Box, Flex, Text } from 'theme-ui';

import DefaultMenuItem from 'components/MenuItem';

import { CreateDocument } from '../Document';
import Header from './Header';
import Menulist from './Menulist';
import SearchBlock from './SearchBlock';

export interface INav {
  showFull: boolean;
}

const Sidebar = (props: any) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const router = useRouter();
  const mobileMenuDrawer = useDrawer();

  const showFull = props && props.showFull ? true : true;
  const pathname: string = router.pathname as any;

  const checkActive = (pathname: string, path: any) => {
    if (pathname === '/content/[id]' && path.path === '/contents') {
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
          <SearchBlock />

          {Menulist.map((m, i) => (
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
                          ? '#006222'
                          : '#2C3641',
                      })}
                      {/* {icon} */}
                    </Box>
                    {showFull && (
                      <Text
                        sx={{
                          color: 'text',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '18.8px',
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
              + New Document
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
        <Drawer.Title>Create New Document</Drawer.Title>
        <CreateDocument />
      </Drawer>
    </>
  );
};

export default Sidebar;
