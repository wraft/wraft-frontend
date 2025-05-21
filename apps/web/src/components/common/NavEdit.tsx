import React from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Text, Button } from '@wraft/ui';
import {
  ArrowLeft,
  Bell,
  DotsThree,
  DotsThreeVertical,
  Pencil,
  ThreeD,
} from '@phosphor-icons/react';
import styled, { x } from '@xstyled/emotion';

import UserSettingsMenu from 'components/Sidebar/UserSettingsMenu';
import Link from 'common/NavLink';
import { useAuth } from 'contexts/AuthContext';

import { UserSampleList } from './Atoms';
// import { Button } from 'components/DocumentView/InviteFlowStateMember/styles';

const IconFrame = styled.divBox`
  display: flex;
  svg {
    fill: gray.900;
  }
`;

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
      py="sm">
      <Flex align="center" gap="sm" pl="xs">
        <IconFrame color="gray.600">
          <ArrowLeft
            cursor="pointer"
            className="main-icon"
            onClick={goBack}
            // color="#999"
            size={16}
          />
        </IconFrame>

        {navtitle && (
          <Flex variant="navtitle" align="center" gap="sm">
            <Text as="h1" fontWeight={600}>
              {navtitle}
            </Text>
            <IconFrame color="gray.900">
              <DotsThree size={18} weight="bold" />
              {/* <DotsThreeVertical size={18} weight="bold" /> */}
            </IconFrame>

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
        <Flex position="relative" alignItems="center" cursor="pointer">
          <Flex gap="sm" alignItems="center">
            <Button variant="secondary" size="md">
              Share
            </Button>
          </Flex>
        </Flex>
        <Flex alignItems="center" gap="md">
          <IconFrame color="gray.600">
            <Bell size={20} className="main-icon" />
          </IconFrame>

          {!accessToken && (
            <Link href="/login">
              <Text>Login</Text>
            </Link>
          )}
          <UserSettingsMenu size="md" compact={true} />
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Nav;
