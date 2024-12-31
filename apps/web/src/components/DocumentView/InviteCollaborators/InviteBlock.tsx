import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box } from 'theme-ui';
import toast from 'react-hot-toast';
import { Button, InputText, Select } from '@wraft/ui';

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
        <S.Title>Invite Member</S.Title>
        <S.Subtitle>Invite and manage your team members.</S.Subtitle>
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
            <S.MemberInfo>
              <div>
                <S.MemberName href="#">{collaborator.user.name}</S.MemberName>
                <S.MemberEmail>{collaborator.user.email}</S.MemberEmail>
                <S.MemberEmail>{collaborator.status}</S.MemberEmail>
              </div>
            </S.MemberInfo>
            <div style={{ position: 'relative' }}>
              <S.MoreButton onClick={() => removeCollaborator(collaborator.id)}>
                <div>Remove</div>
              </S.MoreButton>
            </div>
          </S.MemberItem>
        ))}
      </S.MemberList>
    </S.Container>
  );
}
