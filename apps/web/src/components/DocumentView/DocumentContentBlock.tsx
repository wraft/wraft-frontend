import React, { useState } from 'react';
import { Box, Flex, Text } from '@wraft/ui';
import { ErrorBoundary, Button } from '@wraft/ui';
import styled from '@emotion/styled';
import {
  Tab,
  TabList,
  TabPanel,
  TabProvider,
  useTabStore,
} from '@ariakit/react';
import { Play, PencilSimple, Eye } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { LiveEditor } from '@wraft/editor';
import { EditorView } from 'prosemirror-view';

import PdfViewer from 'common/PdfViewer';
import Editor from 'common/Editor';
import styles from 'common/Tab/tab.module.css';
import { useAuth } from 'contexts/AuthContext';
import { postAPI } from 'utils/models';

import { useDocument } from './DocumentContext';
import AwarenessUsers from './AwarenessUsers';
import { EditorMode, usePermissions } from './usePermissions';

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
    // flex: 1,
    // borderRight: `solid 1px`,
    // borderColor: 'border',
    // p: 0,
    // '&:last-child': { borderRight: 0 },
    >
      {no && (
        <NumberBlock
          no={no}
          active={tab.selectedId === 'view' ? true : false}
        />
      )}
      <Box>
        <Text
          as="h5"
          // fontFamily: 'body',

          //   color: 'text-primary',
          //   mb: 0,
        >
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
    // bg: 'neutral.200',
    //     textAlign: 'center',
    //     mr: 2,
    //     // mt: `-7px`,
    //     pb: `3px`,
    //     pt: `2px`,
    //     color: `text`,
    //     display: `block`,
    //     verticalAlign: 'middle',
    //     borderRadius: '99rem',
    //     border: 'solid 1px',
    //     borderColor: activeBorder,
    //     width: size?.wh,
    //     height: size?.wh,
    >
      <Text
        as="span"
        // lineHeight: 'auto',
        // m: 0,
        // p: 0,
        // fontSize: size?.fontSize,
      >
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

const TabWrapper = styled(Box)`
  margin-bottom: 0;

  [role='tabpanel'] {
    padding: 0px;
  }

  .tabPanel {
    border: 0;
    border: 1px solid;
    border-color: ${({ theme }: any) => theme?.colors.border};
    background-color: ${({ theme }: any) => theme?.colors.gray['400']};

    button {
      border: 0;
      background-color: transparent;
      padding: ${({ theme }: any) => theme.space.xs};
      border-radius: 6px;
    }

    button[aria-selected='true'] {
      border: 0;
      background-color: ${({ theme }: any) =>
        theme?.colors['background-secondary']};
    }
  }

  .tabGroup {
    background-color: ${({ theme }: any) => theme.colors.gray['600']};
    display: flex;
    border-radius: 6px;
  }
  .main-content {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    overflow-y: auto;
    max-height: calc(100vh - 150px);
  }
`;

const PdfWrapper = styled(Box)`
  .react-pdf__Page {
    background-color: transparent !important;
    margin-bottom: 8px;
  }

  .react-pdf__Document {
    margin-inline: 2px;
  }
  .pdf__Page__textContent {
    border: solid 1px;
    border-color: border;
  }
`;

export const DocumentContentBlock = () => {
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const {
    cId,
    contents,
    isEditable,
    editorMode,
    docRole,
    userType,
    editorRef,
    contentBody,
    fieldTokens,
    setEditorMode,
    fetchContentDetails,
  } = useDocument();

  const { canAccess } = usePermissions(userType, docRole);

  const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  const { userProfile } = useAuth();
  const tabView = useTabStore();
  const { activeId } = tabView.useState();

  const defaultSelectedId = 'edit';

  const collabData = {
    user: {
      id: userProfile?.id || null,
      name: userProfile?.name || null,
    },
    roomId: cId,
    // roomId: `editor-${cId}`,
    documentId: cId,
  };

  const onSwitchEditorMode = (mode: EditorMode) => {
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
          <Flex
            mt="lg"
            flexGrow={1}
            justify="center"
            overflowY="auto"
            maxHeight="calc(100vh - 180px)">
            <Box minWidth="794px" maxWidth="920px">
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
          </Flex>
        </ErrorBoundary>
      ) : (
        <TabWrapper>
          <TabProvider defaultSelectedId={defaultSelectedId}>
            <Flex justify="space-between" p="md">
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
              <Flex align="center" gap="sm">
                <AwarenessUsers />
                {!isEditable && (
                  <Flex gap="xs">
                    {canAccess('docGenerator') && (
                      <Button
                        variant="secondary"
                        loading={isBuilding}
                        size="sm"
                        onClick={() => doBuild()}>
                        <Play size={14} className="action" />
                        <Box>Generate</Box>
                      </Button>
                    )}
                    {canAccess('docEdit') && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onSwitchEditorMode(editorMode)}>
                        {editorMode === 'edit' ? (
                          <Eye size={14} className="icon" />
                        ) : (
                          <PencilSimple size={14} className="icon" />
                        )}

                        <Box>{editorMode === 'edit' ? 'View' : 'Edit'}</Box>
                      </Button>
                    )}
                  </Flex>
                )}
              </Flex>
            </Flex>

            <TabPanel
              tabId={defaultSelectedId}
              store={tabView}
              className="main-content">
              <ErrorBoundary>
                <Flex>
                  <Box minWidth="794px" maxWidth="920px">
                    <PreTag pt={0} pb={6}>
                      {contentBody && (
                        <LiveEditor
                          defaultContent={contentBody}
                          isReadonly={editorMode === 'view'}
                          ref={editorRef}
                          tokens={fieldTokens}
                          isCollaborative={true}
                          collabData={collabData}
                          socketUrl={socketUrl}
                        />
                      )}

                      {/* {contentBody && (
                        <Editor
                          defaultContent={contentBody}
                          isReadonly={editorMode === 'view'}
                          ref={editorRef}
                          tokens={fieldTokens}
                          isCollaborative={true}
                          collabData={collabData}
                        />
                      )} */}
                    </PreTag>
                  </Box>
                </Flex>
              </ErrorBoundary>
            </TabPanel>
            <TabPanel store={tabView} className="main-content">
              <PdfWrapper>
                {!contents?.content?.build && (
                  <Box
                  // px: 6, minHeight: '80vh'
                  >
                    <Box
                    //  px: 4,
                    //  py: 3,
                    //  border: 'solid 1px',
                    //  borderColor: 'gray.500',
                    //  bg: 'gray.300',
                    //  borderRadius: '6px',
                    >
                      <Text as="h4">Document not generated</Text>
                      <Text as="p">Documents need to be generated</Text>
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
              </PdfWrapper>
            </TabPanel>
          </TabProvider>
        </TabWrapper>
      )}
    </>
  );
};
