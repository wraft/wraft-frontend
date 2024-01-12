import React, { useEffect, useState } from 'react';

import { Avatar, Box, Flex } from 'theme-ui';

import { useAuth } from '../../contexts/AuthContext';
import { fetchAPI } from '../../utils/models';
import { StateBadge, TimeAgo } from '../Atoms';
import { Table } from '../common';
import Skeleton from '../common/Skeleton';

const columns = [
  // {
  //   id: 'select',
  //   header: ({ table }: any) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }: any) => (
  //     <Checkbox
  //       // checked={row.getIsSelected()}
  //       checked
  //       onChange={() => console.log}
  //       // onChange={(value: any) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  //   size: 10,
  // },
  {
    id: 'content.id',
    header: 'Name',
    accessorKey: 'content.id',
    cell: ({ row }: any) => (
      <Flex sx={{ fontSize: '12px', ml: '-16px' }}>
        <Box
          sx={{
            width: '3px',
            bg: row.original?.content_type?.color
              ? row.original?.content_type?.color
              : 'blue',
          }}
        />
        <Box ml={3}>
          <Box>{row.original?.content?.instance_id}</Box>
          <Box>{row.original?.content?.serialized?.title}</Box>
        </Box>
        {/* <Box>{row.getValue('docName')}</Box> */}
      </Flex>
    ),
    // cell: ({ row }) => <Box>{console.log('row', row.original)}</Box>,
    // minSize: 10,
    // maxSize: 500,
    size: 300,
    enableSorting: false,
  },
  {
    id: 'content.updated_at',
    header: 'TIME',
    accessorKey: 'TIME',
    // cell: (info: any) => info.getValue(),
    cell: ({ row }: any) => (
      <Box>
        <TimeAgo time={row.original?.content.updated_at} />
      </Box>
    ),
    // minSize: 10,
    // maxSize: 500,
    size: 300,
  },
  {
    id: 'creator.profile_pic',
    header: 'EDITORS',
    accessorKey: 'creator.profile_pic',
    cell: ({ row }: any) => (
      <Box>
        <Avatar mt={2} width="20px" src={row.original?.creator?.profile_pic} />
      </Box>
    ),
    enableSorting: false,
  },
  {
    header: 'STATUS',
    accessorKey: 'age',
    cell: ({ row }: any) => (
      <Box>
        <StateBadge name={row.original?.state?.state} color="#E2F7EA" />
      </Box>
    ),
    enableSorting: false,
    textAlign: 'right',
  },
];

const PendingDocumentBlock = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [contents, setContents] = useState<any>();

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
    <>
      <Box
        sx={{
          fontSize: '12px',
          fontWeight: 700,
          mb: '18px',
          mt: '36px',
        }}>
        Pending action (3)
      </Box>
      {loading && (
        <Box
          sx={
            {
              // border: '1px solid',
              // borderColor: 'border',
              // px: 3,
              // py: 4,
            }
          }>
          <Flex sx={{ justifyContent: 'space-between' }} mb={4}>
            <Skeleton width="15%" height="25px" />
            <Skeleton width="30%" height="25px" />
            <Skeleton width="20%" height="25px" />
            <Skeleton width="15%" height="25px" />
          </Flex>
          <Flex sx={{ justifyContent: 'space-between' }} mb={2}>
            <Skeleton width="15%" height="20px" />
            <Skeleton width="30%" height="20px" />
            <Skeleton width="20%" height="20px" />
            <Skeleton width="15%" height="20px" />
          </Flex>
          <Flex sx={{ justifyContent: 'space-between' }} mb={2}>
            <Skeleton width="15%" height="20px" />
            <Skeleton width="30%" height="20px" />
            <Skeleton width="20%" height="20px" />
            <Skeleton width="15%" height="20px" />
          </Flex>
          <Flex sx={{ justifyContent: 'space-between' }} mb={2}>
            <Skeleton width="15%" height="20px" />
            <Skeleton width="30%" height="20px" />
            <Skeleton width="20%" height="20px" />
            <Skeleton width="15%" height="20px" />
          </Flex>
          <Flex sx={{ justifyContent: 'space-between' }} mb={2}>
            <Skeleton width="15%" height="20px" />
            <Skeleton width="30%" height="20px" />
            <Skeleton width="20%" height="20px" />
            <Skeleton width="15%" height="20px" />
          </Flex>
        </Box>
      )}

      {!loading && contents && <Table data={contents} columns={columns} />}
    </>
  );
};

export default PendingDocumentBlock;
