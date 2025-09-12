import React from 'react';
import { Box, Text } from '@wraft/ui';
import { Commit } from 'prosekit/extensions/commit';
import styled from '@emotion/styled';

import { ProseKitDiffViewer } from './editorDiff';

export { ProseKitDiffViewer } from './editorDiff';

const StyledDiffContainer = styled(Box)`
  min-height: 200px;
  max-height: 600px;
  width: 100%;
  overflow-y: auto;
  font-size: 0.875rem;
  line-height: 1.6;

  /* Table styling for diff viewer */
  .ProseMirror table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;
  }

  .ProseMirror table td,
  .ProseMirror table th {
    border: 1px solid #d1d5db;
    box-sizing: border-box;
    min-width: 1em;
    padding: 8px;
    position: relative;
    vertical-align: top;
  }

  .ProseMirror table th {
    background-color: #f9fafb;
    font-weight: 600;
  }

  .ProseMirror .tableWrapper {
    margin: 1em 0;
    overflow-x: auto;
  }

  .ProseMirror table .selectedCell:after {
    background: rgba(200, 200, 255, 0.4);
    content: '';
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }

  /* Diff-specific styling */
  .ProseMirror .commit-addition {
    background-color: #dcfce7;
    border-left: 3px solid #16a34a;
  }

  .ProseMirror .commit-deletion {
    background-color: #fef2f2;
    border-left: 3px solid #dc2626;
    text-decoration: line-through;
  }

  /* Table cells in diff context */
  .ProseMirror table .commit-addition td,
  .ProseMirror table .commit-addition th {
    background-color: #dcfce7;
    border-color: #16a34a;
  }

  .ProseMirror table .commit-deletion td,
  .ProseMirror table .commit-deletion th {
    background-color: #fef2f2;
    border-color: #dc2626;
    text-decoration: line-through;
  }

  /* Ensure table structure is always visible */
  .ProseMirror table td:empty::before,
  .ProseMirror table th:empty::before {
    content: ' ';
    display: inline-block;
    width: 1px;
    height: 1px;
  }

  /* Make sure borders are visible even with commit styling */
  .ProseMirror .commit-insertion table,
  .ProseMirror .commit-deletion table {
    border-collapse: separate !important;
    border-spacing: 0;
  }

  .ProseMirror .commit-insertion table td,
  .ProseMirror .commit-insertion table th,
  .ProseMirror .commit-deletion table td,
  .ProseMirror .commit-deletion table th {
    border: 1px solid #d1d5db !important;
  }

  /* Force table visibility in diff context */
  .ProseMirror table {
    display: table !important;
  }

  .ProseMirror table tr {
    display: table-row !important;
  }

  .ProseMirror table td,
  .ProseMirror table th {
    display: table-cell !important;
    border-style: solid !important;
    border-width: 1px !important;
  }
`;

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

export const createCommitFromDiffData = (diffData: DiffResponse): Commit => {
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

const DiffContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <StyledDiffContainer bg="background-primary" p="lg">
    {children}
  </StyledDiffContainer>
);

export const DiffViewer: React.FC<DiffViewerProps> = ({ diffData }) => {
  if (!diffData || Object.keys(diffData).length === 0) {
    return (
      <DiffContainer>
        <Text color="text-secondary">No comparison data available</Text>
      </DiffContainer>
    );
  }

  try {
    const commit = createCommitFromDiffData(diffData);
    return (
      <DiffContainer>
        <ProseKitDiffViewer commit={commit} />
      </DiffContainer>
    );
  } catch (error) {
    console.error('Error creating ProseKit commit:', error);

    const fallbackContent =
      diffData.target_version?.serialized?.body ||
      diffData.base_version?.serialized?.body ||
      'No content available';

    return (
      <DiffContainer>
        <Text color="text-secondary">
          Error displaying diff. Showing raw content instead.
        </Text>
        <Box mt="md" p="sm" bg="gray.50" borderRadius="sm">
          <Text fontSize="xs" color="text-secondary">
            {fallbackContent}
          </Text>
        </Box>
      </DiffContainer>
    );
  }
};
