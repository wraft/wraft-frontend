import React, { useState } from 'react';
import { Box, Flex, Text } from 'theme-ui';
import { ErrorBoundary, Button } from '@wraft/ui';
import styled from '@emotion/styled';
import {
  Tab,
  TabList,
  TabPanel,
  TabProvider,
  useTabStore,
} from '@ariakit/react';
import { Play, PencilSimple, Eyes, Eye } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
// import { LiveEditor } from '@wraft/editor';
import { EditorView } from 'prosemirror-view';

import PdfViewer from 'components/PdfViewer';
import Editor from 'common/Editor';
import styles from 'common/Tab/tab.module.css';
import { useAuth } from 'contexts/AuthContext';
import { postAPI } from 'utils/models';

import { useDocument } from './DocumentContext';

// This prevents the matchesNode error on hot reloads
EditorView.prototype.updateState = function updateState(state) {
  if (!this.docView) return;
  this.updateStateInner(state, this.state.plugins !== state.plugins);
};

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
            color: 'text-primary',
            mb: 0,
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

const PreTag = styled(Box)`
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word;
`;

export const DocumentContentBlock = () => {
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const {
    cId,
    contents,
    isEditable,
    editorMode,
    editorRef,
    contentBody,
    fieldTokens,
    setEditorMode,
    fetchContentDetails,
  } = useDocument();

  const { userProfile } = useAuth();
  const tabView = useTabStore();
  const { activeId } = tabView.useState();

  const defaultSelectedId = 'edit';

  const collabData = {
    user: {
      id: userProfile?.id || null,
      name: userProfile?.name || null,
    },
    roomId: `editor-${cId}`,
    documentId: cId,
  };

  const onSwitchEditorMode = (mode: string) => {
    if (mode === 'view') {
      setEditorMode('edit');
    }

    if (mode === 'edit') {
      setEditorMode('view');
    }
  };

  const doBuild = () => {
    setIsBuilding(true);
    postAPI(`contents/${cId}/build`, [])
      .then(() => {
        setIsBuilding(false);
        fetchContentDetails(cId);

        toast.success('Build done successfully', {
          duration: 500,
          position: 'top-right',
        });
      })
      .catch(() => {
        setIsBuilding(false);
        toast.error('Build Failed');
      });
  };

  return (
    <>
      {editorMode === 'new' ? (
        <ErrorBoundary>
          <Box
            sx={{
              mt: 4,
              borderRadius: '6px',
              maxWidth: '100%',
              px: 4,
              '.remirror-theme .ProseMirror': {
                bg: 'background-secondary',
                pl: '9rem !important',
                pr: '9rem !important',
                pt: '7rem !important',
                p: 'gray.1200',
                'p mark': {
                  background: 'transparent !important',
                  color: 'text-primary',
                },
              },
            }}>
            <PreTag pt={0} pb={6}>
              {contentBody && (
                <Editor
                  defaultContent={contentBody}
                  isReadonly={false}
                  ref={editorRef}
                />
              )}
            </PreTag>
          </Box>
        </ErrorBoundary>
      ) : (
        <Box
          sx={{
            mb: 0,
            px: 2,
            py: 2,
            '.tabPanel': { border: 0, bg: 'gray.400' },
            '.tabPanel button': {
              border: 0,
              bg: 'transparent',
              px: 3,
              py: 2,
              borderRadius: '6px',
            },
            '.tabGroup': {
              bg: 'gray.a300',
              px: 2,
              py: '6px',
              display: 'flex',
              borderRadius: '6px',
            },
            '.tabPanel button[aria-selected=true]': {
              border: 0,
              bg: 'background-secondary',
              px: 3,
              py: 2,
            },
          }}>
          <TabProvider defaultSelectedId={defaultSelectedId}>
            <Flex sx={{ pt: '6px', pl: '6px' }}>
              <TabList
                store={tabView}
                aria-label="Content Stages"
                className="tabPanel tabGroup">
                <Tab id="edit">
                  <StepBlock title="Content" desc="Draft content" />
                </Tab>

                <Tab id="view">
                  <StepBlock title="Document" desc="Sign and Manage" />
                </Tab>
              </TabList>
              {!isEditable && (
                <Flex
                  sx={{
                    ml: 'auto',
                    gap: 2,
                    alignItems: 'center',
                    mr: 3,
                  }}>
                  <Button
                    variant="secondary"
                    loading={isBuilding}
                    onClick={() => doBuild()}>
                    <Play size={14} className="action" /> Generate
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => onSwitchEditorMode(editorMode)}>
                    {' '}
                    {editorMode === 'edit' ? (
                      <Eye size={14} className="icon" />
                    ) : (
                      <PencilSimple size={14} className="icon" />
                    )}
                    {editorMode === 'edit' ? 'View' : 'Edit'}
                  </Button>
                </Flex>
              )}
            </Flex>

            <TabPanel
              tabId={defaultSelectedId}
              store={tabView}
              className={styles.tablist}>
              <ErrorBoundary>
                <Box
                  sx={{
                    mt: 0,
                    borderRadius: '6px',
                    maxWidth: '100%',
                    px: 4,
                    '.remirror-theme .ProseMirror': {
                      bg: 'background-secondary',
                      pl: '9rem !important',
                      pr: '9rem !important',
                      pt: '7rem !important',
                      p: 'gray.1200',
                      'p mark': {
                        background: 'transparent !important',
                        color: 'text-primary',
                      },
                    },
                  }}>
                  <PreTag pt={0} pb={6}>
                    {/* {contentBody && (
                      <LiveEditor
                        defaultContent={contentBody}
                        isReadonly={editorMode === 'view'}
                        ref={editorRef}
                        tokens={fieldTokens}
                        isCollaborative={true}
                        collabData={collabData}
                      />
                    )} */}

                    {contentBody && (
                      <Editor
                        defaultContent={contentBody}
                        isReadonly={editorMode === 'view'}
                        ref={editorRef}
                        tokens={fieldTokens}
                        isCollaborative={true}
                        collabData={collabData}
                      />
                    )}
                  </PreTag>
                </Box>
              </ErrorBoundary>
            </TabPanel>
            <TabPanel store={tabView}>
              <Box
                sx={{
                  bg: 'gray.400',
                  mt: 4,
                  // minHeight: '100vh',
                  border: 'solid 1px',
                  borderColor: 'gray.400',
                  '.react-pdf__Page': {
                    backgroundColor: 'transparent !important',
                    marginBottom: '8px',
                  },
                  '.react-pdf__Document': {
                    mx: 2,
                  },
                  '.pdf__Page__textContent': {
                    border: 'solid 1px',
                    borderColor: 'grey.500',
                  },
                  pb: 5,
                }}>
                {!contents?.content?.build && (
                  <Box sx={{ px: 6, minHeight: '80vh' }}>
                    <Box
                      sx={{
                        px: 4,
                        py: 3,
                        border: 'solid 1px',
                        borderColor: 'gray.500',
                        bg: 'gray.300',
                        borderRadius: '6px',
                      }}>
                      <Text as="h4">Document not generated</Text>
                      <Text as="p" sx={{ color: 'gray.900' }}>
                        Documents need to be generated
                      </Text>
                      <Button
                        variant="secondary"
                        loading={isBuilding}
                        onClick={() => doBuild()}>
                        <Play size={14} className="action" />
                        Generate
                      </Button>
                    </Box>
                  </Box>
                )}

                {contents?.content?.build && (
                  <PdfViewer url={`${contents.content.build}`} pageNumber={1} />
                )}
              </Box>
            </TabPanel>
          </TabProvider>
        </Box>
      )}
    </>
  );
};
