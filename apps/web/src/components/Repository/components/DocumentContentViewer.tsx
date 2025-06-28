import React, { useEffect, useState, useRef } from 'react';
import { Box, Text, Flex } from '@wraft/ui';
import { Skeleton } from '@wraft/ui';
import axios from 'axios';

import Editor from 'common/Editor';

interface CleanedContentResponse {
  message: string;
  status: string;
  cleaned_content: string;
}

interface CleanedContentViewerProps {
  fileId: string;
}

const CleanedContentViewer: React.FC<CleanedContentViewerProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<any>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const fetchCleanedContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get<CleanedContentResponse>(
          `http://localhost:4000/api/v1/repository_assets/test_format`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );

        if (response.data.status === 'success') {
          // Convert the cleaned content to ProseMirror JSON format
          const content = {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: response.data.cleaned_content,
                  },
                ],
              },
            ],
          };
          setEditorContent(content);
        } else {
          setError('Failed to load content');
        }
      } catch (err) {
        setError('Failed to load content. Please try again later.');
        console.error('Error fetching cleaned content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCleanedContent();
  }, []); // Removed fileId dependency since we're using a fixed endpoint

  if (isLoading) {
    return (
      <Box as="div" p="lg">
        <Flex direction="column" gap="md">
          <Skeleton height="24px" width="60%" />
          <Skeleton height="200px" />
          <Skeleton height="24px" width="80%" />
          <Skeleton height="24px" width="70%" />
          <Skeleton height="24px" width="75%" />
        </Flex>
      </Box>
    );
  }

  if (error) {
    return (
      <Box as="div" p="lg" textAlign="center">
        <Text color="error">{error}</Text>
      </Box>
    );
  }

  return (
    <Box as="div" p="lg">
      <Editor
        ref={editorRef}
        // defaultMode="view"
        defaultContent={editorContent}
        isReadonly={true}
      />
    </Box>
  );
};

export default CleanedContentViewer;
