import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Text } from '@wraft/ui';
import { DownloadSimple, Highlighter, Signature } from '@phosphor-icons/react';

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
import { TaskItem } from './TaskItem';

export const TaskBlock = () => {
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

  interface TaskItem {
    title: string;
    assignedBy?: string;
    buttonText?: string;
    icon?: React.ReactNode;
    tag?: string;
    color?: string;
  }

  const taskItems: TaskItem[] = [
    {
      title: 'Sign',
      assignedBy: 'Sarath Antony',
      buttonText: 'Sign',
      // tag: 'Pending',
      color: 'yellow',
    },
    // {
    //   title: 'AI Integrity Check',
    //   // assignedBy: 'Sarath Antony',
    //   buttonText: 'Review',
    //   // tag: 'Pending',
    //   color: 'yellow',
    // },
    // {
    //   title: 'Sign',
    //   assignedBy: 'Ronan Cole',
    //   buttonText: 'Sign',
    // },
    {
      title: 'Send Email',
      assignedBy: 'Ronan Cole',
      tag: '',
      // buttonText: 'Publish',
    },
  ];

  return (
    <Box px="xss" py="sm" pt={0}>
      <Flex
        direction="column"
        borderBottom="solid 1px"
        borderColor="gray.400"
        mb="md">
        <Text
          as="h6"
          fontWeight={600}
          color="gray.1100"
          mb="sm"
          display="flex"
          gap="sm">
          Jobs
          <Text
            as="span"
            fontSize="xs"
            color="gray.900"
            textTransform="uppercase">
            Pending
          </Text>
          <Box
            as="span"
            ml="auto"
            display="flex"
            gap="xxs"
            fontWeight={300}
            color="gray.400">
            <Text as="span" color="gray.1100">
              {taskItems.length}
            </Text>
          </Box>
        </Text>
        <Flex
          direction="column"
          mb="xl"
          flex="1"
          border="solid 1px"
          borderBottom="0"
          borderRadius="md2"
          color="gray.600"
          overflow="hidden">
          {taskItems &&
            taskItems.map((task: any) => (
              <TaskItem
                key={task.title}
                title={task.title}
                assignedBy={task.assignedBy}
                buttonText={task.buttonText}
                tag={task.tag}
              />
            ))}

          {/* <TaskItem
            title="ReviewBot"
            assignedBy="Functionary Labs"
            buttonText="Review"
          />
          <TaskItem
            title="Review Changes"
            assignedBy="Althraf Hussain"
            buttonText="Review"
          />
          <TaskItem
            title="Review Changes"
            assignedBy="Althraf Hussain"
            buttonText="Review"
            icon={<Highlighter size={16} />}
          /> */}
        </Flex>
      </Flex>
    </Box>
  );
};
