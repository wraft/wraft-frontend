import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Link, Button, Avatar } from 'theme-ui';
import { useRouter } from 'next/router';
import styled from 'styled-components';

// import { Document, Page } from 'react-pdf';
import { Pencil, Download } from '@styled-icons/boxicons-regular';

import { useStoreState } from 'easy-peasy';
import { Spinner } from 'theme-ui';
import MenuItem from './MenuItem';
import dynamic from 'next/dynamic';

import { useTabState, Tab, TabList, TabPanel } from 'reakit/Tab';

import { File } from './Icons';
import WraftEditor from './WraftEditor';
import CommentForm from './CommentForm';

import { createEntity, loadEntity } from '../utils/models';
import { TimeAgo } from './Atoms';

import Nav from './NavEdit';

const PdfViewer = dynamic(() => import('./PdfViewer'), { ssr: false });

/**
 * Number Block
 */

const blockTypes = [
  {
    name: 'medium',
    wh: '32px',
    fontSize: 1,
  },
  {
    name: 'small',
    wh: '24px',
    fontSize: 0,
  },
];

/**
 * Steps Indication Block
 */
interface StepBlockProps {
  tab: any;
  title?: string;
  desc?: string;
  no?: number;
}

export const StepBlock = ({ no, tab, title, desc }: StepBlockProps) => {
  return (
    <Flex>
      <NumberBlock no={no} active={tab.selectedId === 'view' ? true : false} />
      <Box>
        <Text
          as="h4"
          sx={{
            fontFamily: 'body',
            fontSize: 0,
            color: tab.selectedId === 'view' ? 'teal.9' : 'gray.7',
          }}
        >
          {title}
        </Text>
        <Text
          as="h5"
          sx={{ fontFamily: 'body', fontWeight: 100, color: 'gray.5' }}
        >
          {desc}
        </Text>
      </Box>
    </Flex>
  );
};

interface NumberBlockProps {
  no?: number;
  active?: boolean;
}

const NumberBlock = ({ no, active = false }: NumberBlockProps) => {
  const activeBorder = active ? 'teal.6' : 'gray.4';
  const activeColor = active ? 'teal.1' : 'gray.6';
  const activeBg = active ? 'teal.7' : 'gray.0';

  const defaultSize = 'medium';
  const size = blockTypes.find((b: any) => b.name === defaultSize);

  return (
    <Box
      sx={{
        bg: activeBg,
        textAlign: 'center',
        mr: 3,
        verticalAlign: 'middle',
        pt: size?.fontSize,
        borderRadius: '99rem',
        border: 'solid 1px',
        borderColor: activeBorder,
        width: size?.wh,
        height: size?.wh,
      }}
    >
      <Text
        as="span"
        sx={{
          color: activeColor,
          lineHeight: 'body',
          fontSize: size?.fontSize,
        }}
      >
        {no}
      </Text>
    </Box>
  );
};

/**
 * Profile Block
 */
//  `http://localhost:4000/uploads/avatars/6c0d05d7-bf3c-4bb8-8052-7e38f9dceb18/profilepic_Merissa%20Meyer.jpg?v=63816237803`
interface ProfileCardP {
  name: string;
  time: string;
  image: string;
}

export const ProfileCard = ({ name, time, image }: ProfileCardP) => {
  return (
    <Flex
      sx={{
        fontSize: 0,
        color: 'gray.8',
        my: 2,
      }}
    >
      <Avatar
        width={22}
        sx={{ mr: 2, borderColor: 'gray.1', border: 'solid 1px' }}
        src={image}
      />
      <Text as="h3" sx={{ mr: 3, fontSize: '14.4px', fontWeight: 600 }}>
        {name}
      </Text>
      <TimeAgo time={time} ago={true} />
    </Flex>
  );
};

const PreTag = styled(Box)`
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word;
`;

export interface ContentInstance {
  state: State;
  creator: Creator;
  content_type: ContentType;
  content: Content;
}

export interface Content {
  updated_at: any;
  serialized: Serialized;
  raw: string;
  instance_id: string;
  inserted_at: any;
  id: string;
  build: string;
  title: string;
}

export interface Serialized {
  title: string;
  body: string;
  serialized: any;
}

export interface ContentType {
  updated_at: Date;
  name: string;
  inserted_at: Date;
  id: string;
  fields: Fields;
  description: string;
}

export interface Fields {
  position: string;
  name: string;
  joining_date: string;
  approved_by: string;
}

export interface Creator {
  updated_at: Date;
  name: string;
  inserted_at: Date;
  id: string;
  email_verify: boolean;
  email: string;
}

export interface State {
  updated_at: Date;
  state: string;
  order: number;
  inserted_at: Date;
  id: string;
}

export interface IBuild {
  updated_at: string;
  serialized: Serialized;
  raw: string;
  instance_id: string;
  inserted_at: string;
  id: string;
  build: string;
}

export interface Serialized {
  title: string;
  serialized: any;
  body: string;
}

const ContentDetail = () => {
  const token = useStoreState((state) => state.auth.token);

  const router = useRouter();
  const cId: string = router.query.id as string;
  const [contents, setContents] = useState<ContentInstance>();
  const [loading, setLoading] = useState<boolean>(true);
  const [contentBody, setContentBody] = useState<any>();
  const [build, setBuild] = useState<IBuild>();

  const tab = useTabState({ selectedId: 'edit' });

  const loadDataSucces = (data: any) => {
    setLoading(false);
    const res: ContentInstance = data;
    setContents(res);
  };

  const loadData = (t: string, id: string) => {
    loadEntity(t, `contents/${id}`, loadDataSucces);
  };

  /** DELETE content
   * @TODO move to inner page [design]
   */
  // const delData = (id: string) => {
  //   if (token) {
  //     deleteEntity(`contents/${id}`, token);
  //   }
  // };

  /**
   * On Build success
   * @param data
   */
  const onBuild = (data: any) => {
    setLoading(false);
    setBuild(data);
    if (token) {
      loadData(token, cId);
    }
  };

  /**
   * Pass for build
   */
  const doBuild = () => {
    console.log('Building');
    setLoading(true);
    createEntity([], `contents/${cId}/build`, token, onBuild);
  };

  useEffect(() => {
    if (token) {
      loadData(token, cId);
    }
  }, [token]);

  useEffect(() => {
    console.log('contentBody', contentBody);
  }, [contentBody]);

  useEffect(() => {
    if (contents && contents.content && contents.content.serialized) {
      const contentBodyAct = contents.content.serialized;
      console.log('🧶 [content]', contents.content);

      if (contentBodyAct.serialized) {
        const contentBodyAct2 = JSON.parse(contentBodyAct.serialized);
        console.log('contentBodyAct2', contentBodyAct2);
        setContentBody(contentBodyAct2);
      }
    }
  }, [contents]);

  const doUpdate = () => {
    //
  };

  return (
    <Box py={0}>
      <Nav navtitle={contents?.content?.title} />
      <Box sx={{ position: 'relative', pl: 4, pt: 0 }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              right: '-50%',
              left: '50%',
              top: '80px',
            }}
          >
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}
        {contents && contents.content && (
          <Flex>
            <Box
              // as="form"
              // onSubmit={handleSubmit(onSubmit)}
              sx={{ minWidth: '70%', maxWidth: '85ch', m: 0 }}
            >
              <Flex
                sx={{
                  // px: 4,
                  // py: 3,
                  py: 3,
                  pb: 3,
                  // pl: '115px',
                  borderBottom: 'solid 1px',
                  borderColor: 'gray.3',
                  mb: 3,
                }}
              >
                <Box>
                  <Text sx={{ fontSize: 3, fontWeight: 'bold' }}>
                    {contents.content.serialized.title}
                  </Text>
                  <ProfileCard
                    time={contents.content?.inserted_at}
                    name={contents.creator?.name}
                    image="http://localhost:4000/uploads/avatars/6c0d05d7-bf3c-4bb8-8052-7e38f9dceb18/profilepic_Merissa%20Meyer.jpg?v=63816237803"
                  />
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Box
                    sx={{
                      pt: 1,
                      pb: 0,
                      mb: 0,
                      borderRadius: 99,
                      px: 2,
                      fontSize: 0,
                      ml: 'auto',
                      color: 'gray.9',
                      border: 'solid 1px #ddd',
                      svg: {
                        fill: 'gray.6',
                      },
                    }}
                  >
                    <MenuItem
                      variant="btnPrimary"
                      href={`/content/edit/[id]`}
                      path={`/content/edit/${contents.content.id}`}
                    >
                      <Box>
                        <Pencil size={22} height={22} />
                        <Text
                          // as="span"
                          sx={{
                            mx: 2,
                            mt: 0,
                            fontWeight: 'bold',
                            fontSize: 1,
                          }}
                        >
                          Edit
                        </Text>
                      </Box>
                    </MenuItem>
                  </Box>
                </Box>
              </Flex>
              <Box sx={{ mb: 4 }}>
                <TabList {...tab} aria-label="My tabs" sx={{ mb: 4 }}>
                  <Tab
                    id="edit"
                    as={Button}
                    sx={{
                      textAlign: 'left',
                      bg: 'gray.0',
                      color: 'green.9',
                      borderRadius: 0,
                      // border: 'solid 1px #ddd',
                      // px: 4,
                    }}
                    {...tab}
                  >
                    <StepBlock
                      no={1}
                      title="Content"
                      desc="Draft contents"
                      tab={tab}
                    />
                  </Tab>
                  <Tab
                    id="view"
                    {...tab}
                    as={Button}
                    sx={{
                      textAlign: 'left',
                      bg: 'gray.1',
                      color: 'green.9',
                      borderRadius: 0,
                      // border: 'solid 1px #ddd',
                      px: 4,
                      borderLeft: 0,
                    }}
                  >
                    <StepBlock
                      no={2}
                      title="File"
                      desc="Edit content"
                      tab={tab}
                    />
                  </Tab>
                </TabList>

                <TabPanel {...tab}>
                  <Box sx={{ mt: 4 }}>
                    <PreTag pt={4}>
                      {contentBody && (
                        <WraftEditor
                          // value={active}
                          editable={false}
                          onUpdate={doUpdate}
                          starter={contentBody}
                          cleanInsert={true}
                          token={contentBody}
                        />
                      )}
                    </PreTag>
                  </Box>
                </TabPanel>
                <TabPanel {...tab}>
                  <Box sx={{ mt: 4, border: 'solid 1px #ddd' }}>
                    {contents.content.build && (
                      <PdfViewer
                        url={`/${contents.content.build}`}
                        pageNumber={1}
                        sx={{ width: '100%' }}
                      />
                    )}
                  </Box>
                </TabPanel>
              </Box>
            </Box>

            <Box
              variant="plateRightBar"
              sx={{
                bg: '#FAFBFC',
                ml: 4,
                width: '30%',
                borderLeft: 'solid 1px #ddd',
                pt: 3,
              }}
            >
              <Box sx={{ px: 3 }}>
                <Flex sx={{ mb: 3 }}>
                  <Box sx={{ mr: 3 }}>
                    <Text as="h6" variant="labelcaps">
                      Version
                    </Text>
                    <Flex>
                      <Text
                        as="h3"
                        sx={{
                          fontWeight: 'heading',
                          fontSize: '16px',
                          lineHeight: '24px',
                        }}
                      >
                        {contents.content.instance_id}
                      </Text>
                      <Text
                        as="h6"
                        sx={{
                          fontWeight: 500,
                          bg: 'green.1',
                          ml: 2,
                          color: 'green.9',
                          px: 1,
                          py: 1,
                          borderRadius: '3px',
                          letterSpacing: '0.2px',
                          textTransform: 'uppercase',
                          fontSize: '10.24px',
                        }}
                      >
                        {contents?.state.state}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              </Box>

              <Box>
                <Box variant="layout.boxHeading">
                  <Text as="h3" variant="sectionheading">
                    Content
                  </Text>
                </Box>
                <Box sx={{ pt: 2, px: 3, bg: '#F5F7FE' }}>
                  <Box>
                    {build && (
                      <Box>
                        <Text>Updated At</Text>
                        <Text>{build.inserted_at}</Text>
                      </Box>
                    )}

                    <Box sx={{ pb: 2 }}></Box>
                    {contents.content.build && (
                      <Flex pt={0} pb={3}>
                        <File />
                        <Box>
                          <Box>
                            <Text
                              as="h3"
                              sx={{ fontSize: 1, mb: 0, color: 'gray.8' }}
                            >
                              {contents.content.instance_id}
                            </Text>
                            <Text
                              as="h4"
                              sx={{ fontSize: 0, mb: 0, color: 'gray.6' }}
                            >
                              {contents.state?.state}
                            </Text>
                          </Box>
                        </Box>

                        <Link
                          variant="download"
                          href={`/${contents.content.build}`}
                          target="_blank"
                        >
                          <Box
                            sx={{
                              p: 2,
                              pt: 1,
                              bg: 'green.8',
                              borderRadius: 4,
                              ml: 4,
                            }}
                          >
                            <Download size={20} color="white" />
                          </Box>
                        </Link>
                      </Flex>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ pb: 3 }}>
                <Box variant="layout.boxHeading">
                  <Text as="h3" variant="sectionheading">
                    Discuss
                  </Text>
                </Box>
                <Box sx={{ pt: 2, px: 3, bg: '#F5F7FE' }}>
                  {contents && contents.content && (
                    <Box mt={0}>
                      <CommentForm
                        master={contents.content_type.id}
                        master_id={contents.content.id}
                      />
                    </Box>
                  )}
                </Box>
              </Box>

              <Box
                variant="plateSide"
                sx={{
                  pl: 3,
                  flexGrow: 1,
                  mr: 4,
                  borderTop: 'solid 1px',
                  borderColor: 'gray.3',
                }}
              >
                <Flex
                  sx={{
                    pt: 3,
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    flexDirection: 'row',
                    // border: 'solid 1px #ddd',
                  }}
                >
                  <Button
                    sx={{ py: 2 }}
                    variant="btnPrimary"
                    onClick={() => doBuild()}
                  >
                    <>
                      {loading && <Spinner color="white" size={24} />}
                      {!loading && (
                        <Text sx={{ fontSize: 1, fontWeight: 600, p: 3 }}>
                          Publish
                        </Text>
                      )}
                    </>
                  </Button>

                  {/* 
                  
                  DELETE CONTENT
                  
                  <Button
                    sx={{ ml: 2 }}
                    variant="btnSecondary"
                    onClick={() => delData(contents.content.id)}>
                    <Text>Delete</Text>
                  </Button> */}
                </Flex>
              </Box>
            </Box>
          </Flex>
        )}
      </Box>
    </Box>
  );
};
export default ContentDetail;
