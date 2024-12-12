import { Box, Flex, Text } from 'theme-ui';
import { Tab, TabList, TabPanel, TabProvider } from '@ariakit/react';

import ApprovalFlowHistory from 'components/Content/ApprovalFlowHistory';
import CommentForm from 'components/CommentForm';
import { TimeAgo } from 'common/Atoms';
import styles from 'common/Tab/tab.module.css';

import { useDocument } from '../DocumentContext';
import { InfoSection } from './InfoSection';
import { ContentInfoBlock } from './ContentInfoBlock';

export const DocumentSidebar = () => {
  const {
    contents,
    nextState,
    cId,
    tabActiveId,
    setTabActiveId,
    contentType,
    editorMode,
  } = useDocument();

  return (
    <Box
      variant="plateRightBar"
      sx={{
        right: 0,
        bg: 'gray.100',
        py: 0,
        width: '30%',
        borderLeft: 'solid 1px',
        borderColor: 'border',
        minHeight: '100vh',
        pt: 2,
      }}>
      <ContentInfoBlock
        content={contents}
        nextState={nextState}
        contentType={contentType}
      />

      <Box>
        <TabProvider setSelectedId={setTabActiveId} defaultSelectedId="edit">
          <TabList aria-label="Content Stages" className={styles.tablist}>
            <Tab id="edit" className={styles.tabInline}>
              Info
            </Tab>
            {editorMode !== 'new' && (
              <>
                <Tab className={styles.tabInline} id="view">
                  Discuss
                </Tab>
                <Tab className={styles.tabInline} id="history">
                  History
                </Tab>
                <Tab className={styles.tabInline} id="approval">
                  Log
                </Tab>
              </>
            )}
          </TabList>

          <TabPanel className="tabPanel">
            <InfoSection />
          </TabPanel>
          <TabPanel>
            <Box sx={{ bg: 'neutral.100' }}>
              <Box sx={{ pb: 3 }}>
                <Box
                  variant="layout.boxHeading"
                  sx={{ pb: 1, borderBottom: 0 }}>
                  <Text as="h3" sx={{ fontSize: 'sm', fontWeight: 600 }}>
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
              {contents?.versions && contents?.versions.length > 0 && (
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
              {tabActiveId === 'approval' && <ApprovalFlowHistory id={cId} />}
            </Box>
          </TabPanel>
        </TabProvider>
      </Box>
    </Box>
  );
};
