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
// import { intersection } from 'lodash';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Box, Flex, Text, Link, Button, Avatar } from 'theme-ui';
import { Spinner } from 'theme-ui';

import { deleteAPI, fetchAPI, postAPI } from '../utils/models';
import {
  ContentInstance,
  IBuild,
  IVariantDetail,
} from '../utils/types/content';
import { FlowStateBlock } from '../utils/types/content';

import { IconWrapper, TimeAgo } from './Atoms';
import CommentForm from './CommentForm';
import Editor from './common/Editor';
import styles from './common/Tab/tab.module.css';
import MenuItem from './MenuItem';
import Nav from './NavEdit';
const PdfViewer = dynamic(() => import('./PdfViewer'), { ssr: false });

/**
 * Atom Component to show Flow State
 * @TODO move to atoms or ui
 * @param param0
 * @returns
 */
const FlowStateBlock = ({ state, order }: FlowStateBlock) => (
  <Flex
    sx={{
      // borderTop: 'solid 1px #eee',
      // borderBottom: 'solid 1px #eee',
      pb: 2,
      mr: 3,
    }}>
    <Box
      sx={{
        mt: 2,
        fontSize: 0,
        width: '18px',
        height: '18px',
        borderRadius: '9rem',
        bg: 'green.100',
        textAlign: 'center',
        mr: 2,
        pt: '2px',
      }}>
      {order}
    </Box>
    <Text
      variant="labelcaps"
      sx={{ fontSize: 1, pt: 2, textTransform: 'capitalize' }}>
      {state}
    </Text>
    <Box
      sx={{
        paddingLeft: '8px',
        height: '24px',
        /* background: red; */
        paddingRight: '4px',
        paddingTop: '7px',
      }}>
      <IconArrow />
    </Box>
  </Flex>
);

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

// const IconE = () => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 16 16"
//       fill="currentColor"
//       className="w-4 h-4">
//       <path
//         fillRule="evenodd"
//         d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
//         clipRule="evenodd"
//       />
//     </svg>
//   );
// };

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
          border: 0,
          color: 'text',
          borderColor: 'border',
          p: 0,
          bg: 'neutral.100',
          pb: 1,
          mt: 0,
          ml: 1,
        }}>
        {/* <DotsVerticalRounded width={24} height={24} />
         */}
        <>
          <Box
            sx={{
              svg: {
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                p: '8px',
                borderRadius: '9rem',
                bg: 'transparent',
                color: 'gray.400',
                ':hover': {
                  bg: 'gray.100',
                  color: 'gray.900',
                },
              },
            }}>
            <IconWrapper>
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            </IconWrapper>
          </Box>
        </>
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

interface BreadCrumpSampleProps {
  name: string;
  state: string;
}

function IconArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="11"
      fill="none"
      viewBox="0 0 5 11">
      <path stroke="#AEC2AF" strokeWidth="0.5" d="M.5 1L4 6 .5 10.5"></path>
    </svg>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BreadCrum = ({ name, state }: BreadCrumpSampleProps) => {
  // const activeBorder = active ? 'gray.200' : 'gray.300';
  const defaultSize = 'small';
  const size = blockTypes.find((b: any) => b.name === defaultSize);

  const switchColor = (state: string) => {
    switch (state) {
      case 'completed':
        return 'green.100';
        break;
      case 'todo':
        return 'gray.100';
        break;
      case 'pending':
        return 'blue.100';
      default:
        return 'blue.100';
        break;
    }
  };

  return (
    <Flex
      sx={{
        bg: `${switchColor(state)}`,
        borderRadius: '5px',
        textAlign: 'center',
        mr: 2,
        // mt: `-7px`,
        pb: 1,
        pt: 1,
        pl: 2,
        pr: 3,
        color: `text`,
        '::after': {
          right: '-22px',
          borderWidth: '11px',
          borderColor: 'transparent transparent transparent #0d5287',
        },
      }}>
      <Text
        as="span"
        sx={{
          lineHeight: 'auto',
          m: 0,
          p: 0,
          fontSize: size?.fontSize,
        }}>
        {name}
      </Text>
      <Box sx={{ display: 'none', width: '16px', ml: 'auto', mr: 2, mt: -1 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4">
          <path
            fillRule="evenodd"
            d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </Box>
      <IconArrow />
    </Flex>
  );
};

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
        my: 1,
      }}>
      <Avatar
        width={18}
        height={18}
        sx={{ mr: 2, borderColor: 'border', border: 0 }}
        src={finalImage} // image
      />
      <Text as="h3" sx={{ mr: 3, fontSize: 2, fontWeight: 600 }}>
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
  const [activeFlow, setActiveFlow] = useState<any>(null);
  // const [varient, setVarient] = useState<IVariantDetail | null>(null);

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

  /**
   * Cast content_type to `content`
   * @param data IField compatiable
   * */
  const onLoadData = (data: any) => {
    // variant details
    const res: IVariantDetail = data;
    // setVarient(res);
    // inner flows
    const tFlow = res?.content_type?.flow;
    setActiveFlow(tFlow);
  };

  useEffect(() => {
    if (contents && contents.content && contents.content.serialized) {
      const contentBodyAct = contents.content.serialized;
      const contentTypeId = contents.content_type.id;
      setPageTitle(contents.content.serialized?.title);

      if (contentBodyAct.serialized) {
        const contentBodyAct2 = JSON.parse(contentBodyAct.serialized);
        // console.log('contentBodyAct2', contentBodyAct2);
        setContentBody(contentBodyAct2);
      }

      // s
      if (contentTypeId) {
        fetchAPI(`content_types/${contentTypeId}`).then((data: any) => {
          onLoadData(data);
        });
      }
      // fetchAPI(`content_types/x`).then((data: any) => {
      //   onLoadData(data);
      // });
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
            {/* <Spinner width={40} height={40} color="primary" /> */}
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
                <Flex sx={{ ml: 'auto' }}>
                  <MenuItem
                    variant="iconCircle"
                    href={`/content/edit/[id]`}
                    path={`/content/edit/${contents.content.id}`}>
                    <Box
                      sx={{
                        svg: {
                          cursor: 'pointer',
                          width: '32px',
                          height: '32px',
                          p: '8px',
                          borderRadius: '9rem',
                          // bg: 'green.100',
                          // bg: 'green.100',
                          // border: 'solid 1px',
                          bg: 'gray.200',
                          borderColor: 'green.200',
                          color: 'gray.800',
                          ':hover': {
                            bg: 'gray.300',
                            color: 'gray.900',
                          },
                        },
                      }}>
                      <IconWrapper>
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                        <path d="M13.5 6.5l4 4" />
                      </IconWrapper>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    variant="iconCircle"
                    href={`/content/edit/[id]`}
                    path={`/content/edit/${contents.content.id}`}>
                    <Box
                      sx={{
                        svg: {
                          cursor: 'pointer',
                          width: '32px',
                          height: '32px',
                          p: '8px',
                          borderRadius: '9rem',
                          // bg: 'green.100',
                          // bg: 'green.100',
                          // border: 'solid 1px',
                          bg: 'gray.200',
                          borderColor: 'green.200',
                          color: 'gray.800',
                          ':hover': {
                            bg: 'gray.100',
                            color: 'gray.900',
                          },
                        },
                      }}>
                      <IconWrapper>
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 15l6 -6" />
                        <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
                        <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
                      </IconWrapper>
                    </Box>
                  </MenuItem>
                </Flex>
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
                        <StepBlock title="Matter" desc="Edit contents" />
                      </Box>
                    </Tab>
                    <Tab id="view">
                      <StepBlock title="Document" desc="Sign and Manage" />
                    </Tab>
                  </TabList>

                  <TabPanel tabId={defaultSelectedId} className="tabPanel">
                    <Box
                      sx={{
                        mt: 0,
                        px: 4,
                        pb: 6,
                        // pl: '9rem !important',
                        // pr: '9rem !important',
                        // pt: '7rem !important',
                        '.remirror-theme .ProseMirror': {
                          pl: '9rem !important',
                          pr: '9rem !important',
                          pt: '7rem !important',
                        },
                      }}>
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
                      {contents.content_type?.layout?.name} /{' '}
                      {contents.content_type?.name}
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
                <Flex sx={{ ml: 'auto' }}>
                  <Box
                    sx={{
                      p: 0,
                      svg: {
                        cursor: 'pointer',
                        width: '32px',
                        height: '32px',
                        p: '8px',
                        borderRadius: '9rem',
                        bg: 'green.100',
                        // border: 'solid 2px #ddd',
                        color: 'green.800',
                        ':hover': {
                          bg: 'gray.100',
                          color: 'gray.900',
                        },
                      },
                    }}>
                    <IconWrapper>
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M10 14l11 -11" />
                      <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                    </IconWrapper>
                  </Box>
                  <Box>
                    <EditMenus id={cId} />
                  </Box>
                </Flex>
              </Flex>

              <Box
                variant="plateSide"
                sx={{
                  // pl: 3,
                  flexGrow: 1,
                  mr: 0,
                  // pr: 3,
                  pb: 3,
                  // pt: 2,
                  borderTop: 'solid 1px',
                  borderColor: 'border',
                  // bg: '#d9deda57',
                }}>
                <Flex
                  sx={{
                    bg: '#d9deda57',
                    px: 3,
                  }}>
                  <Box>
                    <Box>
                      <Flex sx={{ px: 0, py: 0 }}>
                        {activeFlow?.states.map((x: any) => (
                          <FlowStateBlock
                            key={x?.id}
                            state={x?.state}
                            order={x?.order}
                            id={x?.id}
                          />
                        ))}
                      </Flex>
                    </Box>
                  </Box>
                </Flex>
                <Flex
                  sx={{
                    pt: 3,
                    px: 3,
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
                        <Text sx={{ fontSize: 2, fontWeight: 600, p: 3 }}>
                          Build
                        </Text>
                      )}
                    </>
                  </Button>
                </Flex>
              </Box>

              <Box>
                <TabProvider defaultSelectedId={defaultSelectedId}>
                  <TabList
                    aria-label="Content Stages"
                    className={styles.tablist}>
                    <Tab id="edit" className={styles.tabInline}>
                      <Box>Meta</Box>
                    </Tab>
                    <Tab className={styles.tabInline} id="view">
                      Discuss
                    </Tab>
                    <Tab className={styles.tabInline} id="history">
                      History
                    </Tab>
                  </TabList>

                  <TabPanel tabId={defaultSelectedId} className="tabPanel">
                    <Box sx={{ bg: 'neutral.100' }}>
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
                              {/* <File /> */}
                              <IconWrapper>
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <path d="M10 8v8h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-2z" />
                                <path d="M3 12h2a2 2 0 1 0 0 -4h-2v8" />
                                <path d="M17 12h3" />
                                <path d="M21 8h-4v8" />
                              </IconWrapper>
                              <Box>
                                <Box>
                                  <Flex>
                                    <Text
                                      as="h3"
                                      sx={{
                                        fontSize: 1,
                                        mb: 0,
                                        color: 'text',
                                      }}>
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
                                      sx={{
                                        fontSize: 0,
                                        mb: 0,
                                        color: 'gray.700',
                                      }}>
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
                                    pt: 1,
                                    // bg: 'gray.900',
                                    borderRadius: 4,
                                    // border: 'solid 1px',
                                    // borderColor: 'border',
                                    ml: 4,
                                    p: 0,
                                    border: 0,
                                  }}>
                                  <IconWrapper>
                                    <path
                                      stroke="none"
                                      d="M0 0h24v24H0z"
                                      fill="none"
                                    />
                                    <path d="M12 5l0 14" />
                                    <path d="M18 13l-6 6" />
                                    <path d="M6 13l6 6" />
                                  </IconWrapper>
                                </Flex>
                              </Link>
                            </Flex>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box sx={{ bg: 'neutral.100' }}>
                      <Box sx={{ pb: 3 }}>
                        <Box variant="layout.boxHeading" sx={{ pb: 1 }}>
                          <Text as="h3" sx={{ fontSize: 2, fontWeight: 500 }}>
                            Discussions
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
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box sx={{ bg: 'neutral.100' }}></Box>
                  </TabPanel>
                </TabProvider>
              </Box>
            </Box>
          </Flex>
        )}
      </Box>
    </Box>
  );
};
export default ContentDetail;
