import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ErrorBoundary, Button, Modal, Box, Flex, Grid } from '@wraft/ui';
import { useForm } from 'react-hook-form';

import Field from 'common/Field';
import Nav from 'common/NavEdit';

import { ApprovalAwaitingLabel } from './ApprovalAwaitingLabel';
import { ApprovalHandler } from './ApprovalHandler';
import { LockedBadge } from './LockedBadge';
import { DocumentSidebar } from './DocumentSidebar';
import { useDocument } from './DocumentContext';
import { ApprovalUpdateModal } from './ApprovalUpdateModal';
import { DocumentContentBlock } from './DocumentContentBlock';
import { usePermissions } from './usePermissions';
import FlowProgressBar, { FlowContainer } from './StepTwo';

const DocumentView = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openTitleModal, setOpenTitleModal] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<'next' | 'prev' | null>(null);

  const {
    contents,
    loading,
    nextState,
    isEditable,
    currentActiveIndex,
    isMakeCompete,
    editorMode,
    docRole,
    saving,
    pageTitle,
    userType,
    states,
    setPageTitle,
    fetchContentDetails,
    onDocumentSubmit,
  } = useDocument();

  const { canAccess } = usePermissions(userType, docRole);

  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();

  const cId: string = router.query.id as string;

  useEffect(() => {
    if (pageTitle) {
      setValue('title', pageTitle);
    }
  }, [pageTitle]);

  const onUpdateTitle = (data: any) => {
    setPageTitle(data.title);
    setOpenTitleModal(!openTitleModal);
  };

  return (
    <>
      <Nav
        navtitle={pageTitle}
        isEdit={editorMode !== 'view'}
        onToggleEdit={() => setOpenTitleModal(true)}
        loading={loading}
      />
      <>
        <ErrorBoundary>
          <Grid
            bg="background-secondary"
            templateColumns="1fr minmax(380px, 400px)">
            <Box w="100%">
              {canAccess('toolbar') && (
                <Flex
                  alignItems="center"
                  flex={1}
                  px="sm"
                  py="sm"
                  minH="40px"
                  borderBottom="solid 1px"
                  borderColor="border"
                  bg="background-primary">
                  <FlowContainer>
                    {states &&
                      states.map((state: any, i: number) => (
                        <FlowProgressBar
                          key={state?.id}
                          num={i + 1}
                          state={state?.state}
                          order={state?.order}
                          currentActiveIndex={currentActiveIndex}
                          nextState={nextState}
                          id={state?.id}
                        />
                      ))}

                    {!loading &&
                      contents &&
                      states &&
                      !nextState?.is_user_eligible &&
                      !isMakeCompete &&
                      !isEditable && <ApprovalAwaitingLabel />}
                  </FlowContainer>

                  <Flex ml="auto" alignItems="center">
                    {editorMode === 'view' &&
                      !contents?.content?.approval_status && (
                        <Flex p={0} gap={2} ml="auto" alignItems="center">
                          {nextState && nextState.is_user_eligible && (
                            <ApprovalHandler
                              name={nextState?.state}
                              onClick={() => {
                                setModalAction('next');
                                setOpen(true);
                              }}
                            />
                          )}
                          {isMakeCompete && (
                            <ApprovalHandler
                              name="Mark Complete"
                              onClick={() => {
                                setModalAction('next');
                                setOpen(true);
                              }}
                            />
                          )}
                        </Flex>
                      )}
                    {isEditable && <LockedBadge />}
                  </Flex>
                  {/* {canAccess('docEdit') && ( */}
                  {(editorMode === 'edit' || editorMode === 'new') && (
                    <Box ml="auto">
                      <Button
                        onClick={() => onDocumentSubmit()}
                        variant="primary"
                        size="sm"
                        loading={saving}>
                        Save
                      </Button>
                    </Box>
                  )}
                </Flex>
              )}

              <DocumentContentBlock />
            </Box>
            <DocumentSidebar />
          </Grid>
        </ErrorBoundary>
      </>
      <ApprovalUpdateModal
        state={modalAction}
        success={() => fetchContentDetails(cId)}
        open={open}
        setOpen={setOpen}
      />

      <Modal
        open={openTitleModal}
        ariaLabel="confirm model"
        onClose={() => setOpenTitleModal(false)}>
        <Box as="form" onSubmit={handleSubmit(onUpdateTitle)} w="450px">
          <Modal.Header>Title</Modal.Header>
          <Box my={3}>
            <Field
              name="title"
              label=""
              placeholder="Document Name"
              register={register}
              defaultValue={pageTitle}
            />
          </Box>
          <Flex gap="8px">
            <Button
              variant="secondary"
              onClick={() => setOpenTitleModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
};
export default DocumentView;
