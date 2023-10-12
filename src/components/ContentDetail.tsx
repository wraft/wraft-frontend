import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Link, Button, Avatar } from 'theme-ui';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';

// import { Document, Page } from 'react-pdf';
import { Download, Pencil } from './Icons';

import { useStoreState } from 'easy-peasy';
import { Spinner } from 'theme-ui';
import MenuItem from './MenuItem';
import dynamic from 'next/dynamic';

import { Tab, TabList, TabPanel, TabProvider } from '@ariakit/react';

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
    wh: '22px',
    fontSize: '13px',
  },
];

/**
 * Steps Indication Block
 */
interface StepBlockProps {
  tab?: any;
  title?: string;
  desc?: string;
  no?: number;
}

export const StepBlock = ({
  no,
  tab = { selectedId: 'view' },
  title,
}: StepBlockProps) => {
  return (
    <Flex
      sx={{
        flex: 1,
        borderRight: `solid 1px`,
        borderColor: 'gray.3',
        p: 0,
        '&:last-child': { borderRight: 0 },
      }}>
      <NumberBlock no={no} active={tab.selectedId === 'view' ? true : false} />
      <Box>
        <Text
          as="h4"
          sx={{
            fontFamily: 'body',
            fontSize: 1,
            color: tab.selectedId === 'view' ? 'teal.9' : 'gray.9',
            mb: 0,
          }}>
          {title}
        </Text>
        {/* <Text
          as="h5"
          sx={{ fontFamily: 'body', fontWeight: 100, color: 'gray.5' }}>
          {desc}
        </Text> */}
      </Box>
      <Box sx={{ pl: 3 }}>
        {/* <ChevronRight color='gray.4' width={24}/> */}
      </Box>
    </Flex>
  );
};

interface NumberBlockProps {
  no?: number;
  active?: boolean;
}

const NumberBlock = ({ no, active = false }: NumberBlockProps) => {
  const activeBorder = active ? 'teal.6' : 'gray.2';
  const defaultSize = 'small';
  const size = blockTypes.find((b: any) => b.name === defaultSize);

  return (
    <Box
      sx={{
        bg: 'gray.3',
        textAlign: 'center',
        mr: 3,
        // mt: `-7px`,
        pb: `3px`,
        pt: `1px`,
        color: `gray.7`,
        display: `block`,
        verticalAlign: 'middle',
        borderRadius: '99rem',
        border: 'solid 1px',
        borderColor: activeBorder,
        width: size?.wh,
        height: size?.wh,
      }}>
      <Text
        as="span"
        sx={{
          lineHeight: 'auto',
          m: 0,
          p: 0,
          fontSize: size?.fontSize,
        }}>
        {no}
      </Text>
    </Box>
  );
};

/**
 * Profile Block
 */
interface ProfileCardP {
  name: string;
  time: string;
  image?: string;
}

export const ProfileCard = ({ name, time }: ProfileCardP) => {
  return (
    <Flex
      sx={{
        fontSize: 0,
        color: 'gray.8',
        my: 2,
      }}>
      <Avatar
        width={22}
        height={22}
        sx={{ mr: 2, borderColor: 'gray.1', border: 'solid 1px' }}
        src={`https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg`} // image
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
  versions?: any;
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
  layout?: any;
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

  // const tab = useTabState({ selectedId: 'edit' });

  // const defaultSelectedId = 'edit';
  // const tab = useTabState({ defaultSelectedId });
  const defaultSelectedId = 'default-selected-tab';

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
      <Box sx={{ pt: 0 }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              right: '-50%',
              left: '50%',
              top: '80px',
            }}>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}
        {contents && contents.content && (
          <Flex>
            <Box
              // as="form"
              // onSubmit={handleSubmit(onSubmit)}
              sx={{ minWidth: '70%', maxWidth: '85ch', m: 0 }}>
              <Flex
                sx={{
                  px: 4,
                  // py: 3,
                  py: 3,
                  pb: 3,
                  // pl: '115px',
                  borderBottom: 'solid 1px',
                  borderColor: 'gray.3',
                  mb: 3,
                  bg: 'gray.0',
                }}>
                <Box>
                  <Text sx={{ fontSize: 3, fontWeight: 'bold' }}>
                    {contents.content.serialized.title}
                  </Text>
                  <ProfileCard
                    time={contents.content?.inserted_at}
                    name={contents.creator?.name}
                    image={`/uploads/default.jpg`}
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
                    }}>
                    <MenuItem
                      variant="btnPrimary"
                      href={`/content/edit/[id]`}
                      path={`/content/edit/${contents.content.id}`}>
                      <Box>
                        <Pencil width={22} height={22} />
                        <Text
                          // as="span"
                          sx={{
                            mx: 2,
                            mt: 0,
                            fontWeight: 'bold',
                            fontSize: 1,
                          }}>
                          Edit
                        </Text>
                      </Box>
                    </MenuItem>
                  </Box>
                </Box>
              </Flex>
              <Box sx={{ mb: 4 }}>
                <TabProvider defaultSelectedId={defaultSelectedId}>
                  <TabList aria-label="Content Stages">
                    <Tab id="edit">
                      <Box sx={{ ml: 3 }}>
                        <StepBlock no={1} title="Draft" desc="Edit contents" />
                      </Box>
                    </Tab>
                    <Tab id="view">
                      <StepBlock no={2} title="File" desc="Sign and Manage" />
                    </Tab>
                    <Tab id="sign">
                      <StepBlock
                        no={3}
                        title="Sign"
                        desc="Send for signatures"
                      />
                    </Tab>
                  </TabList>

                  <TabPanel>
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
                  <TabPanel>
                    <Box
                      sx={{
                        mt: 4,
                        border: 'solid 1px',
                        borderColor: 'gray.3',
                      }}>
                      {contents.content.build && (
                        <PdfViewer
                          // url={contents.content.build}
                          url={`${contents.content.build}`}
                          pageNumber={1}
                          // sx={{ width: '100%' }}
                        />
                      )}
                    </Box>
                  </TabPanel>
                </TabProvider>
              </Box>
            </Box>
            <Box
              variant="plateRightBar"
              sx={{
                bg: '#FAFBFC',
                py: 0,
                width: '30%',
                borderLeft: 'solid 1px',
                borderColor: 'gray.3',
                pt: 3,
              }}>
              <Box sx={{ px: 3 }}>
                {/* {contents.content.build} */}
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
                        }}>
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
                        }}>
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
                        <TimeAgo time={build.inserted_at} />
                      </Box>
                    )}

                    <Box sx={{ pb: 2 }}></Box>
                    {contents.content.build && (
                      <Flex pt={0} pb={3}>
                        <File />
                        <Box>
                          <Box>
                            <Flex>
                              <Text
                                as="h3"
                                sx={{ fontSize: 1, mb: 0, color: 'gray.8' }}>
                                {contents.content.instance_id}
                              </Text>
                              <Text
                                as="h4"
                                sx={{
                                  fontSize: '12px',
                                  mb: 0,
                                  mt: 1,
                                  color: 'gray.6',
                                  fontWeight: 500,
                                  ml: 2,
                                }}>
                                v{contents.versions[0]?.version_number}
                              </Text>
                            </Flex>
                            <Flex>
                              <Text
                                as="h4"
                                sx={{ fontSize: 0, mb: 0, color: 'gray.6' }}>
                                {contents.content_type?.layout?.name} /{' '}
                                {contents.content_type?.name}
                              </Text>
                            </Flex>
                          </Box>
                        </Box>

                        <Link
                          variant="download"
                          href={`${contents.content.build}`}
                          target="_blank">
                          <Flex
                            sx={{
                              p: 2,
                              pt: 1,
                              // bg: 'green.8',
                              borderRadius: 4,
                              border: 'solid 1px',
                              borderColor: 'gray.4',
                              ml: 4,
                            }}>
                            <Download height={18} width={18} color="gray.3" />
                            {/* <Text as="p" sx={{ ml: 2 }}>Download</Text> */}
                          </Flex>
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
                }}>
                <Flex
                  sx={{
                    pt: 3,
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    flexDirection: 'row',
                    // border: 'solid 1px #ddd',
                  }}>
                  <Button
                    sx={{ py: 2 }}
                    variant="btnPrimary"
                    onClick={() => doBuild()}>
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
