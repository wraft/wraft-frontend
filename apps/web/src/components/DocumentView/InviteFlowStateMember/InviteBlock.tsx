import React, { useState, useEffect } from 'react';
import { Avatar } from 'theme-ui';
import toast from 'react-hot-toast';
import { Search, Box, Text, Flex, Button } from '@wraft/ui';
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react';

import { IconFrame } from 'common/Atoms';
import { postAPI, fetchAPI, deleteAPI } from 'utils/models';

import { useDocument } from '../DocumentContext';

interface User {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
  removable: boolean;
}

export default function InviteBlock({ docId, close }: any) {
  const [selectValue, setSelectValue] = useState<any>([]);
  const { cId, contents, additionalCollaborator, setAdditionalCollaborator } =
    useDocument();

  useEffect(() => {
    getCollaborators();
  }, [contents?.state?.id]);

  const getCollaborators = () => {
    fetchAPI(`states/${contents?.state?.id}/users?document_id=${cId}`)
      .then((data: { users: User[] }) => {
        if (data.users) {
          setAdditionalCollaborator(data.users);
        }
      })
      .catch(() => {});
  };

  const removeCollaborator = (id: string) => {
    deleteAPI(`states/${contents?.state?.id}/users/${id}`, {
      content_id: docId,
    })
      .then(() => {
        getCollaborators();
        setSelectValue(null);
        toast.success('Remove Collaborator successfuly', {
          duration: 1000,
          position: 'top-right',
        });
      })
      .catch(() => {
        toast.error('failed invite', {
          duration: 1000,
          position: 'top-right',
        });
      });
  };

  const onUserSelect = (user: any) => {
    setSelectValue(user);
    if (user) {
      postAPI(`states/${contents?.state?.id}/users/${user.id}`, {
        content_id: cId,
      })
        .then(() => {
          getCollaborators();
          toast.success('Member successfuly', {
            duration: 1000,
            position: 'top-right',
          });
        })
        .catch(() => {
          toast.error('failed invite', {
            duration: 1000,
            position: 'top-right',
          });
        });
    }
  };

  const searchFunction = async (text: string) => {
    try {
      const response: any = await fetchAPI(`users/search?key=${text}`);
      const usr = response.users;
      return usr;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [{ name: 'sal', dd: 'sal' }]; // Fallback data
    }
  };

  return (
    <Box w="560px" m="-xl">
      <Flex
        borderBottom="1px solid"
        borderColor="border"
        p="md"
        py="xl"
        justify="space-between">
        <Text fontSize="xl" fontWeight="heading">
          Invite To Editor Flow
        </Text>
        <IconFrame color="icon">
          <XIcon size={20} weight="bold" cursor="pointer" onClick={close} />
        </IconFrame>
      </Flex>

      <Box py="md" px="lg">
        <Text color="text-secondary" mb="sm">
          Invite and manage your team members.
        </Text>
        <Search
          itemToString={(item: any) => item && item.name}
          name="member"
          value={selectValue}
          icon={
            <Box display="contents">
              <IconFrame color="icon">
                <MagnifyingGlassIcon size={18} />
              </IconFrame>
            </Box>
          }
          onChange={onUserSelect}
          placeholder="Add Members by name"
          renderItem={(item: any) => (
            <Flex align="center">
              <Avatar
                src={item.profile_pic}
                alt="profile"
                width={18}
                height={18}
              />
              <Text as={'p'} ml={3} color="gray.900">
                {item.name}
              </Text>
            </Flex>
          )}
          search={searchFunction}
        />
      </Box>

      {additionalCollaborator.length > 0 && (
        <Box px="md" mb="md" mt="md">
          <Text fontSize="md" fontWeight="500" color="text-secondary" mb="xs">
            Flow Members
          </Text>
          {additionalCollaborator.map((collaborator: User, i: any) => (
            <Flex py="sm" key={i} justify="space-between">
              <Text>{collaborator.name}</Text>
              <Box>
                {collaborator.removable && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => removeCollaborator(collaborator.id)}>
                    <Text>Remove</Text>
                  </Button>
                )}
              </Box>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
}
