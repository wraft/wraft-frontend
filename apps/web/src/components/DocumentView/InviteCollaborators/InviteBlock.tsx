import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button, InputText, Select, Text, Box, Flex } from '@wraft/ui';

import { postAPI, fetchAPI, patchAPI } from 'utils/models';

import * as S from './styles';

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

export default function InviteBlock({ docId }: any) {
  const [collaborators, setCollaborators] = useState<any>([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getCollaborators();
  }, []);

  const handleInvite = (data: any) => {
    postAPI(`contents/${docId}/invite`, {
      ...data,
      role: 'suggestor',
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
    <S.Container>
      <S.Header>
        <Text fontSize="2xl" fontWeight="heading" mb="sm">
          Invite Member
        </Text>
        <Text color="text-secondary">Invite and manage your team members.</Text>
      </S.Header>

      <Box as="form" onSubmit={handleSubmit(handleInvite)}>
        <S.InputContainer>
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
        </S.InputContainer>
      </Box>

      <S.MemberList>
        {collaborators.map((collaborator: Collaborator) => (
          <S.MemberItem key={collaborator.id}>
            <Flex gap="sm">
              <Text>{collaborator.user.name}</Text>
              <Text color="text-secondary">{collaborator.user.email}</Text>
              <Text>{collaborator.status}</Text>
            </Flex>

            <Button
              variant="ghost"
              onClick={() => removeCollaborator(collaborator.id)}>
              Remove
            </Button>
          </S.MemberItem>
        ))}
      </S.MemberList>
    </S.Container>
  );
}
