import React from 'react';
import { Box, Text } from '@wraft/ui';
import { ProseKitDiffViewer } from '@wraft/editor';

interface SerializedData {
  serialized: string;
  body: string;
  fields: string;
  title: string;
}

interface DiffResponse {
  base_version: {
    id: string;
    serialized: SerializedData;
  };
  target_version: {
    id: string;
    serialized: SerializedData;
  };
}

interface DiffViewerProps {
  diffData: DiffResponse | null;
}

// Utility functions
export const transformHolderNodesToText = (doc: any): any => {
  if (!doc?.content) return doc;

  const transformNode = (node: any): any => {
    if (node.type === 'holder') {
      return {
        type: 'text',
        text: node.attrs?.named || '',
      };
    }

    return node.content
      ? { ...node, content: node.content.map(transformNode) }
      : node;
  };

  return {
    ...doc,
    content: doc.content.map(transformNode),
  };
};

export const calculateDocumentLength = (doc: any): number => {
  if (!doc?.content) return 0;

  let length = 0;
  const calculateLength = (node: any) => {
    if (node.text) {
      length += node.text.length;
    } else if (node.content) {
      node.content.forEach(calculateLength);
    }
    length += 1;
  };

  doc.content.forEach(calculateLength);
  return length;
};

export const createCommitFromDiffData = (diffData: DiffResponse): any => {
  const { base_version, target_version } = diffData;

  if (!base_version || !target_version) {
    throw new Error('Invalid diff data structure');
  }

  const oldDoc = JSON.parse(base_version.serialized.serialized);
  const newDoc = JSON.parse(target_version.serialized.serialized);

  const transformedOldDoc = transformHolderNodesToText(oldDoc);
  const transformedNewDoc = transformHolderNodesToText(newDoc);

  return {
    doc: transformedNewDoc,
    parent: transformedOldDoc,
    steps: [
      {
        stepType: 'replace',
        from: 0,
        to: calculateDocumentLength(transformedOldDoc),
        slice: {
          content: transformedNewDoc.content || [],
        },
      },
    ],
  };
};

export const DiffViewer: React.FC<DiffViewerProps> = ({ diffData }) => {
  if (!diffData || Object.keys(diffData).length === 0) {
    return <Text color="text-secondary">No comparison data available</Text>;
  }

  try {
    const commit = createCommitFromDiffData(diffData);
    return <ProseKitDiffViewer commit={commit} />;
  } catch (error) {
    console.error('Error creating ProseKit commit:', error);

    const fallbackContent =
      diffData.target_version?.serialized?.body ||
      diffData.base_version?.serialized?.body ||
      'No content available';

    return (
      <>
        <Text color="text-secondary">
          Error displaying diff. Showing raw content instead.
        </Text>
        <Box mt="md" p="sm" bg="gray.50" borderRadius="sm">
          <Text fontSize="xs" color="text-secondary">
            {fallbackContent}
          </Text>
        </Box>
      </>
    );
  }
};
