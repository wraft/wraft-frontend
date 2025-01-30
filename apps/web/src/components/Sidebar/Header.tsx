import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavLink from 'next/link';
import { Button, DropdownMenu, Box, Flex, Text, Modal } from '@wraft/ui';
import toast from 'react-hot-toast';
import { Gear, Plus } from '@phosphor-icons/react';

import DefaultAvatar from 'common/DefaultAvatar';
import { useAuth } from 'contexts/AuthContext';
import { postAPI } from 'utils/models';

import WorkspaceCreate from '../manage/WorkspaceCreate';
import UserSettingsMenu from './UserSettingsMenu';

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [createdId, setCreatedId] = useState<string>();

  const router = useRouter();
  const { organisations, userProfile, login } = useAuth();

  useEffect(() => {
    if (createdId) onSwitchOrganization(createdId);
  }, [createdId]);

  const onSwitchOrganization = async (id: string) => {
    postAPI('switch_organisations', {
      organisation_id: id,
    })
      .then((res: any) => {
        login(res);
        router.push('/');
      })
      .catch(() => {
        toast.error('failed Switch', {
          duration: 1000,
          position: 'top-center',
        });
      });
  };

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        borderBottom="solid 1px"
        borderColor="border"
        h="72px"
        mb={3}>
        <Box>
          <DropdownMenu.Provider>
            <DropdownMenu.Trigger>
              <Flex cursor="pointer">
                {userProfile?.currentOrganisation && (
                  <Flex>
                    <DefaultAvatar
                      url={userProfile?.currentOrganisation?.logo}
                      value={userProfile?.currentOrganisation?.name}
                      size={32}
                    />

                    <Box ml="sm">
                      <Text fontWeight="bold" color="text-primary">
                        {userProfile?.currentOrganisation?.name}
                      </Text>
                      <Text fontSize="sm" color="text-secondary">
                        {userProfile?.currentOrganisation?.members_count}{' '}
                        members
                      </Text>
                    </Box>
                  </Flex>
                )}
              </Flex>
            </DropdownMenu.Trigger>
            <DropdownMenu aria-label="Switch Workspace">
              <Flex
                color="primary"
                py="12px"
                px="8px"
                cursor="pointer"
                minWidth="200px"
                justifyContent="space-between">
                {userProfile?.currentOrganisation && (
                  <>
                    <Flex>
                      <DefaultAvatar
                        url={userProfile?.currentOrganisation?.logo}
                        value={userProfile?.currentOrganisation?.name}
                        size={28}
                      />
                      <Box ml="sm">
                        <Text fontWeight="bold" color="text-primary">
                          {userProfile?.currentOrganisation?.name}
                        </Text>
                        <Text fontSize="sm" color="text-secondary">
                          {userProfile?.currentOrganisation?.members_count}{' '}
                          members
                        </Text>
                      </Box>
                    </Flex>
                    <NavLink href={`/manage/workspace`}>
                      <Gear size={18} weight="bold" color="#777" />
                    </NavLink>
                  </>
                )}
              </Flex>

              <DropdownMenu.Separator />
              <Box overflowY="scroll" maxHeight="400px">
                {organisations &&
                  organisations
                    .filter(
                      (org: any) => org.id !== userProfile.organisation_id,
                    )
                    .map((org: any) => (
                      <DropdownMenu.Item
                        key={org.id}
                        onClick={() => onSwitchOrganization(org?.id)}>
                        <DefaultAvatar
                          url={org?.logo}
                          value={org.name}
                          size={20}
                        />
                        <Box ml={2}>{org.name}</Box>
                      </DropdownMenu.Item>
                    ))}
              </Box>
              <DropdownMenu.Separator />

              <DropdownMenu.Item>
                <Button variant="ghost" onClick={() => setIsOpen(true)}>
                  <Plus size={16} />
                  Create or join a workspace
                </Button>
              </DropdownMenu.Item>
            </DropdownMenu>
          </DropdownMenu.Provider>
        </Box>

        <UserSettingsMenu />
      </Flex>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        ariaLabel="create workspace">
        <WorkspaceCreate setOpen={setIsOpen} setCreatedId={setCreatedId} />
      </Modal>
    </>
  );
};

export default Header;
