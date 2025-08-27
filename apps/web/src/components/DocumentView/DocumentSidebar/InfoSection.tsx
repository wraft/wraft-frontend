import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import { DownloadSimple } from '@phosphor-icons/react';

import NavLink from 'common/NavLink';
import { TimeAgo } from 'common/Atoms';
import UserCard from 'common/UserCard';
import { mapPlaceholdersToFields, updateVars } from 'utils/index';
import { IFieldType } from 'utils/types/content';
import { ContentState } from 'utils/types';

import { useDocument } from '../DocumentContext';
import PlaceholderBlock from './PlaceholderBlock';
import InviteFlowStateMember from '../InviteFlowStateMember';
import { usePermissions } from '../usePermissions';
import MetaBlock from './MetaBlock';

export const InfoSection = () => {
  const [fieldMaps, setFieldMap] = useState<Array<IFieldType>>();

  const {
    contents,
    nextState,
    isEditable,
    isMakeCompete,
    editorRef,
    editorMode,
    fields,
    fieldValues,
    selectedTemplate,
    additionalCollaborator,
    userType,
    docRole,
    setFieldTokens,
    setContentBody,
  } = useDocument();

  const { canAccess } = usePermissions(userType, docRole);

  useEffect(() => {
    if (fields) {
      setFieldMap(fields);
    }
  }, [fields]);

  const handleSaved = (placeholders: any) => {
    const tokens = mapPlaceholdersToFields(placeholders);

    if (tokens?.length > 0) {
      setFieldTokens(tokens);
    }

    if (contents?.content?.serialized?.serialized) {
      const serializedData = editorRef.current?.helpers?.getJSON();
      processContentUpdates(serializedData, tokens);
    }

    if (editorMode === 'new') {
      processContentUpdates(selectedTemplate, tokens);
    }
  };

  const processContentUpdates = (data: any, tokens: any) => {
    if (data?.data) {
      let serializedContent = '';

      if (data?.serialized?.type === 'doc') {
        serializedContent = data?.serialized;
      } else {
        const res = JSON.parse(data?.serialized?.data);
        serializedContent = res;
      }

      applyContentUpdates(serializedContent, tokens);
    }

    if (data?.serialized?.data && tokens) {
      const content: ContentState = JSON.parse(data.serialized.data);
      applyContentUpdates(content, tokens);
    }

    if (data?.type === 'doc') {
      const content: ContentState = data;
      applyContentUpdates(content, tokens);
    }
  };

  const applyContentUpdates = async (contentData: any, mappings: any) => {
    const updatedContent = await updateVars(contentData, mappings);
    if (editorMode === 'new') {
      setContentBody(updatedContent);
      return;
    }
    editorRef.current?.helpers?.updateState(updatedContent);
  };

  return (
    <Box px="md" py="md">
      {editorMode !== 'new' && (
        <>
          <Box mb="lg">
            <Text fontWeight="500" mb="xs" color="text-secondary">
              Creator
            </Text>
            <UserCard
              name={contents?.creator?.name}
              profilePic={contents?.profile_pic}
              size="sm"
            />
          </Box>

          {contents?.state?.id && (
            <Box mt="md">
              {additionalCollaborator.length > 0 && (
                <Text mb="xs" fontWeight="500" color="text-secondary">
                  Flow Members
                </Text>
              )}
              <Flex direction="column" gap="sm" mb="md">
                {additionalCollaborator &&
                  additionalCollaborator.map((approver: any) => (
                    <UserCard
                      key={approver.id}
                      name={approver.name}
                      profilePic={approver.profile_pic}
                      size="sm"
                    />
                  ))}
              </Flex>
              {canAccess('flow') && <InviteFlowStateMember />}
            </Box>
          )}

          {contents?.state?.id && (
            <Box mt="md">
              {contents &&
                !nextState?.is_user_eligible &&
                !isMakeCompete &&
                !isEditable && (
                  <>
                    <Text as="h3">Waiting for approval</Text>
                    {nextState &&
                      nextState.approvers &&
                      nextState.approvers.map((approver: any) => (
                        <UserCard
                          key={approver.id}
                          name={approver.name}
                          profilePic={approver.profile_pic}
                        />
                      ))}
                  </>
                )}
            </Box>
          )}
        </>
      )}

      {contents?.content?.build && (
        <Box mt="lg">
          <Text fontWeight="500" color="text-secondary">
            Document
          </Text>

          <Flex
            mt="xs"
            borderRadius="md"
            justify="space-between"
            border="1px solid"
            p="md"
            borderColor="border">
            <Box>
              <Text>{`${contents.content.instance_id} v${contents.versions[0]?.version_number ?? ''}`}</Text>

              {contents.versions.length && (
                <Text fontSize="xs">
                  <TimeAgo time={contents?.versions[0]?.updated_at} />
                </Text>
              )}
            </Box>
            <Box>
              <NavLink href={`${contents.content.build}`} target="_blank">
                <DownloadSimple width={16} className="main-icon" />
              </NavLink>
            </Box>
          </Flex>
        </Box>
      )}

      <PlaceholderBlock
        fields={fieldMaps}
        fieldValues={fieldValues}
        onSaved={handleSaved}
      />

      <MetaBlock />
    </Box>
  );
};
