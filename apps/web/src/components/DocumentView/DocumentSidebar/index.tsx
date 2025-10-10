import { useEffect } from 'react';
import { Box, Flex, Text, Tab, useTab } from '@wraft/ui';

import ApprovalFlowHistory from 'components/Content/ApprovalFlowHistory';
import { TimeAgo } from 'common/Atoms';

import { useDocument } from '../DocumentContext';
import { InfoSection } from './InfoSection';
import { ContentInfoBlock } from './ContentInfoBlock';
import CommentForm from './Comment/CommentForm';
import { usePermissions } from '../usePermissions';
import SignerBlock from './Signers';

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

  const tab = useTab({
    defaultSelectedId: docRole === 'signer' ? 'signers' : 'overview',
  });
  const selectedId = tab.useState('selectedId');

  useEffect(() => {
    if (selectedId) {
      setTabActiveId(selectedId);
    }
  }, [selectedId]);
  return (
    <Flex
      direction="column"
      bg="background-primary"
      // w="30%"
      // maxWidth="400px"
      borderLeft="solid 1px"
      borderColor="border">
      <Box flexShrink="0">
        <ContentInfoBlock
          content={contents}
          nextState={nextState}
          contentType={contentType}
        />
      </Box>

      {docRole === 'signer' && (
        <Box mt="md" px="md">
          <SignerBlock />
        </Box>
      )}

      {docRole !== 'signer' && (
        <Box>
          <Tab.List aria-label="Content Tab" store={tab}>
            {canAccess('overview') && (
              <Tab id="overview" store={tab}>
                Overview
              </Tab>
            )}

            {canAccess('comment') && (
              <Tab id="discussions" store={tab}>
                Discussions
              </Tab>
            )}
            {canAccess('history') && (
              <Tab id="versions" store={tab}>
                Versions
              </Tab>
            )}
            {canAccess('log') && (
              <Tab id="log" store={tab}>
                Log
              </Tab>
            )}
            {canAccess('sign') && (
              <Tab id="signers" store={tab}>
                Signers
              </Tab>
            )}
          </Tab.List>

          <Box h="calc(100vh - 142px)" overflowY="auto">
            {canAccess('overview') && (
              <Tab.Panel tabId="overview" store={tab}>
                <InfoSection />
              </Tab.Panel>
            )}
            {canAccess('comment') && (
              <Tab.Panel tabId="discussions" store={tab}>
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
              </Tab.Panel>
            )}
            {canAccess('history') && (
              <Tab.Panel tabId="versions" store={tab}>
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
              </Tab.Panel>
            )}
            {canAccess('log') && (
              <Tab.Panel tabId="log" store={tab}>
                <Box mt="md" px="md">
                  <Box>
                    {tabActiveId === 'log' && <ApprovalFlowHistory id={cId} />}
                  </Box>
                </Box>
              </Tab.Panel>
            )}
            {canAccess('sign') && (
              <Tab.Panel tabId="signers" store={tab}>
                <Box mt="md" px="md">
                  <SignerBlock />
                </Box>
              </Tab.Panel>
            )}
          </Box>
        </Box>
      )}
    </Flex>
  );
};
