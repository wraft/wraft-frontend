import React, { useEffect, useState } from 'react';

import { Tab, TabList, TabPanel, TabProvider } from '@ariakit/react';
import styled from '@emotion/styled';
import ContentSidebar, {
  FlowStateBlock,
} from '@wraft-ui/content/ContentSidebar';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Box, Flex, Text, Link, Button, Avatar } from 'theme-ui';
import { Spinner } from 'theme-ui';

import { fetchAPI, postAPI } from '../utils/models';
import {
  ContentInstance,
  IBuild,
  IVariantDetail,
} from '../utils/types/content';

import { TimeAgo } from './Atoms';
import CommentForm from './CommentForm';
import Editor from './common/Editor';
import styles from './common/Tab/tab.module.css';
import { EditIcon, DownloadIcon } from './Icons';
import MenuItem from './MenuItem';
import Nav from './NavEdit';
import toast from 'react-hot-toast';
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
      </Box>
    </Flex>
  );
};

/**
 * Sidebar
 */

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
  }, [cId]);

  useEffect(() => {
    if (build) {
      toast.success('Build done successfully', {
        duration: 500,
        position: 'top-right',
      });
    }
  }, [build]);

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
      // console.log('[onLoadContent][x]', contents.content.serialized?.title);

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
                <Box sx={{ ml: 'auto' }}>
                  <MenuItem
                    variant="btnMenu"
                    href={`/content/edit/[id]`}
                    path={`/content/edit/${contents.content.id}`}>
                    <EditIcon width={24} />
                  </MenuItem>
                </Box>
              </Flex>
              <Box
                sx={{
                  mb: 0,
                  bg: 'neutral.200',
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

                  <TabPanel
                    tabId={defaultSelectedId}
                    className={styles.tablist}>
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
                        bg: 'neutral.200',
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
              <ContentSidebar content={contents} />

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
                  {activeFlow?.states.map((x: any) => (
                    <FlowStateBlock
                      activeFlow={contents}
                      key={x?.id}
                      state={x?.state}
                      order={x?.order}
                      id={x?.id}
                    />
                  ))}
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
                      Info
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
                          <Box sx={{ pb: 2 }}></Box>
                          {contents.content.build && (
                            <Flex pt={0} pb={3}>
                              <Box>
                                <Box>
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
                                      ml: 0,
                                    }}>
                                    <Flex as="span">
                                      <Text sx={{ mr: 2 }}>Updated </Text>
                                      <TimeAgo
                                        time={contents?.versions[0]?.updated_at}
                                      />
                                    </Flex>
                                  </Text>
                                </Box>
                              </Box>
                              <Box sx={{ ml: 'auto' }}>
                                <Link
                                  variant="download"
                                  href={`${contents.content.build}`}
                                  target="_blank">
                                  <DownloadIcon width={20} />
                                </Link>
                              </Box>
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
                    <Box variant="layout.boxHeading">
                      {contents.versions && contents.versions.length > 0 && (
                        <Box>
                          {contents.versions.map((v: any) => (
                            <Flex key={v?.id} sx={{ py: 2 }}>
                              <Text sx={{ fontSize: 1, fontWeight: 500 }}>
                                Version {v?.version_number}
                              </Text>
                              <Box sx={{ ml: 'auto', mr: 3, pb: 2 }}>
                                <TimeAgo time={v?.updated_at} />
                              </Box>
                            </Flex>
                          ))}
                        </Box>
                      )}
                    </Box>
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
