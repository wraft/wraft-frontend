import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button, InputText, Select, Text, Box, Flex } from '@wraft/ui';
import { XIcon } from '@phosphor-icons/react';

import { IconFrame } from 'common/Atoms';
import { postAPI, fetchAPI, patchAPI } from 'utils/models';

interface User {
  id: string;
  name: string;
  email: string;
  is_guest: boolean;
  email_verify: boolean;
}

interface Collaborator {
  id: string;
  status: 'pending' | 'accepted' | 'revoked';
  user: User;
  role: 'suggestor' | 'editor' | 'viewer';
  content_id: string;
  state_id: string;
}

const ITEMS = [
  { value: 'suggestor', label: 'Suggestor' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

export default function InviteBlock({ docId, close }: any) {
  const [collaborators, setCollaborators] = useState<any>([]);

  const { handleSubmit, control } = useForm();

  useEffect(() => {
    getCollaborators();
  }, []);

  const handleInvite = (data: any) => {
    postAPI(`contents/${docId}/invite`, {
      ...data,
    })
      .then(() => {
        getCollaborators();
        toast.success('invite successfuly', {
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

  const getCollaborators = () => {
    fetchAPI(`contents/${docId}/collaborators`)
      .then((data: { collaborators: Collaborator[] }) => {
        if (data?.collaborators) {
          setCollaborators(data.collaborators);
        }
      })
      .catch(() => {});
  };

  const removeCollaborator = (id: string) => {
    patchAPI(`contents/${docId}/revoke_access/${id}`)
      .then(() => {
        getCollaborators();
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

  return (
    <Box w="42rem" m="-xl">
      <Flex
        borderBottom="1px solid"
        borderColor="border"
        p="md"
        py="xl"
        justify="space-between">
        <Text fontSize="xl" fontWeight="heading">
          Invite Members
        </Text>
        <IconFrame color="icon">
          <XIcon size={20} weight="bold" cursor="pointer" onClick={close} />
        </IconFrame>
      </Flex>

      <Box as="form" onSubmit={handleSubmit(handleInvite)} my="xl" mx="lg">
        <Text color="text-secondary" mb="sm">
          Invite your team to collaborate on this document
        </Text>
        <Flex gap="md">
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Please select a Engine ID' }}
            render={({ field }) => (
              <InputText {...field} type="text" placeholder="Name" required />
            )}
          />
          <Controller
            control={control}
            name="email"
            rules={{ required: 'Please select a Engine ID' }}
            render={({ field }) => (
              <InputText
                {...field}
                type="email"
                placeholder="Email address"
                required
              />
            )}
          />
          <Controller
            control={control}
            name="role"
            rules={{ required: 'Please select a Engine ID' }}
            render={({ field }) => (
              <Select
                {...field}
                options={ITEMS}
                placeholder="Select role"
                required
              />
            )}
          />

          <Button type="submit">Invite</Button>
        </Flex>
      </Box>

      {collaborators.length > 0 && (
        <Box px="lg" mb="md" mt="md">
          <Text fontSize="md" fontWeight="500" color="text-secondary" mb="xs">
            Members
          </Text>
          {collaborators
            .filter(
              (collaborator: any) =>
                collaborator.status === 'accepted' ||
                collaborator.status === 'pending',
            )
            .map((collaborator: Collaborator) => (
              <Flex
                py="sm"
                key={collaborator.id}
                justify="space-between"
                align="flex-start">
                <Flex gap="sm" w="100%" align="center" justify="center">
                  <Box w="45%">
                    <Text>{collaborator.user.name}</Text>
                    <Text color="text-secondary">
                      {collaborator.user.email}
                    </Text>
                  </Box>

                  <Text w="40%">{collaborator?.role}</Text>
                  <Box w="15%">
                    {collaborator.status === 'pending' && (
                      <Text color="green.800">{collaborator.status}</Text>
                    )}
                  </Box>
                </Flex>

                <Button
                  variant="ghost"
                  onClick={() => removeCollaborator(collaborator.id)}>
                  Remove
                </Button>
              </Flex>
            ))}
        </Box>
      )}
    </Box>
  );
}
