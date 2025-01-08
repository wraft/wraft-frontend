import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Box, Flex } from 'theme-ui';
import { ErrorBoundary, Button, Modal } from '@wraft/ui';
import { useForm } from 'react-hook-form';

import Nav from 'components/NavEdit';
import Field from 'common/Field';
import { postAPI, putAPI } from 'utils/models';

import { FlowProgressBar } from './FlowProgressBar';
import { ApprovalAwaitingLabel } from './ApprovalAwaitingLabel';
import { ApprovalHandler } from './ApprovalHandler';
import { LockedBadge } from './LockedBadge';
import { DocumentSidebar } from './DocumentSidebar';
import { useDocument } from './DocumentContext';
import { ApprovalUpdateModal } from './ApprovalUpdateModal';
import { DocumentContentBlock } from './DocumentContentBlock';

const DocumentView = () => {
  const {
    contents,
    loading,
    nextState,
    states,
    isEditable,
    currentActiveIndex,
    isMakeCompete,
    editorMode,
    editorRef,
    pageTitle,
    contentType,
    fieldValues,
    userMode,
    setPageTitle,
    setContentBody,
    fetchContentDetails,
  } = useDocument();

  const [open, setOpen] = useState<boolean>(false);
  const [openTitleModal, setOpenTitleModal] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<'next' | 'prev' | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();

  const cId: string = router.query.id as string;

  useEffect(() => {
    if (pageTitle) {
      setValue('title', pageTitle);
    }
  }, [pageTitle]);

  const onSubmit = () => {
    const obj: any = {};

    const markdownContent = editorRef.current?.helpers?.getMarkdown();
    const jsonContent = editorRef.current?.helpers?.getJSON();

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
    };

    if (editorMode === 'edit') {
      putAPI(`contents/${cId}`, template).then((response: any) => {
        onCreateSuccess(response);
        setSaving(false);
        setContentBody(jsonContent);
      });
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
      <Box py={0} sx={{ minHeight: '100vh' }}>
        {!loading && pageTitle && (
          <Nav
            navtitle={pageTitle}
            isEdit={editorMode !== 'view'}
            onToggleEdit={() => setOpenTitleModal(true)}
          />
        )}
        <Box>
          <ErrorBoundary>
            <Flex sx={{ bg: 'gray.400' }}>
              <Box sx={{ width: '70%', m: 0 }}>
                {userMode === 'default' && (
                  <Flex
                    sx={{
                      alignItems: 'center',
                      flex: 1,
                      px: 3,
                      py: 2,
                      borderBottom: 'solid 1px',
                      borderColor: 'border',
                      bg: 'background-secondary',
                    }}>
                    <Flex
                      variant="styles.scrollbarX"
                      sx={{
                        pt: 1,
                        alignItems: 'center',
                        bg: 'white',
                        border: 'solid 1px',
                        borderColor: 'gray.300',
                        px: 2,
                        borderRadius: '9px',
                      }}>
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

                      {contents &&
                        !nextState?.is_user_eligible &&
                        !isMakeCompete &&
                        !isEditable && <ApprovalAwaitingLabel />}
                    </Flex>

                    <Flex sx={{ ml: 'auto', alignItems: 'center' }}>
                      {editorMode === 'view' &&
                        !contents?.content?.approval_status && (
                          <Flex
                            sx={{
                              p: 0,
                              gap: 2,
                              ml: 'auto',
                              alignItems: 'center',
                            }}>
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
                    {(editorMode === 'edit' || editorMode === 'new') && (
                      <Box sx={{ ml: 'auto' }}>
                        <Button
                          onClick={onSubmit}
                          variant="primary"
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
            </Flex>
          </ErrorBoundary>
        </Box>
        <ApprovalUpdateModal
          state={modalAction}
          success={() => fetchContentDetails(cId)}
          open={open}
          setOpen={setOpen}
        />
      </Box>

      <Modal
        open={openTitleModal}
        ariaLabel="confirm model"
        onClose={() => setOpenTitleModal(false)}>
        <Box
          as="form"
          onSubmit={handleSubmit(onUpdateTitle)}
          sx={{ width: '450px' }}>
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
          <Flex sx={{ gap: '8px' }}>
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
