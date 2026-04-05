import React, { useEffect, useState, useCallback } from 'react';
import router from 'next/router';
import { Box, Text, Skeleton, Pagination, Flex } from '@wraft/ui';

import { useAuth } from 'contexts/AuthContext';
import { fetchAPI } from 'utils/models';

import { DocumentCard } from './DocumentCard';

interface Meta {
  total_pages: number;
  total_entries: number;
  page_number: number;
}

type StatusType = 'expired' | 'upcoming';

interface UpcomingExpiryContractsProps {
  status: StatusType;
}

const UpcomingExpiryContracts: React.FC<UpcomingExpiryContractsProps> = ({
  status,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [contents, setContents] = useState<any>([]);
  const [pageMeta, setPageMeta] = useState<Meta>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { userProfile } = useAuth();

  useEffect(() => {
    loadData(currentPage);
  }, [userProfile?.organisation_id, currentPage]);

  const loadData = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const pageNo =
          page > 0
            ? `?page=${page}&sort=inserted_at_desc&page_size=9&type=contract&status=${status}`
            : '';
        const data: any = await fetchAPI(`contents${pageNo}`);
        setContents(data.contents || []);
        setPageMeta(data);
      } finally {
        setLoading(false);
      }
    },
    [status],
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <>
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
        <>
          {contents.map((content: any) => (
            <Box key={content.id} mb="md">
              <DocumentCard
                hideState={true}
                content={content}
                expiryDate={content.content.meta?.expiry_date}
                onClick={() => {
                  router.push(`/documents/${content.content.id}`);
                }}
              />
            </Box>
          ))}
        </>
      ) : null}

      {contents &&
        contents.length > 0 &&
        pageMeta &&
        pageMeta?.total_pages > 1 && (
          <Box mt="md">
            <Pagination
              totalPage={pageMeta.total_pages}
              initialPage={currentPage}
              onPageChange={handlePageChange}
              totalEntries={pageMeta.total_entries}
            />
          </Box>
        )}
    </>
  );
};

export default UpcomingExpiryContracts;
