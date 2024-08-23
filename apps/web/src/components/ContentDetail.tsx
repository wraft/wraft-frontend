import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Tab, TabList, TabPanel, TabProvider } from '@ariakit/react';
import styled from '@emotion/styled';
import ContentSidebar, {
  FlowStateBlock,
} from '@wraft-ui/content/ContentSidebar';
import toast from 'react-hot-toast';
import { Box, Flex, Text, Link, Button, Avatar, Image } from 'theme-ui';
import { Spinner } from 'theme-ui';
import { ErrorBoundary } from '@wraft/ui';
import {
  ArrowLeft,
  ArrowRight,
  DownloadSimple,
  Play,
  LockSimple,
  Triangle,
} from '@phosphor-icons/react';

import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, postAPI, putAPI } from 'utils/models';
import { ContentInstance, IVariantDetail } from 'utils/types/content';

import { TimeAgo } from './Atoms';
import CommentForm from './CommentForm';
import Editor from './common/Editor';
import styles from './common/Tab/tab.module.css';
import Nav from './NavEdit';
import Modal from './Modal';
import Field from './FieldText';
import ApprovalFlowHistory from './Content/ApprovalFlowHistory';

const PdfViewer = dynamic(() => import('./PdfViewer'), { ssr: false });

interface Approver {
  id: string;
  name: string;
  profile_pic: string;
}

interface StateState {
  approvers: Approver[];
  id: string;
  state: string;
  order: number;
  is_user_eligible: boolean;
  inserted_at: string;
  updated_at: string;
  error?: string | undefined;
}

/**
 * Number Block
 */

const blockTypes = [
  {
    name: 'medium',
    wh: '32px',
    fontSize: 'xs',
  },
  {
    name: 'small',
    wh: '22px',
    fontSize: 'xs',
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
            fontSize: 'xs',
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
  time?: string;
  image?: string;
}

export const ProfileCard = ({
  name,
  time = '',
  image = `https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg`,
}: ProfileCardP) => {
  const finalImage =
    image == '/uploads/default.jpg'
      ? 'https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg'
      : image;

  return (
    <Flex
      sx={{
        fontSize: 'xxs',
        color: 'text',
        my: 1,
        alignItems: 'center',
      }}>
      <Avatar
        width={18}
        height={18}
        sx={{ mr: 2, borderColor: 'border', border: 0 }}
        src={finalImage}
      />
      <Text as="h3" sx={{ mr: 3, fontSize: 'sm', fontWeight: 600 }}>
        {name}
      </Text>
      <Box>{time}</Box>
      {/* <TimeAgo time={time} ago={true} /> */}
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
  const [contents, setContents] = useState<ContentInstance>();
  const [flow, setFlow] = useState<any>(null);
  const [states, setStates] = useState<any>();

  const [rerender, setRerender] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [contentBody, setContentBody] = useState<any>();
  const [pageTitle, setPageTitle] = useState<string>('');

  const [nextState, setNextState] = useState<StateState>();
  const [prevState, setPrevState] = useState<StateState>();
  const [open, setOpen] = useState<boolean>(false);

  const [modalAction, setModalAction] = useState<'next' | 'prev' | null>(null);
  const [tabActiveId, setTabActiveId] = useState<any>();

  const { register } = useForm();
  const router = useRouter();
  const { userProfile } = useAuth();

  const cId: string = router.query.id as string;

  const defaultSelectedId = 'edit';

  useEffect(() => {
    fetchContentDetails(cId);
  }, [cId, rerender]);

  useEffect(() => {
    if (flow && flow.flow && contents) {
      fetchStates(flow.flow.id);
    }
  }, [flow, contents]);

  useEffect(() => {
    if (contents && contents.content && contents.content.serialized) {
      const { content, content_type } = contents;

      const contentBodyAct = content.serialized;
      const contentTypeId = content_type.id;

      setPageTitle(content.serialized?.title);

      if (contentBodyAct.serialized) {
        const contentBodyAct2 = JSON.parse(contentBodyAct.serialized);

        setContentBody(contentBodyAct2);
      }

      if (contentTypeId) {
        fetchContentTypeDetails(contentTypeId);
      }
    }
  }, [contents]);

  useEffect(() => {
    if (states && userProfile) {
      const activeState = states.find(
        (state: any) => state.id === contents?.state?.id,
      );

      const currentIndex = states.indexOf(activeState);

      if (currentIndex !== -1 && activeState) {
        const nextState = states[currentIndex + 1] || null;
        const prevState = states[currentIndex - 1] || null;

        setNextState(nextState);
        setPrevState(prevState);
      }

      if (contents && contents.state === null && states.length > 0) {
        const { creator } = contents;
        const { id: userId } = userProfile;

        if (creator?.id === userId) {
          const state = states[0];
          setNextState({ ...state, is_user_eligible: true });
        }
      }
    }
  }, [flow, states]);

  const fetchContentDetails = (id: string) => {
    fetchAPI(`contents/${id}`).then((data: any) => {
      setLoading(false);
      const res: ContentInstance = data;
      setContents(res);
    });
  };

  const fetchStates = (id: string) => {
    fetchAPI(`flows/${id}/states`).then((data: any) => {
      const stateNames = data
        .flatMap((item: any) => {
          const state = item.state;

          const isUserEligible = state.approvers.some(
            (approver: any) => approver.id === userProfile.id,
          );

          return {
            state: state.state,
            active_state: state.id === contents?.state?.id,
            id: state.id,
            order: state.order,
            is_user_eligible: isUserEligible,
            approvers: state.approvers,
          };
        })
        .sort((a: any, b: any) => a.order - b.order);

      setStates(stateNames);
    });
  };

  const fetchContentTypeDetails = (id: any) => {
    fetchAPI(`content_types/${id}`)
      .then((data: any) => {
        const res: IVariantDetail = data;
        const tFlow = res?.content_type?.flow;
        setFlow(tFlow);
      })
      .catch((err) => {
        console.log(err, 'logerr');
      });
  };

  /**
   * Pass for build
   */
  const doBuild = () => {
    setLoading(true);
    postAPI(`contents/${cId}/build`, [])
      .then(() => {
        setLoading(false);
        fetchContentDetails(cId);

        toast.success('Build done successfully', {
          duration: 500,
          position: 'top-right',
        });
      })
      .catch(() => {
        setLoading(false);
        toast.error('Build Failed');
      });
  };

  const handleModalAction = () => {
    if (contents) {
      if (modalAction === 'next') {
        const req = putAPI(`contents/${contents.content.id}/approve`);
        toast.promise(req, {
          loading: 'Approving...',
          success: () => {
            setRerender((prev) => !prev);
            return 'Approved';
          },
          error: 'Failed',
        });
      } else if (modalAction === 'prev' && prevState) {
        const req = putAPI(`contents/${contents.content.id}/reject`);
        toast.promise(req, {
          loading: 'Rejecting...',
          success: () => {
            setRerender((prev) => !prev);
            return 'Rejected';
          },
          error: 'Failed',
        });
      }
      setOpen(false);
    }
  };

  const doNothing = () => {
    //
  };

  const isMakeCompete = useMemo(() => {
    if (contents && states && states.length > 0) {
      const { state, content }: ContentInstance = contents;
      const lastState = states[states.length - 1];
      const currentstate = state?.state;
      const approval_status = content?.approval_status;

      return (
        (currentstate === lastState.state &&
          !approval_status &&
          lastState.is_user_eligible) ||
        false
      );
    }
    return false;
  }, [contents, states]);

  const isEditable = useMemo(() => {
    if (contents) {
      const { content }: ContentInstance = contents;
      return content?.approval_status;
    }
    return false;
  }, [contents]);

  const currentActiveIndex = useMemo(() => {
    if (contents && states && states.length > 0) {
      // const { content, state }: ContentInstance = contents;
      // if()
      // const index = states.findIndex((item: any) => item.id === targetId);
      // return content?.approval_status;
    }
    return false;
  }, [contents]);

  return (
    <Box py={0} sx={{ minHeight: '100vh' }}>
      {!loading && pageTitle && <Nav navtitle={pageTitle} />}
      <Box sx={{ pt: 0 }}>
        {/* {loading && (
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
        )} */}
        <ErrorBoundary>
          {contents && contents.content && (
            <Flex>
              <Box
                // as="form"
                // onSubmit={handleSubmit(onSubmit)}
                sx={{ minWidth: '70%', m: 0 }}>
                <Flex
                  sx={{
                    px: 3,
                    // py: 3,
                    py: 2,
                    // pb: 2,
                    // pl: '115px',
                    borderBottom: 'solid 1px',
                    borderColor: 'border',
                    // mb: 3,
                    bg: 'gray.200',
                  }}>
                  <Flex sx={{ width: '100%', alignItems: 'center' }}>
                    {/* <Text
                      sx={{
                        fontSize: 'base',
                        fontWeight: 'bold',
                        display: 'none',
                      }}>
                      {contents.content.serialized.title}
                    </Text> */}
                    <Flex
                      sx={{
                        // bg: '#d9deda57',
                        py: 1,
                        alignItems: 'center',
                        overflowX: 'scroll',
                        bg: 'white',
                        border: 'solid 1px',
                        borderColor: 'gray.300',
                        px: 2,
                        borderRadius: '9px',
                      }}>
                      {states &&
                        states.map((x: any, i: number) => (
                          <FlowStateBlock
                            key={x?.id}
                            num={i + 1}
                            state={x?.state}
                            order={x?.order}
                            nextState={nextState}
                            id={x?.id}
                          />
                        ))}

                      {contents &&
                        !nextState?.is_user_eligible &&
                        !isMakeCompete &&
                        !isEditable && (
                          <Flex
                            sx={{
                              px: 1,
                              py: '2px',
                              gap: 1,
                              alignItems: 'center',
                              verticalAlign: 'center',
                              borderRadius: '6px',
                              fontSize: 'xs',
                              color: 'orange.800',
                              bg: 'orange.100',
                            }}>
                            <Triangle size={10} />
                            <Text
                              sx={{
                                textTransform: 'uppercase',
                                letterSpacing: '-0.01rem',
                              }}>
                              Waiting for approval
                            </Text>
                          </Flex>
                        )}
                    </Flex>

                    <Flex sx={{ ml: 'auto', alignItems: 'center' }}>
                      {!contents?.content?.approval_status && (
                        <Flex
                          sx={{
                            p: 0,
                            gap: 2,
                            ml: 'auto',
                            alignItems: 'center',
                          }}>
                          <Box
                            sx={
                              {
                                // pt: 3,
                                // px: 3,
                              }
                            }>
                            <Button
                              sx={{ py: '6px', gap: 1, alignItem: 'center' }}
                              variant="btnSecondaryInline"
                              onClick={() => doBuild()}>
                              {/**
                             btnSecondaryInline
                              */}

                              {loading && (
                                <Spinner color="green.400" size={16} />
                              )}
                              {!loading && (
                                <>
                                  <Text
                                    sx={{
                                      fontSize: 'sm',
                                      fontWeight: 600,
                                      p: 0,
                                    }}>
                                    Generate
                                  </Text>
                                  <Play size={16} />
                                </>
                              )}
                            </Button>
                          </Box>

                          {/* {prevState && eligibleUser && (
                            <Button
                              // variant="btnSecondary"
                              onClick={() => {
                                setModalAction('prev');
                                setOpen(true);
                              }}>
                              <ArrowLeft />
                              <Text variant="pB">{`Back to ${prevState.state || ''}`}</Text>
                            </Button>
                          )} */}

                          {nextState && nextState.is_user_eligible && (
                            <Button
                              sx={{
                                gap: 1,
                                ':hover': {
                                  svg: {
                                    color: 'green.800',
                                  },
                                },
                              }}
                              variant="btnPrimaryInline"
                              onClick={() => {
                                setModalAction('next');
                                setOpen(true);
                              }}>
                              <Text
                                variant="pB"
                                sx={{
                                  pr: 2,
                                }}>{`${nextState?.state || ''}`}</Text>
                              <ArrowRight size={16} stroke="bold" />
                            </Button>
                          )}
                          {isMakeCompete && (
                            <Button
                              variant="btnPrimaryInline"
                              sx={{
                                gap: 1,
                                '&:hover': {
                                  svg: {
                                    color: 'green.800',
                                  },
                                },
                              }}
                              onClick={() => {
                                setModalAction('next');
                                setOpen(true);
                              }}>
                              <Text variant="pB">Mark Complete</Text>
                              <ArrowRight size={16} stroke="bold" />
                            </Button>
                          )}
                        </Flex>
                      )}
                      {isEditable && (
                        <Flex
                          sx={{
                            px: 1,
                            py: '2px',
                            gap: 1,
                            alignItems: 'center',
                            verticalAlign: 'center',
                            borderRadius: '6px',
                            fontSize: 'xs',
                            color: 'text',
                            bg: 'green.400',
                          }}>
                          <LockSimple size={10} />
                          <Text
                            sx={{
                              textTransform: 'uppercase',
                              letterSpacing: '-0.01rem',
                            }}>
                            Locked
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                    {/* <ProfileCard
                      time={contents.content?.inserted_at}
                      name={contents.creator?.name}
                      image={contents?.creator?.profile_pic}
                    /> */}
                  </Flex>
                  {/* <Box sx={{ ml: 'auto' }}>
                    <MenuItem
                      variant="btnMenu"
                      href={`/content/edit/[id]`}
                      path={`/content/edit/${contents.content.id}`}>
                      <EditIcon width={24} />
                    </MenuItem>
                  </Box> */}
                </Flex>
                <Box
                  sx={{
                    mb: 0,
                    bg: 'gray.400',
                    // bg: 'gray.a100',
                    // bg: 'neutral.200',
                    '.tabPanel': { border: 0, bg: 'gray.400' },
                    button: {
                      border: 0,
                      bg: 'transparent',
                      px: 3,
                      py: 2,
                      borderRadius: 6,
                    },
                    '.tabGroup': {
                      // bg: 'neutral.200',
                      bg: 'gray.400',
                      // border: 'solid 1px blue',
                      px: 3,
                      // textAlign: 'centre',
                      py: 2,
                    },
                    'button[aria-selected=true]': {
                      border: 0,
                      // bg: 'neutral.100',
                      bg: 'gray.200',
                      px: 3,
                      py: 2,
                    },
                  }}>
                  <TabProvider defaultSelectedId={defaultSelectedId}>
                    <TabList
                      aria-label="Content Stages"
                      className="tabPanel tabGroup">
                      <Tab id="edit">
                        <StepBlock title="Content" desc="Edit contents" />
                      </Tab>
                      <Tab id="view">
                        <StepBlock title="Document" desc="Sign and Manage" />
                      </Tab>
                    </TabList>

                    <TabPanel
                      tabId={defaultSelectedId}
                      className={styles.tablist}>
                      <ErrorBoundary>
                        <Box
                          sx={{
                            mt: 0,
                            borderRadius: '6px',
                            maxWidth: '100%',
                            px: 4,
                            // pb: 6,
                            // bg: 'gray.100',
                            // pl: '9rem !important',
                            // pr: '9rem !important',
                            // pt: '7rem !important',
                            '.remirror-theme .ProseMirror': {
                              bg: 'gray.200',
                              pl: '9rem !important',
                              pr: '9rem !important',
                              pt: '7rem !important',
                              p: 'gray.1200',
                              'p mark': {
                                background: 'transparent !important',
                                color: 'gray.1200',
                              },
                            },
                          }}>
                          <PreTag pt={0} pb={6}>
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
                      </ErrorBoundary>
                    </TabPanel>
                    <TabPanel>
                      <Box
                        sx={{
                          bg: 'gray.400',
                          // bg: 'neutral.200',
                          mt: 4,
                          // width: '100%',
                          // bg: 'red',
                          border: 'solid 1px',
                          borderColor: 'gray.400',
                          '.react-pdf__Document': {
                            mx: 2,
                          },
                          '.pdf__Page__textContent': {
                            border: 'solid 1px',
                            borderColor: 'grey.500',
                          },
                          pb: 5,
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
                  // position: 'fixed',
                  right: 0,
                  // display: 'none',
                  // bg: 'neutral.100',
                  bg: 'gray.100',
                  py: 0,
                  width: '100%',
                  borderLeft: 'solid 1px',
                  borderColor: 'border',
                  minHeight: '100vh',
                  pt: 3,
                }}>
                <ContentSidebar content={contents} nextState={nextState} />

                <Box
                  variant="plateSide"
                  sx={{
                    bg: 'gray.100',
                    // pl: 3,
                    flexGrow: 1,
                    mr: 0,
                    // pr: 3,
                    // pb: 3,
                    // pt: 2,
                    // borderTop: 'solid 1px',
                    // borderBottom: 'solid 1px',
                    borderColor: 'gray.300',
                    // bg: '#d9deda57',
                  }}>
                  {/* <Flex
                    sx={{
                      pt: 3,
                      px: 3,
                      alignItems: 'flex-start',
                      alignContent: 'flex-start',
                      flexDirection: 'row',
                      // border: 'solid 1px #ddd',
                    }}>
                    {eligibleUser && (
                      <Box sx={{ ml: 'auto' }}>
                        <MenuItem
                          variant="btnMenu"
                          href={`/content/edit/[id]`}
                          path={`/content/edit/${contents.content.id}`}>
                          <EditIcon width={24} />
                        </MenuItem>
                      </Box>
                    )}
                  </Flex> */}
                  {/* <Box
                    sx={{
                      // pt: 3,
                      // px: 3,
                    }}>
                    <Button
                      sx={{ py: 2 }}
                      variant="btnPrimary"
                      onClick={() => doBuild()}>
                      <>
                        {loading && <Spinner color="white" size={24} />}
                        {!loading && (
                          <Text sx={{ fontSize: 'sm', fontWeight: 600, p: 3 }}>
                            Build
                          </Text>
                        )}
                      </>
                    </Button>
                  </Box> */}
                </Box>

                <Box>
                  <TabProvider
                    setSelectedId={setTabActiveId}
                    defaultSelectedId={defaultSelectedId}>
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
                      <Tab className={styles.tabInline} id="approval">
                        Log
                      </Tab>
                    </TabList>

                    <TabPanel tabId={defaultSelectedId} className="tabPanel">
                      <Box sx={{ bg: 'neutral.100', mb: 6, pb: 0 }}>
                        <Box variant="layout.boxHeading" sx={{ pb: 3 }}>
                          <Text
                            as="h3"
                            variant="sectionheading"
                            sx={{ mb: 0, pb: 0, color: 'gray.1000' }}>
                            Editors
                          </Text>
                          <ProfileCard
                            time={contents.content?.inserted_at}
                            name={contents.creator?.name}
                            image={contents?.profile_pic}
                          />
                        </Box>
                        {contents &&
                          !nextState?.is_user_eligible &&
                          !isMakeCompete &&
                          !isEditable && (
                            <Box
                              variant="layout.boxHeading"
                              sx={{ pb: 3, borderTop: 'none' }}>
                              <Text
                                as="h3"
                                variant="sectionheading"
                                sx={{ mb: 0, pb: 0, color: 'gray.1000' }}>
                                Waiting for approval
                              </Text>
                              {nextState &&
                                nextState.approvers &&
                                nextState.approvers.map((approver: any) => (
                                  <ProfileCard
                                    key={approver.id}
                                    // time={contents.content?.inserted_at}
                                    name={approver.name}
                                    image={approver.profile_pic}
                                  />
                                ))}
                            </Box>
                          )}
                        <Box sx={{ pt: 2, px: 3, border: 0 }}>
                          <Text
                            as="h3"
                            variant="sectionheading"
                            sx={{ mb: 0, pb: 0, color: 'gray.1000' }}>
                            Document
                          </Text>
                          <Box>
                            {contents.content.build && (
                              <Flex pt={0} pb={3}>
                                <Box>
                                  <Box>
                                    <Text
                                      as="h3"
                                      sx={{
                                        fontSize: 'sm',
                                        mb: 0,
                                        color: 'text',
                                      }}>
                                      {contents.content.instance_id}
                                      <Text
                                        as="span"
                                        sx={{ ml: 2, fontWeight: 400 }}>
                                        v
                                        {contents.versions[0]?.version_number ??
                                          ''}
                                      </Text>
                                    </Text>
                                    <Text
                                      as="h4"
                                      sx={{
                                        fontSize: '14px',
                                        mb: 0,
                                        pb: 0,
                                        mt: 1,
                                        color: 'gray.700',
                                        fontWeight: 500,
                                        ml: 0,
                                      }}>
                                      <Flex as="span">
                                        {/* <Text sx={{ mr: 2 }}>Updated </Text> */}
                                        {contents.versions.length && (
                                          <TimeAgo
                                            time={
                                              contents?.versions[0]?.updated_at
                                            }
                                          />
                                        )}
                                      </Flex>
                                    </Text>
                                  </Box>
                                </Box>
                                <Box sx={{ ml: 'auto' }}>
                                  <Link
                                    // variant="download"
                                    sx={{
                                      bg: 'gray.000',
                                      borderRadius: '6px',
                                      border: 'solid 1px',
                                      borderColor: 'border',
                                      px: 3,
                                      py: 2,
                                    }}
                                    href={`${contents.content.build}`}
                                    target="_blank">
                                    <DownloadSimple width={20} />
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
                          <Box
                            variant="layout.boxHeading"
                            sx={{ pb: 1, borderBottom: 0 }}>
                            <Text
                              as="h3"
                              sx={{ fontSize: 'sm', fontWeight: 600 }}>
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
                                <Text sx={{ fontSize: 'xs', fontWeight: 500 }}>
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
                    <TabPanel>
                      <Box variant="layout.boxHeading" sx={{ pb: 2 }}>
                        <Text sx={{ fontSize: 'xs', color: 'gray.900' }}>
                          Approval Log
                        </Text>
                      </Box>
                      <Box>
                        {tabActiveId === 'approval' && (
                          <ApprovalFlowHistory id={cId} />
                        )}
                      </Box>
                    </TabPanel>
                  </TabProvider>
                </Box>
              </Box>
            </Flex>
          )}
        </ErrorBoundary>
      </Box>
      <Modal isOpen={open}>
        {/* {
          <ConfirmDelete
            title="Confirm action"
            text={`Are you sure you want send to ${nextState?.state}?`}
            setOpen={setOpen}
            onConfirmDelete={() => {
              setOpen(false);
            }}
          />
        } */}
        <Flex
          sx={{
            flexDirection: 'column',
            width: '372px',
            height: '225px',
            border: '1px solid #E4E9EF',
            background: '#FFF',
            // alignItems: 'center',
            alignItems: 'flex-start',
            // align-items: flex-start;
            justifyContent: 'space-evenly',
          }}>
          <Box
            sx={{
              px: 3,
              py: 2,
              borderColor: 'border',
              width: '100%',
              borderBottom: 'solid 1px #ddd',
              mb: 2,
            }}>
            <Text
              as="p"
              variant="h5Medium"
              sx={{ textAlign: 'left', fontSize: '15px' }}>
              Confirm action
            </Text>
          </Box>
          <Text
            sx={{
              px: 4,
              mb: 2,
              marginTop: '5px',
              // mb: '5px',
              textAlign: 'left',
              fontWeight: 'heading',
              color: 'gray.900',
            }}>
            {modalAction === 'next'
              ? `Confirm to send current content to ${nextState?.state} stage ?`
              : `Are you sure you want to send back to ${prevState?.state}?`}{' '}
          </Text>
          <Box as="form" py={1} mt={0} sx={{ display: 'none' }}>
            <Box mx={0} mb={2} sx={{ width: '350px' }}>
              <Field name="body" label="" defaultValue="" register={register} />
            </Box>
          </Box>
          <Flex
            sx={{
              gap: '12px',
              px: 3,
              py: 3,
              mt: 3,
              // borderColor: '#eee',
              borderTop: 'solid 1px #ddd',
              width: '100%',
            }}>
            <Button onClick={handleModalAction} sx={{}}>
              Confirm
            </Button>
            <Button
              variant="btnSecondary"
              onClick={() => setOpen(false)}
              sx={{ bg: 'red', color: 'gray.1100', fontWeight: 'bold' }}>
              Cancel
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </Box>
  );
};
export default ContentDetail;
