import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavLink from 'next/link';
import { Button, DropdownMenu, Box, Flex, Text, Modal } from '@wraft/ui';
import toast from 'react-hot-toast';
import { CaretDown, Gear, Plus } from '@phosphor-icons/react';
import { useNotificationSidebarMode } from 'hooks/useNotificationSidebarMode';

import NotificationDropdown from 'components/Notification/NotificationDropdown';
import DefaultAvatar from 'common/DefaultAvatar';
import { IconFrame } from 'common/Atoms';
import { useAuth } from 'contexts/AuthContext';
import { postAPI } from 'utils/models';

import WorkspaceCreate from '../manage/WorkspaceCreate';

const Header = ({
  toggleCreateDocument,
}: {
  toggleCreateDocument: () => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [createdId, setCreatedId] = useState<string>();
  const { clearNotificationSidebarMode } = useNotificationSidebarMode();

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
      <Flex justify="space-between" align="center">
        <Box py="md" px="" pr="none" minWidth="75%">
          <DropdownMenu.Provider>
            <DropdownMenu.Trigger>
              <Flex cursor="pointer" pl="lg">
                {userProfile?.currentOrganisation && (
                  <Flex alignItems="center" gap="sm">
                    <Box mr="xxs">
                      <DefaultAvatar
                        url={userProfile?.currentOrganisation?.logo}
                        value={userProfile?.currentOrganisation?.name}
                        size={21}
                      />
                    </Box>

                    <Flex color="gray.900" gap="xs" alignItems="center">
                      <Text
                        fontWeight="bold"
                        color="text-primary"
                        fontSize="sm2"
                        lines={1}>
                        {userProfile?.currentOrganisation?.name}
                      </Text>
                      <CaretDown size={12} />
                    </Flex>
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
                    <Flex align="center">
                      <DefaultAvatar
                        url={userProfile?.currentOrganisation?.logo}
                        value={userProfile?.currentOrganisation?.name}
                        size={24}
                      />
                      <Box ml="sm">
                        <Text fontWeight="bold" color="text-primary" lines={1}>
                          {userProfile?.currentOrganisation?.name}
                        </Text>
                        <Text fontSize="sm" color="text-secondary">
                          {userProfile?.currentOrganisation?.members_count}{' '}
                          members
                        </Text>
                      </Box>
                    </Flex>
                    <NavLink href={`/manage/workspace`}>
                      <Gear
                        size={18}
                        weight="bold"
                        color="#777"
                        onClick={clearNotificationSidebarMode}
                      />
                    </NavLink>
                  </>
                )}
              </Flex>

              <DropdownMenu.Separator />
              <Box overflowY="auto" maxHeight="400px">
                {organisations &&
                  organisations
                    .filter(
                      (org: any) => org.id !== userProfile.organisation_id,
                    )
                    .map((org: any) => (
                      <DropdownMenu.Item
                        key={org.id}
                        onClick={() => onSwitchOrganization(org?.id)}>
                        <Flex gap="sm" align="center">
                          <DefaultAvatar
                            url={org?.logo}
                            value={org.name}
                            size={20}
                          />
                          <Text ml={2} lines={1}>
                            {org.name}
                          </Text>
                        </Flex>
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
        <Flex mr="sm" gap="xs" align="center">
          <NotificationDropdown />
          <Button
            className="x"
            shape="circle"
            variant="ghost"
            size="xs"
            onClick={toggleCreateDocument}>
            <IconFrame color="icon">
              <Plus size={14} />
            </IconFrame>
          </Button>
        </Flex>
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
