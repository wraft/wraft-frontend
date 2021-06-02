import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Text,
  Button,
  Avatar,
  Flex,
  // Badge,
  Container,
  Spinner,
} from 'theme-ui';
import MenuItem from './NavLink';
// import ContentCard from './ContentCard';
import { Table } from './Table';

// import { useStoreState } from 'easy-peasy';
import { fetchAPI } from '../utils/models';
import { TimeAgo } from './ContentDetail';
import Paginate from './Paginate';
import PageHeader from './PageHeader';

export interface ILayout {
  width: number;
  updated_at: string;
  unit: string;
  slug: string;
  name: string;
  id: string;
  height: number;
  description: string;
}

export interface IContentType {
  name: string;
  id: string;
  description: string;
  color: string;
}

export interface IContent {
  id: string;
  updated_at: string;
  instance_id: string;
  serialized: any;
}

export interface StateClass {
  updated_at: string;
  state: string;
  order: number;
  inserted_at: string;
  id: string;
}

export interface IField {
  content: IContent;
  content_type: IContentType;
  state: StateClass;
  doDelete: any;
}

export interface IFieldItem {
  name: string;
  type: string;
}

// const Tablet = (props: any) => (
//   <Badge sx={{ bg: 'transparent', color: 'gray.6', p: 0, pt: 1 }}>
//     <Text sx={{ fontWeight: 'body' }}>{props.type}</Text>
//   </Badge>
// );

// const ContentCardB = (props: IField) => {
//   return (
//     <Box key={props.content.instance_id} pb={3} pt={3}>
//       <Flex sx={{ position: 'relative' }}>
//         <Box variant="cTyeMark" bg={props.content_type.color} />
//         <MenuItem
//           variant="rel"
//           href={`/content/[id]`}
//           path={`content/${props.content.id}`}>
//           <Text>{props.content.serialized.title}</Text>
//         </MenuItem>
//         <Box ml="auto" mr={3}>
//           {props.state.state === 'Published' && (
//             <Check width={16} color="#2b8a3e" />
//           )}

//           {props.state.state === 'Draft' && (
//             <InfoCircle width={16} color="#5c7cfa" />
//           )}
//           <Text
//             pt={1}
//             sx={{
//               pl: 1,
//               fontSize: 0,
//               color: 'gray.7',
//               display: 'inline-block',
//             }}>
//             {props.state.state}
//           </Text>
//           <Flex>{/* props.content_type.name */}</Flex>
//         </Box>
//       </Flex>
//       <Flex>
//         <Tablet type={props.content.instance_id} pr={2} />
//         <Text color="gray.6" sx={{ fontSize: '8px', pt: 2, pl: 1, pr: 1 }}>
//           •
//         </Text>
//         <TimeAgo time={props.content.updated_at} />
//       </Flex>
//     </Box>
//   );
// };

export interface IPageMeta {
  page_number: number;
  total_entries: number;
  total_pages: number;
  contents?: any;
}

interface BoxWrapProps {
  id: string;
  name: string;
  xid: string;
}

const BoxWrap: FC<BoxWrapProps> = ({ id, xid, name }) => {
  return (
    <Box sx={{ pt: 1, pb: 2 }}>
      <MenuItem variant="rel" href={`/content/[id]`} path={`content/${xid}`}>
        <Text sx={{ fontSize: 0, color: 'gray.6' }}>{id}</Text>
        <Text as="h4" p={0} sx={{ m: 0, fontWeight: 500 }}>
          {name}
        </Text>
      </MenuItem>
    </Box>
  );
};

/**
 * Content List
 * ============
 *
 * @returns
 */
const ContentList = () => {
  // const token = useStoreState((state) => state.auth.token);

  const [contents, setContents] = useState<Array<IField>>([]);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>();
  const [total, setTotal] = useState<number>(1);
  const [vendors, setVendors] = useState<Array<any>>([]);

  useEffect(() => {
    loadData(1);
  }, []);

  useEffect(() => {
    if (page) {
      loadData(page);
    }
  }, [page]);

  const loadData = (page: number) => {
    const pageNo = page > 0 ? `?page=${page}` : '';
    fetchAPI(`contents${pageNo}`)
      .then((data: any) => {
        setLoading(true);
        const res: IField[] = data.contents;
        setTotal(data.total_pages);
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setLoading(true);
      });
  };

  /** DELETE content
   * @TODO move to inner page [design]
   */
  // const delData = (id: string) => {
  //   deleteEntity(`contents/${id}`, token);
  // };

  // const doDelete = (id: string) => {
  //   delData(id);
  // };

  const changePage = (_e: any) => {
    console.log('page', _e?.selected);
    setPage(_e?.selected + 1);
  };

  useEffect(() => {
    if (contents && contents.length > 0) {
      let row: any = [];
      contents.map((r: any) => {
        const rFormated = {
          col1: (
            <Box
              sx={{
                borderRadius: 99,
                height: '32px',
                width: '32px',
                bg: r.content_type.color,
                mr: 2,
                ml: 2,
                mt: 2,
              }}
            />
          ),
          col2: (
            <BoxWrap
              id={r.content?.instance_id}
              name={r.content?.serialized?.title}
              xid={r.content?.id}
            />
          ),
          col3: (
            <Box pt={1}>
              <TimeAgo time={r.content.updated_at} />
            </Box>
          ),
          col4: (
            <Avatar
              mt={2}
              width="20px"
              src="https://wraft.x.aurut.com//uploads/avatars/1/profilepic_Richard%20Hendricks.jpg?v=63783661237"
            />
          ),
          status: (
            <Text
              pt={2}
              sx={{
                pl: 1,
                fontSize: 0,
                color: 'gray.7',
                display: 'inline-block',
                textAlign: 'right',
                width: 'auto',
                textTransform: 'uppercase',
              }}>
              {r.state.state}
            </Text>
          ),
        };

        row.push(rFormated);
      });

      setVendors(row);
    }
  }, [contents]);

  return (
    <Box sx={{ bg: 'gray.1', pl: 0, minHeight: '100%' }}>
      <PageHeader title="Documents">
        <Box sx={{ ml: 'auto', mr: 5 }}>
          <Button variant="btnPrimary">+ New Doc</Button>
        </Box>
      </PageHeader>
      {/* <HeadingFrame btn="Add Content" title="Contents"/> */}
      <Container variant="layout.pageFrame">
        <Flex>
          <Box sx={{ flexGrow: 1 }}>
            {!loading && (
              <Box>
                <Spinner width={40} height={40} color="primary" />
              </Box>
            )}
            <Box mx={0} mb={3} sx={{  }}>
              {vendors && (
                <Table
                  options={{
                    columns: [
                      {
                        Header: '',
                        accessor: 'col1', // accessor is the "key" in the data
                        width: '10%',
                      },
                      {
                        Header: 'Name',
                        accessor: 'col2',
                        width: '60%',
                      },
                      {
                        Header: 'Time',
                        accessor: 'col3',
                        width: '15%',
                      },
                      {
                        Header: 'Editors',
                        accessor: 'col4',
                        width: '15%',
                      },
                      {
                        Header: 'Status',
                        accessor: 'status',
                        width: '15%',
                      },
                    ],
                    data: vendors,
                  }}
                />
              )}
              {/* <Box
              sx={{
                border: 'solid 1px',
                borderColor: 'gray.3',
                paddingLeft: '0',
                borderRadius: 4,
                // pl: 3,
              }}>
              {contents &&
                contents.length > 0 &&
                contents.map((m: any) => (
                  <ContentCard key={m.content.id} doDelete={doDelete} {...m} />
                ))}
            </Box> */}
            </Box>
            <Paginate changePage={changePage} {...pageMeta} />
            {total}
          </Box>
          <Box variant="layout.plateSidebar">
            <Box variant="layout.plateBox">
              <Text variant="blockTitle">Filter</Text>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};
export default ContentList;
