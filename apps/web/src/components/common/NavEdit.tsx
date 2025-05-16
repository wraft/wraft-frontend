import React from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Text } from '@wraft/ui';
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
        <Flex position="relative" alignItems="center" pr="sm" cursor="pointer">
          <Flex
            position="relative"
            borderRadius="full"
            overflow="hidden"
            boxShadow="sm"
            _hover={{ boxShadow: 'md' }}>
            <Box
              position="relative"
              width="32px"
              height="32px"
              bg="primary.500"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px solid"
              borderColor="background-primary"
              zIndex="3">
              {/* <img
                width={14}
                src="https://dev-cdn.poetbin.com/wraft-dev/users/4b150b8f-5c37-4bdf-b3cd-d1ee2ccea8f3/profile/profilepic_377ba31a-2a08-4cff-9b0b-1133d9aa22c6.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=wraft-dev%2F20250515%2Flocal%2Fs3%2Faws4_request&X-Amz-Date=20250515T185545Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Signature=43c7190cb107d57a9b71cc4442b9aa8d48ade43bc84536754dfba0e9d167aea7"
              /> */}
              <Text color="gray.1100" fontSize="xs" fontWeight="bold">
                L
              </Text>
            </Box>
            <x.div
              position="absolute"
              left="15px"
              width="32px"
              height="32px"
              bg="success.500"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px solid"
              borderColor="background-primary"
              zIndex="2">
              <Text color="gray.1100" fontSize="xs" fontWeight="bold">
                U
              </Text>
            </x.div>
          </Flex>
        </Flex>
        <Flex
          borderLeft="solid 1px"
          borderColor="border"
          alignItems="center"
          // color="red.400"
          pl="sm">
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
