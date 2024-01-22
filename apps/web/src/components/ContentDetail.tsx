import React, { useEffect, useState } from 'react';

import {
  Menu,
  MenuButton,
  MenuItem as AriaMenuItem,
  MenuProvider,
  Tab,
  TabList,
  TabPanel,
  TabProvider,
} from '@ariakit/react';
import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Box, Flex, Text, Link, Button, Avatar } from 'theme-ui';
import { Spinner } from 'theme-ui';

import { deleteAPI, fetchAPI, postAPI } from '../utils/models';
import { ContentInstance, IBuild } from '../utils/types/content';

import { TimeAgo } from './Atoms';
import CommentForm from './CommentForm';
import Editor from './common/Editor';
import { File, Download, DotsVerticalRounded } from './Icons';
import MenuItem from './MenuItem';
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
    fontSize: '12px',
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
        borderColor: 'border',
        p: 0,
        '&:last-child': { borderRight: 0 },
      }}>
      {no && (
        <NumberBlock
          no={no}
          active={tab.selectedId === 'view' ? true : false}
        />
      )}
      <Box>
        <Text
          as="h5"
          sx={{
            fontFamily: 'body',
            fontSize: 1,
            color: 'text',
            // color: tab.selectedId === 'view' ? 'teal.200' : 'gray.1000',
            mb: 0,
            // pt: 1,
          }}>
          {title}
        </Text>
        {/* <Text
          as="h5"
          sx={{ fontFamily: 'body', fontWeight: 100, color: 'gray.500' }}>
          {desc}
        </Text> */}
      </Box>
    </Flex>
  );
};

/**
 * Sidebar
 */

interface EditMenuProps {
  id: string;
}

const EditMenus = ({ id }: EditMenuProps) => {
  /**
   * Delete content
   * @param id
   */
  const deleteContent = (id: string) => {
    deleteAPI(`contents/${id}`).then(() => {
      toast.success('Deleted a content', {
        duration: 1000,
        position: 'top-right',
      });
    });
  };
  return (
    <MenuProvider>
      <MenuButton
        as={Button}
        sx={{
          border: 'solid 1px',
          color: 'text',
          borderColor: 'border',
          p: 0,
          bg: 'neutral.100',
          pb: 1,
          mt: 2,
        }}>
        <DotsVerticalRounded width={24} height={24} />
      </MenuButton>
      <Menu
        as={Box}
        aria-label="Manage Content"
        sx={{
          border: 'solid 1px',
          borderColor: 'border',
          borderRadius: 4,
          bg: 'neutral.100',
          color: 'text',
        }}>
        <AriaMenuItem onClick={() => deleteContent(id)}>Delete</AriaMenuItem>
      </Menu>
    </MenuProvider>
  );
};

interface NumberBlockProps {
  no?: number;
  active?: boolean;
}

const NumberBlock = ({ no, active = false }: NumberBlockProps) => {
  const activeBorder = active ? 'gray.200' : 'gray.300';
  const defaultSize = 'small';
  const size = blockTypes.find((b: any) => b.name === defaultSize);

  return (
    <Box
      sx={{
        bg: 'neutral.200',
        textAlign: 'center',
        mr: 2,
        // mt: `-7px`,
        pb: `3px`,
        pt: `2px`,
        color: `text`,
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

export const ProfileCard = ({
  name,
  time,
  image = `https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg`,
}: ProfileCardP) => {
  const finalImage =
    image == '/uploads/default.jpg'
      ? 'https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg'
      : image;

  return (
    <Flex
      sx={{
        fontSize: 0,
        color: 'text',
        my: 2,
      }}>
      <Avatar
        width={18}
        height={18}
        sx={{ mr: 2, borderColor: 'border', border: 0 }}
        src={finalImage} // image
      />
      <Text as="h3" sx={{ mr: 3, fontSize: 1, fontWeight: 600 }}>
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

const ContentDetail = () => {
  const router = useRouter();
  const cId: string = router.query.id as string;
  const [contents, setContents] = useState<ContentInstance>();
  const [loading, setLoading] = useState<boolean>(true);
  const [contentBody, setContentBody] = useState<any>();
  const [build, setBuild] = useState<IBuild>();
  const [pageTitle, setPageTitle] = useState<string>('');

  const defaultSelectedId = 'edit';

  const loadData = (id: string) => {
    fetchAPI(`contents/${id}`).then((data: any) => {
      setLoading(false);
      const res: ContentInstance = data;
      setContents(res);
    });
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
   * Pass for build
   */
  const doBuild = () => {
    console.log('Building');
    setLoading(true);
    postAPI(`contents/${cId}/build`, []).then((data: any) => {
      setLoading(false);
      setBuild(data);
      loadData(cId);
    });
  };

  useEffect(() => {
    loadData(cId);
  }, []);

  useEffect(() => {
    if (contents && contents.content && contents.content.serialized) {
      const contentBodyAct = contents.content.serialized;
      // console.log('🧶 [content]', contents.content);
      setPageTitle(contents.content.serialized?.title);

      if (contentBodyAct.serialized) {
        const contentBodyAct2 = JSON.parse(contentBodyAct.serialized);
        // console.log('contentBodyAct2', contentBodyAct2);
        setContentBody(contentBodyAct2);
      }
    }
  }, [contents]);

  const doNothing = () => {
    //
  };

  // const navTitle = contents?.content?.title;

  return (
    <Box py={0} sx={{ minHeight: '100vh' }}>
      {!loading && pageTitle && <Nav navtitle={pageTitle} />}
      <Box sx={{ pt: 0 }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              right: '-50%',
              left: '50%',
              top: '80px',
              bottom: 0,
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
                  py: 1,
                  pb: 1,
                  // pl: '115px',
                  borderBottom: 'solid 1px',
                  borderColor: 'border',
                  // mb: 3,
                  bg: 'neutral.100',
                }}>
                <Box>
                  <Text
                    sx={{ fontSize: 3, fontWeight: 'bold', display: 'none' }}>
                    {contents.content.serialized.title}
                  </Text>
                  <ProfileCard
                    time={contents.content?.inserted_at}
                    name={contents.creator?.name}
                    image={`/uploads/default.jpg`}
                  />
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <MenuItem
                    variant="btnPrimary"
                    href={`/content/edit/[id]`}
                    path={`/content/edit/${contents.content.id}`}>
                    {/* <Pencil width={22} height={22} /> */}
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
                  </MenuItem>
                </Box>
              </Flex>
              <Box
                sx={{
                  mb: 0,
                  '.tabPanel': { border: 0, bg: 'neutral.200' },
                  button: {
                    border: 0,
                    bg: 'transparent',
                    px: 3,
                    py: 2,
                    borderRadius: 6,
                  },
                  '.tabGroup': {
                    bg: 'neutral.200',
                    // border: 'solid 1px blue',
                    px: 3,
                    py: 2,
                  },
                  'button[aria-selected=true]': {
                    border: 0,
                    bg: 'neutral.100',
                    px: 3,
                    py: 2,
                  },
                }}>
                <TabProvider defaultSelectedId={defaultSelectedId}>
                  <TabList
                    aria-label="Content Stages"
                    className="tabPanel tabGroup">
                    <Tab id="edit">
                      <Box sx={{ ml: 3 }}>
                        <StepBlock title="Draft" desc="Edit contents" />
                      </Box>
                    </Tab>
                    <Tab id="view">
                      <StepBlock title="File" desc="Sign and Manage" />
                    </Tab>
                  </TabList>

                  <TabPanel tabId={defaultSelectedId} className="tabPanel">
                    <Box sx={{ mt: 0, px: 6, pb: 6 }}>
                      <PreTag pt={4} pb={6}>
                        {contentBody && (
                          <Editor
                            defaultValue={contentBody}
                            editable={false}
                            tokens={[]}
                            onUpdate={doNothing}
                            insertable={null}
                            onceInserted={doNothing}
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
                        borderColor: 'border',
                        '.react-pdf__Document': {
                          mx: 2,
                        },
                        '.pdf__Page__textContent': {
                          border: 'solid 1px',
                          borderColor: 'grey.100',
                        },
                      }}>
                      {contents.content.build && (
                        <PdfViewer
                          url={`${contents.content.build}`}
                          pageNumber={1}
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
                bg: 'neutral.100',
                py: 0,
                width: '30%',
                borderLeft: 'solid 1px',
                borderColor: 'border',
                minHeight: '100vh',
                pt: 3,
              }}>
              <Flex sx={{ px: 3 }}>
                <Flex sx={{ mb: 3, mr: 'auto' }}>
                  <Box sx={{ mr: 3 }}>
                    <Text as="h6" variant="labelcaps">
                      Version
                    </Text>
                    <Flex>
                      <Text
                        as="h3"
                        sx={{
                          fontWeight: 'heading',
                          fontSize: 2,
                          lineHeight: '24px',
                        }}>
                        {contents.content.instance_id}
                      </Text>
                      <Box>
                        <Text
                          as="span"
                          sx={{
                            display: 'inline-flex',
                            fontWeight: 500,
                            bg: 'gray.100',
                            ml: 2,
                            color: 'text',
                            px: 1,
                            py: 0,
                            borderRadius: '3px',
                            letterSpacing: '0.2px',
                            textTransform: 'uppercase',
                            fontSize: 0,
                          }}>
                          {contents?.state.state}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
                <Box sx={{ ml: 'auto' }}>
                  <EditMenus id={cId} />
                </Box>
              </Flex>

              <Box>
                <Box variant="layout.boxHeading">
                  <Text as="h3" variant="sectionheading">
                    Content
                  </Text>
                </Box>
                <Box sx={{ pt: 2, px: 3, border: 0 }}>
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
                                sx={{ fontSize: 1, mb: 0, color: 'text' }}>
                                {contents.content.instance_id}
                              </Text>
                              <Text
                                as="h4"
                                sx={{
                                  fontSize: '12px',
                                  mb: 0,
                                  mt: 1,
                                  color: 'gray.700',
                                  fontWeight: 500,
                                  ml: 2,
                                }}>
                                v{contents.versions[0]?.version_number}
                              </Text>
                            </Flex>
                            <Flex>
                              <Text
                                as="h4"
                                sx={{ fontSize: 0, mb: 0, color: 'gray.700' }}>
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
                              // bg: 'gray.900',
                              borderRadius: 4,
                              border: 'solid 1px',
                              borderColor: 'border',
                              ml: 4,
                            }}>
                            <Download height={18} width={18} color="gray.3" />
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
                <Box sx={{ pt: 2, px: 3, bg: 'neutral.100' }}>
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
                  borderColor: 'border',
                  bg: 'neutral.100',
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
