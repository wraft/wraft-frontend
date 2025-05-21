import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Text } from '@wraft/ui';
import { DownloadSimple, Signature } from '@phosphor-icons/react';

import NavLink from 'common/NavLink';
import { IconFrame, TimeAgo } from 'common/Atoms';
import { AvatarCard } from 'common/AvatarCard';
import { updateVars } from 'utils/index';
import { IFieldField, IFieldType } from 'utils/types/content';
import { ContentState } from 'utils/types';

import { useDocument } from '../DocumentContext';
import PlaceholderBlock from './PlaceholderBlock';
import InviteFlowStateMember from '../InviteFlowStateMember';
import { usePermissions } from '../usePermissions';
import MetaBlock from './MetaBlock';
import { TaskBlock } from './TaskBlock';

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

    setContentBody(updatedContent);
  };

  const mapPlaceholdersToFields = (placeholder: any): IFieldField[] => {
    return placeholder.map(({ name, value, id }: any) => ({
      name,
      value,
      named: value,
      label: name,
      id: id,
    }));
  };

  return (
    <Box px="md" py="md">
      {contents?.content?.build && (
        <Box variant="block" borderRadius="md2" mb="lg" py="sm">
          <Flex mt="xs" pb={3} justify="space-between">
            <Box>
              {contents.versions.length && (
                <Flex fontSize="sm2" fontWeight="medium" gap="md">
                  <Text>v{contents.versions[0]?.version_number ?? ''}</Text>
                  <TimeAgo
                    fontSize="sm"
                    time={contents?.versions[0]?.updated_at}
                  />
                </Flex>
              )}
            </Box>
            <Box pr="sm">
              <NavLink href={`${contents.content.build}`} target="_blank">
                <DownloadSimple width={16} className="main-icon" />
              </NavLink>
            </Box>
          </Flex>
        </Box>
      )}
      {editorMode !== 'new' && (
        <>
          <Box mb="md" display="none">
            {/* <Text as="h3" fontSize="sm2" fontWeight={500} mb="sm">
              Editors
            </Text> */}
            <Box>
              <AvatarCard
                time={contents?.content?.inserted_at}
                name={contents?.creator?.name}
                image={contents?.profile_pic}
              />
            </Box>
          </Box>

          {/* <TaskBlock /> */}

          {contents?.state?.id && (
            <Box mt="xs">
              {additionalCollaborator.length > 0 && (
                <Flex>
                  <Text as="h3" mb="xs" fontWeight={500}>
                    Collaborators
                  </Text>
                  <Box ml="auto">
                    {canAccess('flow') && <InviteFlowStateMember />}
                  </Box>
                </Flex>
              )}

              {additionalCollaborator &&
                additionalCollaborator.map((approver: any) => (
                  <Box p="sm" key={approver.id}>
                    <AvatarCard
                      key={approver.id}
                      // time={contents.content?.inserted_at}
                      name={approver.name}
                      image={approver.profile_pic}
                    />
                  </Box>
                ))}
            </Box>
          )}

          {contents?.state?.id && (
            <Box mt="sm">
              {contents &&
                !nextState?.is_user_eligible &&
                !isMakeCompete &&
                !isEditable && (
                  <>
                    <Text as="h3">Waiting Approval</Text>
                    {nextState &&
                      nextState.approvers &&
                      nextState.approvers.map((approver: any) => (
                        <AvatarCard
                          key={approver.id}
                          // time={contents.content?.inserted_at}
                          name={approver.name}
                          image={approver.profile_pic}
                        />
                      ))}
                  </>
                )}
            </Box>
          )}
        </>
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
