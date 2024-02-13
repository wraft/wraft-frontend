import React, { FC, useEffect, useState } from 'react';

import { MenuProvider, Menu, MenuItem } from '@ariakit/react';
import { Button } from '@wraft/ui';
import NextLink from 'next/link';
import { Box, Flex, NavLink, Text } from 'theme-ui';

import { fetchAPI } from '../utils/models';

import { TimeAgo } from './Atoms';
import ContentLoader from './ContentLoader';
import { EmptyForm, DotsVerticalRounded } from './Icons';
import Link from './NavLink';
import PageHeader from './PageHeader';
import { Table } from './Table';

export interface IField {
  id: string;
  title: string;
  body: string;
  serialized: string;
}

export interface IFieldItem {
  name: string;
  type: string;
}

const BlockTemplateListFrame: FC = () => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [blocks, setBlocks] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const loadData = () => {
    fetchAPI('block_templates')
      .then((data: any) => {
        const res: IField[] = data.block_templates;
        setContents(res);
        setLoading(true);
      })
      .catch();
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (contents && contents.length > 0) {
      const row: any = [];
      contents.map((r: any) => {
        const rFormated = {
          col2: (
            <Box>
              <NextLink href={`/blocks/edit/${r.id}`}>{r?.title}</NextLink>
            </Box>
          ),
          col3: (
            <Box>
              <TimeAgo time={r.updated_at} />
            </Box>
          ),
          col4: (
            <Box as={MenuProvider} sx={{ position: 'relative', px: 3, py: 1 }}>
              {/* <Link href={`/blocks/edit/${r.id}`} variant="btnSecondary"> */}
              <Button variant="secondary">
                <DotsVerticalRounded width={16} height={16} />
              </Button>
              <Menu
                as={Box}
                aria-label="Manage Block"
                sx={{
                  border: 'solid 1px',
                  borderColor: 'border',
                  borderRadius: 4,
                  bg: 'neutral.100',
                  color: 'text',
                }}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    // onDelete(id);
                  }}>
                  Delete
                </Button>
                <MenuItem as={Box} sx={{ width: '100%', px: 3 }}>
                  <NavLink
                    href={`/manage/blocks/edit/[id]`}
                    variant="secondary">
                    <Text sx={{ fontSize: 0, fontWeight: 500 }}>Edit</Text>
                  </NavLink>
                </MenuItem>
              </Menu>
              {/* </Link> */}
            </Box>
          ),
        };

        row.push(rFormated);
      });

      setBlocks(row);
    }
  }, [contents]);

  return (
    <Box>
      <PageHeader title="Blocks" desc="Re-usable Content blocks">
        <Box sx={{ ml: 'auto' }}>
          <Link href="/blocks/new" variant="secondary">
            + New Block
          </Link>
        </Box>
      </PageHeader>
      {/* <Flex>
        <Box sx={{ ml: 'auto' }}>
          <Link
            variant="button"
            href="/block_templates/new"
            icon={<Plus width={20} />}>
            <Text>New Block</Text>
          </Link>
        </Box>
      </Flex> */}
      <Box variant="layout.pageFrame">
        <Box mx={0} mb={3}>
          {!loading && <ContentLoader />}
          {loading && blocks.length === 0 && (
            <Box>
              <Flex>
                <Box sx={{ color: 'gray.500', width: 'auto' }}>
                  <EmptyForm />
                </Box>
                <Box sx={{ m: 2, pb: 0 }}>
                  <Text as="h2" sx={{ fontWeight: 300 }}>
                    Blocks are empty
                  </Text>
                  <Text as="h3" sx={{ fontWeight: 200, color: 'gray.700' }}>
                    You havent created a block yet, click below to create one
                  </Text>
                  <Box sx={{ mt: 3, pb: 0 }}>
                    <Button>Add First Block</Button>
                  </Box>
                </Box>
              </Flex>
            </Box>
          )}
          {!blocks && <Text>You do not have any blok, click here to add</Text>}

          {loading && blocks && blocks.length > 0 && (
            <Table
              options={{
                columns: [
                  // {
                  //   Header: 'Id',
                  //   accessor: 'col1', // accessor is the "key" in the data
                  //   width: '15%',
                  // },
                  {
                    Header: 'Name',
                    accessor: 'col2',
                    width: '45%',
                  },
                  {
                    Header: 'Updated',
                    accessor: 'col3',
                    width: '30%',
                  },
                  {
                    Header: 'Action',
                    accessor: 'col4',
                    width: '10%',
                  },
                ],
                data: blocks,
              }}
            />
          )}
          {/* <Styles>
            {contents && contents.length > 0 && (
              <Table columns={columns} data={contents} />
            )}
          </Styles> */}

          {/* <Box>
            {contents &&
              contents.length > 0 &&
              contents.map((m: any) => <ItemField key={m.id} {...m} />)}
          </Box> */}
        </Box>
      </Box>
    </Box>
  );
};
export default BlockTemplateListFrame;
