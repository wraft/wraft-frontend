import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import toast from 'react-hot-toast';
import { Text, Box, Flex, DropdownMenu, Modal, Skeleton } from '@wraft/ui';
import { DotsThreeVerticalIcon } from '@phosphor-icons/react';

import { IconFrame } from 'common/Atoms';
import ConfirmDelete from 'common/ConfirmDelete';
import { deleteAPI, postAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';
import { ContentInstance } from 'utils/types/content';

import apiService from '../APIModel';
import { useDocument } from '../DocumentContext';
import EmailComposer from '../EmailComposer';
import InviteCollaborators from '../InviteCollaborators';
import { VersionHistoryModal } from '../versionHistory/versionHistory';
import { NameVersionModal } from '../versionHistory/nameVersionModal';

interface EditMenuProps {
  id: string;
  nextState: any;
}

/**
 * Context Menu for Delete, Edit
 * @param param0
 * @returns
 */
export const EditMenus = ({ id, nextState }: EditMenuProps) => {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isMailPopupOpen, setMailPopupOpen] = useState<boolean>(false);
  const [isNamingModalOpen, setIsNamingModalOpen] = useState<boolean>(false);
  const [isVersionHistoryOpen, setVersionHistoryOpen] =
    useState<boolean>(false);

  const { hasPermission } = usePermission();
  const {
    cId,
    contents,
    token,
    setSignerBoxes,
    setContents,
    onDocumentSubmit,
  } = useDocument();

  useEffect(() => {
    if (cId && contents && token) {
      apiService.get(`contents/${cId}/signatures`, token).then((data: any) => {
        const signatures = data.signatures;
        setSignerBoxes(signatures);
      });
    }
  }, [cId, contents]);

  const deleteContent = (contentId: string) => {
    deleteAPI(`contents/${contentId}`).then(() => {
      toast.success('Deleted a content', {
        duration: 1000,
        position: 'top-right',
      });
      Router.push('/documents');
    });
  };

  const onbuildforSigning = () => {
    toast.promise(
      postAPI(`contents/${cId}/generate_signature`, {}),
      {
        loading: 'Building for signing...',
        success: (response: any) => {
          if (contents) {
            const updatedContents: ContentInstance = {
              ...contents,
              content: {
                ...contents.content,
                signed_doc_url: response?.document_url || null,
              },
            };
            setContents(updatedContents);
          }
          setSignerBoxes(response.signatures);
          return `Build done successfully`;
        },
        error: 'Build Failed',
      },
      {
        position: 'top-right',
      },
    );
  };

  return (
    <>
      <DropdownMenu.Provider>
        <DropdownMenu.Trigger>
          <IconFrame color="icon">
            <DotsThreeVerticalIcon weight="bold" size={18} />
          </IconFrame>
        </DropdownMenu.Trigger>

        <DropdownMenu aria-label="Editor Option">
          <DropdownMenu.Item onClick={() => onbuildforSigning()}>
            Build for Signing
          </DropdownMenu.Item>
          {nextState &&
            nextState.is_user_eligible &&
            hasPermission('document', 'manage') && (
              <DropdownMenu.Item
                onClick={() => Router.push(`/documents/edit/${id}`)}>
                Edit
              </DropdownMenu.Item>
            )}

          <DropdownMenu.Item onClick={() => setIsDelete(true)}>
            Delete
          </DropdownMenu.Item>

          <DropdownMenu.Item onClick={() => setMailPopupOpen(true)}>
            Send Mail
          </DropdownMenu.Item>

          <DropdownMenu.Item onClick={() => setVersionHistoryOpen(true)}>
            Version History
          </DropdownMenu.Item>

          <DropdownMenu.Item onClick={() => setIsNamingModalOpen(true)}>
            Name Current Version
          </DropdownMenu.Item>
        </DropdownMenu>
      </DropdownMenu.Provider>

      <Modal
        ariaLabel="Delete Document"
        open={isDelete}
        onClose={() => setIsDelete(false)}>
        <ConfirmDelete
          onConfirmDelete={() => deleteContent(id)}
          setOpen={setIsDelete}
          title="Delete Document"
          text={`Are you sure you want to delete this document ?`}
        />
      </Modal>

      <Modal
        ariaLabel="Confirm Block"
        open={isMailPopupOpen}
        onClose={() => setMailPopupOpen(false)}>
        <>
          {isMailPopupOpen && (
            <EmailComposer id={id} setOpen={setMailPopupOpen} />
          )}
        </>
      </Modal>

      <VersionHistoryModal
        isOpen={isVersionHistoryOpen}
        onClose={() => setVersionHistoryOpen(false)}
        contentId={id}
      />
      <NameVersionModal
        isOpen={isNamingModalOpen}
        onClose={() => setIsNamingModalOpen(false)}
        onSaveVersion={async (customName) => {
          onDocumentSubmit(customName);
          setIsNamingModalOpen(false);
        }}
      />
    </>
  );
};

/**
 * Content Sidebar Element
 * @content ContentInstance from `get contents/[id]`
 */
interface ContentInfoBlockProps {
  content: ContentInstance;
  nextState?: any;
  contentType?: any;
}

export const ContentInfoBlock = ({
  content,
  nextState,
  contentType,
}: ContentInfoBlockProps) => {
  const { editorMode, userType, currentActiveIndex } = useDocument();
  const navigateToLayout = () => {
    if (contentType?.layout?.id) {
      Router.push(`/manage/layouts/${contentType.layout.id}`);
    }
  };

  const navigateToContentType = () => {
    if (contentType?.id) {
      Router.push(`/variants/${contentType.id}`);
    }
  };

  return (
    <Flex justify="space-between" px="md" py="sm">
      <Box>
        <Flex alignItems="center" gap="xxs">
          {(!contentType?.layout?.name || !contentType?.name) && (
            <Skeleton width="180px" height="14px" />
          )}
          {contentType?.layout?.name && (
            <Text
              fontSize="sm"
              color="text-secondary"
              cursor={contentType?.layout?.id ? 'pointer' : 'default'}
              onClick={navigateToLayout}>
              {contentType.layout.name}
            </Text>
          )}

          {contentType?.name && (
            <>
              <Text color="text-secondary"> / </Text>
              <Text
                fontSize="sm"
                color="text-secondary"
                as="span"
                cursor={contentType?.id ? 'pointer' : 'default'}
                onClick={navigateToContentType}>
                {contentType.name}
              </Text>
            </>
          )}
        </Flex>
        <Flex gap="sm">
          {!contentType?.prefix ? (
            <Box p="xxs">
              <Skeleton width="100px" height="18px" />
            </Box>
          ) : (
            <Text as="h4">
              {content?.content?.instance_id || contentType?.prefix}
            </Text>
          )}

          {content?.state?.state && (
            <Text
              as="span"
              bg="gray.500"
              fontSize="sm"
              fontWeight="heading"
              p="xxs"
              px="xs"
              lineHeight="1rem">
              {content?.state?.state}
            </Text>
          )}
        </Flex>
      </Box>
      <Flex align="center" gap="sm" ml="auto">
        {currentActiveIndex > 0 &&
          userType === 'default' &&
          editorMode !== 'new' && <InviteCollaborators />}

        <EditMenus id={content?.content?.id} nextState={nextState} />
      </Flex>
    </Flex>
  );
};
