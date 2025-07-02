import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ErrorBoundary, Button, Modal, Box, Flex, Grid } from '@wraft/ui';
import { useForm } from 'react-hook-form';

import Field from 'common/Field';
import Nav from 'common/NavEdit';
import { StateProgress } from 'common/StateProgress';
import { postAPI } from 'utils/models';

import { ApprovalAwaitingLabel } from './ApprovalAwaitingLabel';
import { ApprovalHandler } from './ApprovalHandler';
import { LockedBadge } from './LockedBadge';
import { DocumentSidebar } from './DocumentSidebar';
import { useDocument } from './DocumentContext';
import { ApprovalUpdateModal } from './ApprovalUpdateModal';
import { DocumentContentBlock } from './DocumentContentBlock';
import { usePermissions } from './usePermissions';
import apiService from './APIModel';

export const SAVE_INTERVAL = 15000;

const DocumentView = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openTitleModal, setOpenTitleModal] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<'next' | 'prev' | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const {
    contents,
    loading,
    nextState,
    isEditable,
    currentActiveIndex,
    isMakeCompete,
    editorMode,
    docRole,
    editorRef,
    pageTitle,
    contentType,
    fieldValues,
    userType,
    lastSavedContent,
    meta,
    token,
    setPageTitle,
    setContentBody,
    fetchContentDetails,
  } = useDocument();

  const { canAccess } = usePermissions(userType, docRole);

  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();

  const cId: string = router.query.id as string;

  useEffect(() => {
    // let autosaveInterval: any;

    // if (editorMode !== 'editor' && autosaveInterval) {
    //   clearInterval(autosaveInterval);
    // }

    if (editorRef.current == null && editorMode !== 'edit') {
      return;
    }

    // Autosave interval
    const autosaveInterval = setInterval(() => {
      // checkContentChange();
    }, SAVE_INTERVAL);

    return () => {
      clearInterval(autosaveInterval);
    };
  }, [editorRef.current, editorMode]);

  useEffect(() => {
    if (pageTitle) {
      setValue('title', pageTitle);
    }

    // return () => {
    //   console.log('its working');
    //   if (editorMode === 'editor') {
    //     checkContentChange();
    //   }
    // };
  }, [pageTitle]);

  const onSubmit = async () => {
    const obj: any = {};

    const markdownContent = editorRef.current?.helpers?.getMarkdown();
    const jsonContent = editorRef.current?.helpers?.getJSON();

    // return;

    // setUnsavedChanges(false);

    setSaving(true);

    const serials: any = {
      ...obj,
      title: pageTitle || 'welcome',
      body: markdownContent,
      serialized: JSON.stringify(jsonContent),
      fields: fieldValues ? JSON.stringify(fieldValues) : '',
    };

    const template = {
      serialized: serials,
      raw: markdownContent,
      meta: meta || null,
    };

    if (editorMode === 'edit') {
      apiService
        .put(`contents/${cId}`, template, token)
        .then((response: any) => {
          lastSavedContent.current = serials.serialized;
          onCreateSuccess(response);
          setSaving(false);
          setContentBody(jsonContent);
        })
        .catch(() => {
          setSaving(false);
        });
      // apiService;
      // putAPI(`contents/${cId}`, template).then((response: any) => {
      //   lastSavedContent.current = serials.serialized;
      //   onCreateSuccess(response);
      //   setSaving(false);
      //   setContentBody(jsonContent);
      // });
    }
    if (editorMode === 'new') {
      postAPI(`content_types/${contentType?.id}/contents`, template)
        .then((response: any) => {
          setContentBody(jsonContent);
          if (response?.info) {
            toast.success('Build Failed', {
              duration: 1000,
              position: 'top-right',
            });
            setSaving(false);
          }

          if (response?.content?.id) {
            toast.success('Saved Successfully', {
              duration: 1000,
              position: 'top-right',
            });
            router.replace(`/documents/${response.content.id}`);
            setSaving(false);
          }
        })
        .catch((error) => {
          setSaving(false);
          toast.error(
            error?.message || 'Something went wrong please try again later',
            {
              duration: 3000,
              position: 'top-right',
            },
          );
        });
    }
  };

  const onCreateSuccess = (data: any) => {
    if (data?.content?.id) {
      toast.success('Saved Successfully', {
        duration: 1000,
        position: 'top-right',
      });
      router.replace(`/documents/${data.content.id}`);
    }
  };

  const onUpdateTitle = (data: any) => {
    setPageTitle(data.title);
    setOpenTitleModal(!openTitleModal);
  };

  return (
    <>
      {!loading && pageTitle && (
        <Nav
          navtitle={pageTitle}
          isEdit={editorMode !== 'view'}
          onToggleEdit={() => setOpenTitleModal(true)}
        />
      )}
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
                  borderBottom="solid 1px"
                  borderColor="border"
                  bg="background-primary">
                  <Flex gap="sm">
                    {contents?.flow?.states && (
                      <StateProgress
                        states={contents.flow.states}
                        activeStateId={contents.state?.id}
                        completedStateIds={
                          contents.flow.states
                            ?.filter(
                              (s: any) =>
                                s.order < (contents.state?.order || 0),
                            )
                            ?.map((s: any) => s.id) || []
                        }
                        currentActiveIndex={currentActiveIndex}
                        nextState={nextState}
                      />
                    )}

                    {contents &&
                      !nextState?.is_user_eligible &&
                      !isMakeCompete &&
                      !isEditable && <ApprovalAwaitingLabel />}
                  </Flex>

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
                        onClick={onSubmit}
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
