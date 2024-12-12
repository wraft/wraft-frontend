import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Link } from 'theme-ui';
import { DownloadSimple } from '@phosphor-icons/react';

import { TimeAgo } from 'common/Atoms';
import { AvatarCard } from 'common/AvatarCard';
import { updateVars } from 'utils/index';
import { IFieldField, IFieldType } from 'utils/types/content';
import { ContentState } from 'utils/types';

import { useDocument } from '../DocumentContext';
import PlaceholderBlock from './PlaceholderBlock';

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
    setFieldTokens,
    setContentBody,
  } = useDocument();

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
    <Box sx={{ bg: 'gray.100', mb: 6, pb: 0 }}>
      <Box variant="layout.boxHeading" sx={{ pb: 3 }}>
        <Text
          as="h3"
          variant="sectionheading"
          sx={{ mb: 0, pb: 0, color: 'gray.1000' }}>
          Editors
        </Text>
        <AvatarCard
          time={contents?.content?.inserted_at}
          name={contents?.creator?.name}
          image={contents?.profile_pic}
        />
      </Box>
      {contents &&
        !nextState?.is_user_eligible &&
        !isMakeCompete &&
        !isEditable && (
          <Box variant="layout.boxHeading" sx={{ pb: 3, borderTop: 'none' }}>
            <Text
              as="h3"
              variant="sectionheading"
              sx={{ mb: 0, pb: 0, color: 'gray.1000' }}>
              Waiting for approval
            </Text>
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
          </Box>
        )}
      <Box sx={{ pt: 2, px: 3, border: 0 }}>
        <Text
          as="h3"
          variant="sectionheading"
          sx={{ mb: 0, pb: 0, color: 'gray.1000' }}>
          Document
        </Text>
        <Box>
          {contents?.content?.build && (
            <Flex pt={0} pb={3}>
              <Box>
                <Box>
                  <Text
                    as="h3"
                    sx={{
                      fontSize: 'sm',
                      mb: 0,
                      color: 'text',
                    }}>
                    {contents.content.instance_id}
                    <Text as="span" sx={{ ml: 2, fontWeight: 400 }}>
                      v{contents.versions[0]?.version_number ?? ''}
                    </Text>
                  </Text>
                  <Text
                    as="h4"
                    sx={{
                      fontSize: '14px',
                      mb: 0,
                      pb: 0,
                      mt: 1,
                      color: 'gray.700',
                      fontWeight: 500,
                      ml: 0,
                    }}>
                    <Flex as="span">
                      {/* <Text sx={{ mr: 2 }}>Updated </Text> */}
                      {contents.versions.length && (
                        <TimeAgo time={contents?.versions[0]?.updated_at} />
                      )}
                    </Flex>
                  </Text>
                </Box>
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Link
                  // variant="download"
                  sx={{
                    bg: 'gray.000',
                    borderRadius: '6px',
                    border: 'solid 1px',
                    borderColor: 'border',
                    px: 3,
                    py: 2,
                  }}
                  href={`${contents.content.build}`}
                  target="_blank">
                  <DownloadSimple width={20} />
                </Link>
              </Box>
            </Flex>
          )}
        </Box>
      </Box>
      <PlaceholderBlock
        fields={fieldMaps}
        fieldValues={fieldValues}
        onSaved={handleSaved}
      />
    </Box>
  );
};
