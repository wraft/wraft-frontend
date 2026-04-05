import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Text, Box, Flex } from '@wraft/ui';
import { useHotkeys } from 'react-hotkeys-hook';
import { useThemeUI } from 'theme-ui';
import { CaretRight, List, SidebarSimple, X } from '@phosphor-icons/react';

import QuickActionBar from 'components/QuickActionBar';
import DefaultMenuItem from 'common/MenuItem';
import { useAuth } from 'contexts/AuthContext';
import { useSidebar } from 'contexts/SidebarContext';
import { checkSubRoutePermission } from 'utils/permissions';

import SearchBlock from './SearchBlock';
import Header from './Header';
import { Menulist } from './Menulist';
import type { MenuItem as MenuItemType, MenuChild } from './Menulist';
import UserSettingsMenu from './UserSettingsMenu';

// ─── Divider ────────────────────────────────────────────────
const Divider = () => (
  <Box borderTop="solid 1px" borderColor="border" mx="sm" mt="xs" mb="xs" />
);

// ─── Tooltip for collapsed mode ─────────────────────────────
const IconTooltip = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0 });

  useEffect(() => {
    if (show && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.top + rect.height / 2 - 14 });
    }
  }, [show]);

  return (
    <Box
      ref={ref}
      position="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <Box
          position="fixed"
          left="60px"
          top={`${pos.top}px`}
          bg="gray.1100"
          color="white"
          px="sm"
          py="xs"
          borderRadius="sm"
          fontSize="xs"
          fontWeight="500"
          whiteSpace="nowrap"
          zIndex={9999}
          pointerEvents="none"
          sx={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
          {label}
        </Box>
      )}
    </Box>
  );
};

// ─── Collapsible menu item ──────────────────────────────────
interface CollapsibleMenuItemProps {
  item: MenuItemType;
  collapsed: boolean;
  rawColors: any;
  checkActive: (currentPath: string, path: string) => boolean;
  pathname: string;
}

const CollapsibleMenuItem = ({
  item,
  collapsed,
  rawColors,
  checkActive,
  pathname,
}: CollapsibleMenuItemProps) => {
  const isChildActive = item.children?.some(
    (child) =>
      checkActive(pathname, child.path) || pathname.startsWith(child.path),
  );
  const [isOpen, setIsOpen] = useState(isChildActive || false);

  const parentRow = (
    <Flex
      alignItems="center"
      justifyContent={collapsed ? 'center' : 'flex-start'}
      gap="8px"
      px="sm"
      py="xs"
      borderRadius="sm"
      cursor="pointer"
      onClick={() => setIsOpen(!isOpen)}
      sx={{
        '&:hover': { bg: 'green.200' },
        transition: 'background 120ms ease',
      }}
      {...(item.tourId ? { 'data-tour': item.tourId } : {})}>
      <Flex opacity="0.8" flexShrink={0}>
        {React.cloneElement(item.icon, {
          color: isChildActive
            ? rawColors?.green?.[900]
            : rawColors?.gray?.[900],
        })}
      </Flex>
      {!collapsed && (
        <>
          <Text
            color={
              isChildActive ? rawColors?.green?.[1200] : rawColors?.gray?.[1200]
            }
            as="span"
            fontWeight="500"
            fontSize="base"
            lineHeight={1}
            letterSpacing="-0.25px"
            flex={1}>
            {item.name}
          </Text>
          <Flex
            as="span"
            align="center"
            sx={{
              transition: 'transform 150ms ease',
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}>
            <CaretRight
              size={12}
              color={rawColors?.gray?.[800]}
              weight="bold"
            />
          </Flex>
        </>
      )}
    </Flex>
  );

  return (
    <Box>
      {collapsed ? (
        <IconTooltip label={item.name}>{parentRow}</IconTooltip>
      ) : (
        parentRow
      )}

      {isOpen && !collapsed && (
        <Box
          mt="2px"
          ml="12px"
          pl="10px"
          borderLeft="1px solid"
          borderColor="border">
          {item.children?.map((child: MenuChild) => (
            <DefaultMenuItem
              href={child.path}
              key={child.name}
              variant="menuWrapper"
              {...(child.tourId ? { 'data-tour': child.tourId } : {})}>
              <Flex alignItems="center" gap="8px" py="1px">
                <Flex opacity="0.7" flexShrink={0}>
                  {React.cloneElement(child.icon, {
                    size: 14,
                    color: checkActive(pathname, child.path)
                      ? rawColors?.green?.[900]
                      : rawColors?.gray?.[800],
                  })}
                </Flex>
                <Text
                  color={
                    checkActive(pathname, child.path)
                      ? rawColors?.green?.[1200]
                      : rawColors?.gray?.[1100]
                  }
                  as="span"
                  fontWeight={checkActive(pathname, child.path) ? '500' : '400'}
                  fontSize="sm2"
                  lineHeight={1}
                  letterSpacing="-0.2px">
                  {child.name}
                </Text>
              </Flex>
            </DefaultMenuItem>
          ))}
        </Box>
      )}
    </Box>
  );
};

// ─── Standard menu item (leaf) ──────────────────────────────
interface StandardMenuItemProps {
  menuItem: MenuItemType;
  collapsed: boolean;
  rawColors: any;
  checkActive: (currentPath: string, path: string) => boolean;
  pathname: string;
}

const StandardMenuItem = ({
  menuItem,
  collapsed,
  rawColors,
  checkActive,
  pathname,
}: StandardMenuItemProps) => {
  const inner = (
    <DefaultMenuItem
      href={menuItem.path}
      variant="menuWrapper"
      {...(menuItem.tourId ? { 'data-tour': menuItem.tourId } : {})}>
      <Flex
        alignItems="center"
        justifyContent={collapsed ? 'center' : 'flex-start'}
        gap="8px">
        <Flex opacity="0.8" flexShrink={0}>
          {React.cloneElement(menuItem.icon, {
            color: checkActive(pathname, menuItem.path)
              ? rawColors?.green?.[900]
              : rawColors?.gray?.[900],
          })}
        </Flex>
        {!collapsed && (
          <Text
            color={
              checkActive(pathname, menuItem.path)
                ? rawColors?.green?.[1200]
                : rawColors?.gray?.[1200]
            }
            as="span"
            fontWeight="500"
            fontSize="base"
            lineHeight={1}
            letterSpacing="-0.25px">
            {menuItem.name}
          </Text>
        )}
      </Flex>
    </DefaultMenuItem>
  );

  if (collapsed) {
    return <IconTooltip label={menuItem.name}>{inner}</IconTooltip>;
  }
  return inner;
};

// ─── Menu content (shared between sidebar and mobile drawer) ─
interface MenuContentProps {
  collapsed: boolean;
  rawColors: any;
  pathname: string;
  mainMenuList: any[];
  checkActive: (currentPath: string, path: string) => boolean;
}

const MenuContent = ({
  collapsed,
  rawColors,
  pathname,
  mainMenuList,
  checkActive,
}: MenuContentProps) => (
  <Box id="sidebars" px={collapsed ? 'xs' : 'md'} pt="md">
    {mainMenuList.map((m: any, i: number) => (
      <Box key={i} mb="sm" borderRadius="md" className="menu-group">
        <Box id="menus">
          {m.menus.map((menuItem: MenuItemType) =>
            menuItem.children ? (
              <CollapsibleMenuItem
                key={menuItem.name}
                item={menuItem}
                collapsed={collapsed}
                rawColors={rawColors}
                checkActive={checkActive}
                pathname={pathname}
              />
            ) : (
              <StandardMenuItem
                key={menuItem.name}
                menuItem={menuItem}
                collapsed={collapsed}
                rawColors={rawColors}
                checkActive={checkActive}
                pathname={pathname}
              />
            ),
          )}
          <Divider />
        </Box>
      </Box>
    ))}
  </Box>
);

// ─── Sidebar ────────────────────────────────────────────────
const Sidebar = () => {
  const [isActionBarOpen, setIsActionBarOpen] = useState(false);
  const router = useRouter();
  const { permissions } = useAuth();
  const { mode, mobileOpen, isCollapsed, toggle, closeMobile } = useSidebar();

  const mainMenuList = permissions
    ? checkSubRoutePermission(Menulist, permissions)
    : Menulist;

  const {
    theme: { rawColors },
  } = useThemeUI();

  const pathname: string = router.pathname;

  const checkActive = (_currentPath: string, path: any) => {
    if (router.pathname === '/documents/[id]' && path === '/contents') {
      return true;
    }
    return (
      router.pathname === path ||
      (router.pathname.startsWith(path) && path !== '/')
    );
  };

  const toggleActionBar = () => {
    setIsActionBarOpen((prev) => !prev);
  };

  useHotkeys('/', () => toggleActionBar());

  const collapsed = isCollapsed && mode !== 'hidden';

  // ─── Mobile: hamburger bar + drawer ───────────────────────
  if (mode === 'hidden') {
    return (
      <>
        {/* Fixed top bar with hamburger */}
        <Flex
          position="fixed"
          top={0}
          left={0}
          right={0}
          h="48px"
          bg="background-primary"
          borderBottom="solid 1px"
          borderColor="border"
          alignItems="center"
          px="md"
          zIndex={1000}
          justify="space-between">
          <Flex
            as="button"
            align="center"
            justify="center"
            onClick={toggle}
            cursor="pointer"
            p="xs"
            borderRadius="sm"
            border="none"
            bg="transparent"
            sx={{ '&:hover': { bg: 'neutral.100' } }}>
            <List size={20} color={rawColors?.gray?.[1000]} />
          </Flex>
          <UserSettingsMenu compact={true} size="xs" />
        </Flex>

        {/* Drawer overlay */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <Box
              position="fixed"
              inset={0}
              bg="rgba(0,0,0,0.3)"
              zIndex={1100}
              onClick={closeMobile}
              sx={{
                animation: 'fadeIn 150ms ease',
                '@keyframes fadeIn': {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            />
            {/* Drawer panel */}
            <Flex
              direction="column"
              position="fixed"
              top={0}
              left={0}
              bottom={0}
              w="280px"
              bg="background-primary"
              zIndex={1200}
              sx={{
                animation: 'slideIn 200ms ease',
                '@keyframes slideIn': {
                  from: { transform: 'translateX(-100%)' },
                  to: { transform: 'translateX(0)' },
                },
              }}>
              <Flex
                justify="space-between"
                align="center"
                px="md"
                py="sm"
                borderBottom="1px solid"
                borderColor="border">
                <Header toggleActionBar={toggleActionBar} />
                <Flex
                  as="button"
                  align="center"
                  justify="center"
                  onClick={closeMobile}
                  cursor="pointer"
                  p="xs"
                  borderRadius="sm"
                  border="none"
                  bg="transparent"
                  flexShrink={0}
                  sx={{ '&:hover': { bg: 'neutral.100' } }}>
                  <X size={18} color={rawColors?.gray?.[900]} />
                </Flex>
              </Flex>

              <Box px="sm" py="xs">
                <SearchBlock />
              </Box>

              <Flex flex={1} direction="column" overflow="auto">
                <MenuContent
                  collapsed={false}
                  rawColors={rawColors}
                  pathname={pathname}
                  mainMenuList={mainMenuList}
                  checkActive={checkActive}
                />
              </Flex>

              <Box px="lg" py="md" borderTop="solid 1px" borderColor="border">
                <UserSettingsMenu compact={false} />
              </Box>
            </Flex>
          </>
        )}

        {/* Quick Action Bar */}
        <QuickActionBar
          isOpen={isActionBarOpen}
          onClose={() => setIsActionBarOpen(false)}
        />
      </>
    );
  }

  // ─── Desktop / Tablet: sidebar rail ───────────────────────
  return (
    <>
      <Flex
        direction="column"
        h="100vh"
        maxHeight="100%"
        justify="stretch"
        borderRight="solid 1px"
        borderColor="border"
        bg="background-primary"
        w={collapsed ? '56px' : '245px'}
        minWidth={collapsed ? '56px' : '245px'}
        sx={{
          transition: 'width 200ms ease, min-width 200ms ease',
          overflowX: 'hidden',
        }}>
        {/* Header area */}
        {collapsed ? (
          <Flex justify="center" py="md">
            <Flex
              as="button"
              align="center"
              justify="center"
              onClick={toggle}
              cursor="pointer"
              p="xs"
              borderRadius="sm"
              border="none"
              bg="transparent"
              sx={{ '&:hover': { bg: 'neutral.100' } }}>
              <SidebarSimple size={18} color={rawColors?.gray?.[900]} />
            </Flex>
          </Flex>
        ) : (
          <Flex align="center">
            <Box flex={1}>
              <Header toggleActionBar={toggleActionBar} />
            </Box>
          </Flex>
        )}

        {/* Search (expanded only) */}
        <Flex flex={1} direction="column" overflow="hidden">
          {!collapsed && <SearchBlock />}

          <Box flex={1} overflow="auto">
            <MenuContent
              collapsed={collapsed}
              rawColors={rawColors}
              pathname={pathname}
              mainMenuList={mainMenuList}
              checkActive={checkActive}
            />
          </Box>
        </Flex>

        {/* Footer */}
        <Box mt="auto">
          {/* Collapse toggle (expanded mode) */}
          {!collapsed && (
            <Flex justify="flex-end" px="md" pb="xs">
              <Flex
                as="button"
                align="center"
                justify="center"
                onClick={toggle}
                cursor="pointer"
                p="xs"
                borderRadius="sm"
                border="none"
                bg="transparent"
                sx={{ '&:hover': { bg: 'neutral.100' } }}
                title="Collapse sidebar">
                <SidebarSimple size={16} color={rawColors?.gray?.[800]} />
              </Flex>
            </Flex>
          )}

          <Box
            px={collapsed ? 'xs' : 'lg'}
            py={collapsed ? 'md' : 'lg'}
            alignItems="center"
            sx={{ transition: 'padding 200ms ease' }}>
            <UserSettingsMenu
              compact={collapsed}
              size={collapsed ? 'xs' : 'sm'}
            />
          </Box>
        </Box>
      </Flex>

      <QuickActionBar
        isOpen={isActionBarOpen}
        onClose={() => setIsActionBarOpen(false)}
      />
    </>
  );
};

export default Sidebar;
