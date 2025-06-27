import React, { useEffect, useState } from 'react';
import router from 'next/router';
import { Text, Box, Skeleton, Flex } from '@wraft/ui';

import { useAuth } from 'contexts/AuthContext';
import { fetchAPI } from 'utils/models';

import { DocumentCard } from './DocumentCard';

const PendingDocumentBlock = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [contents, setContents] = useState<any>([]);

  const { userProfile } = useAuth();

  useEffect(() => {
    loadData(1);
  }, [userProfile?.organisation_id]);

  const loadData = (page: number) => {
    setLoading(true);
    const pageNo = page > 0 ? `?page=${page}&sort=inserted_at_desc` : '';
    fetchAPI(`contents${pageNo}`)
      .then((data: any) => {
        const res: any = data.contents;
        setContents(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  return (
    <Box px="lg">
      <Flex direction="column" gap="md">
        {loading ? (
          // Show skeletons while loading
          <>
            {[...Array(5)].map((_, idx) => (
              <Box key={idx} mb="md">
                <Skeleton height="32px" width="100%" />
              </Box>
            ))}
          </>
        ) : contents && contents.length > 0 ? (
          contents.map((content: any) => (
            <DocumentCard
              key={content.id}
              content={content}
              onClick={() => {
                router.push(`/documents/${content.content.id}`);
              }}
            />
          ))
        ) : (
          // Empty state
          <Box
            w="100%"
            p="xl"
            textAlign="center"
            color="text-secondary"
            borderRadius="md"
            border="1px solid"
            borderColor="border"
            bg="gray.100">
            <Text fontSize="md" fontWeight="medium">
              No documents found.
            </Text>
            <Text fontSize="sm" mt="xs">
              You have no recent documents to display.
            </Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default PendingDocumentBlock;
