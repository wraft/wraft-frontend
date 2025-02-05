import { Box, Flex, Text } from '@wraft/ui';
import { Tab, TabList, TabPanel, TabProvider } from '@ariakit/react';

import ApprovalFlowHistory from 'components/Content/ApprovalFlowHistory';
import { TimeAgo } from 'common/Atoms';
import styles from 'common/Tab/tab.module.css';

import { useDocument } from '../DocumentContext';
import { InfoSection } from './InfoSection';
import { ContentInfoBlock } from './ContentInfoBlock';
import CommentForm from './Comment/CommentForm';
import { usePermissions } from '../usePermissions';

export const DocumentSidebar = () => {
  const {
    contents,
    nextState,
    cId,
    tabActiveId,
    setTabActiveId,
    contentType,
    userType,
    docRole,
  } = useDocument();

  const { canAccess } = usePermissions(userType, docRole);

  return (
    <Box
      bg="background-primary"
      w="30%"
      maxWidth="400px"
      borderLeft="solid 1px"
      borderColor="border">
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

            {canAccess('comment') && (
              <Tab className={styles.tabInline} id="view">
                Comments
              </Tab>
            )}
            {canAccess('history') && (
              <Tab className={styles.tabInline} id="history">
                History
              </Tab>
            )}
            {canAccess('log') && (
              <Tab className={styles.tabInline} id="approval">
                Log
              </Tab>
            )}
          </TabList>

          <TabPanel className="tabPanel">
            <InfoSection />
          </TabPanel>
          {canAccess('comment') && (
            <TabPanel>
              <Box mt="md" px="md">
                <Box>
                  <Box mb="sm">
                    <Text as="h3">Discussions</Text>
                  </Box>

                  {contents && contents.content && (
                    <CommentForm
                      master={contents.content_type.id}
                      master_id={contents.content.id}
                    />
                  )}
                </Box>
              </Box>
            </TabPanel>
          )}
          {canAccess('history') && (
            <TabPanel>
              <Box mt="md" px="md">
                {contents?.versions && contents?.versions.length > 0 && (
                  <Box>
                    {contents.versions.map((v: any) => (
                      <Flex key={v?.id} justify="space-between" py="sm">
                        <Text>Version {v?.version_number}</Text>
                        <Box>
                          <TimeAgo time={v?.updated_at} />
                        </Box>
                      </Flex>
                    ))}
                  </Box>
                )}
              </Box>
            </TabPanel>
          )}
          {canAccess('log') && (
            <TabPanel>
              <Box mt="md" px="md">
                <Text as="h5" mb="sm">
                  Approval Log
                </Text>
                <Box>
                  {tabActiveId === 'approval' && (
                    <ApprovalFlowHistory id={cId} />
                  )}
                </Box>
              </Box>
            </TabPanel>
          )}
        </TabProvider>
      </Box>
    </Box>
  );
};
