// components/diff-viewer.tsx
import React from 'react';
import { Box, Text } from '@wraft/ui';
import { Commit } from 'prosekit/extensions/commit';

import { ProseKitDiffViewer } from './editorDiff';

interface DiffViewerProps {
  version: any;
}

const createDocumentFromText = (text: string) => {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: text ? [{ type: 'text', text }] : [],
      },
    ],
  };
};

const createCommitFromVersions = (oldText: string, newText: string): Commit => {
  const oldDoc = createDocumentFromText(oldText);
  const newDoc = createDocumentFromText(newText);

  return {
    doc: newDoc,
    parent: oldDoc,
    steps: [
      {
        stepType: 'replace',
        from: 1,
        to: 1 + (oldText?.length || 0),
        slice: {
          content: newText ? [{ type: 'text', text: newText }] : [],
        },
      },
    ],
  };
};

export const DiffViewer: React.FC<DiffViewerProps> = ({ version }) => {
  if (version.hasChanges && version.previousVersionRaw) {
    try {
      const commit = createCommitFromVersions(
        version.previousVersionRaw,
        version.raw || '',
      );

      return (
        <Box
          minHeight="200px"
          maxHeight="600px"
          w="100%"
          overflowY="auto"
          bg="background-primary"
          p="lg">
          <ProseKitDiffViewer commit={commit} />
        </Box>
      );
    } catch (error) {
      console.error('Error creating ProseKit commit:', error);
      return (
        <Box
          minHeight="200px"
          maxHeight="600px"
          w="100%"
          overflowY="auto"
          bg="background-primary"
          p="lg"
          fontSize="sm"
          lineHeight="1.6">
          <Text color="text-secondary">
            {version.raw || 'No content available'}
          </Text>
        </Box>
      );
    }
  }

  return (
    <Box
      minHeight="200px"
      maxHeight="600px"
      w="100%"
      overflowY="auto"
      bg="background-primary"
      p="lg"
      fontSize="sm"
      lineHeight="1.6">
      <Text color="text-secondary">
        {version.raw || version.serialised?.body || 'No content available'}
      </Text>
    </Box>
  );
};
