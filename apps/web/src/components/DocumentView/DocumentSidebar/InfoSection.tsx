import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import { DownloadSimple } from '@phosphor-icons/react';

import NavLink from 'common/NavLink';
import { TimeAgo } from 'common/Atoms';
import { AvatarCard } from 'common/AvatarCard';
import { updateVars, convertToVariableName } from 'utils/index';
import { IFieldField, IFieldType } from 'utils/types/content';
import { ContentState } from 'utils/types';

import { useDocument } from '../DocumentContext';
import PlaceholderBlock from './PlaceholderBlock';
import InviteFlowStateMember from '../InviteFlowStateMember';
import { usePermissions } from '../usePermissions';
import MetaBlock from './MetaBlock';

export const InfoSection = () => {
  const [fieldMaps, setFieldMap] = useState<Array<IFieldType>>();
  const [parsedFieldValues, setParsedFieldValues] = useState<
    Record<string, any>
  >({});

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
    setFieldValues,
  } = useDocument();

  const { canAccess } = usePermissions(userType, docRole);

  useEffect(() => {
    if (fields) {
      setFieldMap(fields);
    }
  }, [fields]);

  const handleSaved = (placeholders: any) => {
    const tokens = mapPlaceholdersToFields(placeholders);

    const newFieldValues = placeholders.reduce((acc: any, field: any) => {
      acc[convertToVariableName(field.name)] = field.value;
      return acc;
    }, {});

    if (tokens?.length > 0) {
      setFieldTokens(tokens);
    }

    setFieldValues(newFieldValues);

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

  const effectiveFieldValues =
    fieldValues && Object.keys(fieldValues).length > 0
      ? fieldValues
      : parsedFieldValues;

  useEffect(() => {
    if (contents?.content?.serialized?.fields) {
      try {
        const parsedFields = JSON.parse(contents.content.serialized.fields);
        setParsedFieldValues(parsedFields);

        // If we don't have fieldValues set yet, set them from parsed fields
        if (!fieldValues || Object.keys(fieldValues).length === 0) {
          setFieldValues(parsedFields);
        }
      } catch (error) {
        console.error('Error parsing field values:', error);
      }
    }
  }, [contents, fieldValues, setFieldValues]);

  return (
    <Box px="md" py="md">
      {editorMode !== 'new' && (
        <>
          <Box>
            <Text as="h3" mb="xs">
              Creator
            </Text>
            <AvatarCard
              time={contents?.content?.inserted_at}
              name={contents?.creator?.name}
              image={contents?.profile_pic}
            />
          </Box>

          {contents?.state?.id && (
            <Box mt="md">
              {additionalCollaborator.length > 0 && (
                <Text as="h3" mb="xs">
                  Flow Members
                </Text>
              )}
              {additionalCollaborator &&
                additionalCollaborator.map((approver: any) => (
                  <AvatarCard
                    key={approver.id}
                    // time={contents.content?.inserted_at}
                    name={approver.name}
                    image={approver.profile_pic}
                  />
                ))}

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

      {contents?.content?.build && (
        <Box mt="xl">
          <Text as="h3">Document</Text>

          <Flex mt="xs" pb={3} justify="space-between">
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
        fieldValues={effectiveFieldValues}
        onSaved={handleSaved}
      />

      <MetaBlock />
    </Box>
  );
};
