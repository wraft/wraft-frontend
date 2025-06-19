import React, { useState, useEffect } from 'react';
import { Avatar } from 'theme-ui';
import toast from 'react-hot-toast';
import { Search, Box, Text, Flex } from '@wraft/ui';
import { MagnifyingGlass } from '@phosphor-icons/react';

import { postAPI, fetchAPI, deleteAPI } from 'utils/models';

import * as S from './styles';
import { useDocument } from '../DocumentContext';

interface User {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
  removable: boolean;
}

export default function InviteBlock({ docId }: any) {
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
    <S.Container>
      <S.Header>
        <Text fontSize="2xl" fontWeight="heading" mb="sm">
          Invite To Editor Flow
        </Text>
        <Text color="text-secondary">Invite and manage your team members.</Text>
      </S.Header>
      <Box pb="xl">
        <Search
          itemToString={(item: any) => item && item.name}
          name="member"
          value={selectValue}
          icon={
            <Box display="contents">
              <MagnifyingGlass size={18} />
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
        <Box borderTop="1px solid" borderColor="border">
          {additionalCollaborator.map((collaborator: User, i: any) => (
            <S.MemberItem key={i}>
              <S.MemberInfo>
                <div>
                  <S.MemberName>{collaborator.name}</S.MemberName>
                </div>
              </S.MemberInfo>
              <Box>
                {collaborator.removable && (
                  <S.MoreButton
                    onClick={() => removeCollaborator(collaborator.id)}>
                    <Box>Remove</Box>
                  </S.MoreButton>
                )}
              </Box>
            </S.MemberItem>
          ))}
        </Box>
      )}
    </S.Container>
  );
}
