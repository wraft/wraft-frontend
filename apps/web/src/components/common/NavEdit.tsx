import React from 'react';
import { useRouter } from 'next/router';
import { Flex, Text } from '@wraft/ui';
import { ArrowLeft, Bell, Pencil } from '@phosphor-icons/react';

import UserSettingsMenu from 'components/Sidebar/UserSettingsMenu';
import NotificationDropdown from 'components/Notification/NotificationDropdown';
import Link from 'common/NavLink';
import { useAuth } from 'contexts/AuthContext';

export interface IUser {
  name: string;
}

interface INav {
  navtitle: string;
  onToggleEdit?: any;
  backLink?: string;
  isEdit?: boolean;
}

const Nav = ({ navtitle, onToggleEdit, isEdit = true }: INav) => {
  const router = useRouter();
  const { accessToken } = useAuth();

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <Flex
      variant="header"
      position="sticky"
      top="0"
      zIndex="1"
      alignItems="center"
      bg="background-primary"
      borderBottom="solid 1px"
      borderColor="border"
      px="sm"
      py="xs">
      <Flex align="center" gap="sm">
        <ArrowLeft
          cursor="pointer"
          className="main-icon"
          onClick={goBack}
          size={18}
        />

        {navtitle && (
          <Flex variant="navtitle" align="center" gap="sm">
            <Text as="h2" fontSize="lg" fontWeight="heading">
              {navtitle}
            </Text>

            {isEdit && (
              <Pencil
                cursor="pointer"
                className="main-icon"
                size={16}
                onClick={onToggleEdit}
              />
            )}
          </Flex>
        )}
      </Flex>

      <Flex ml="auto" alignItems="center" gap="md">
        <Flex
          borderLeft="solid 1px"
          borderColor="border"
          alignItems="center"
          gap="sm"
          pl="sm">
          <NotificationDropdown />

          {!accessToken && (
            <Link href="/login">
              <Text>Login</Text>
            </Link>
          )}
          <UserSettingsMenu size="sm" />
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Nav;
