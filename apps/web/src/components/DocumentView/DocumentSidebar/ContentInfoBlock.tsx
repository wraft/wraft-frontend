import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import toast from 'react-hot-toast';
import { Text, Box, Flex, DropdownMenu, Modal } from '@wraft/ui';
import { DotsThreeVertical } from '@phosphor-icons/react';

import ConfirmDelete from 'common/ConfirmDelete';
import { deleteAPI, postAPI, fetchAPI } from 'utils/models';
import { ContentInstance } from 'utils/types/content';
import { usePermission } from 'utils/permissions';

import EmailComposer from '../EmailComposer';
import InviteCollaborators from '../InviteCollaborators';
import { useDocument } from '../DocumentContext';

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

  const { hasPermission } = usePermission();
  const { cId, setSignerBoxes, signerBoxes } = useDocument();

  useEffect(() => {
    fetchAPI(`contents/${cId}/signatures`).then((data: any) => {
      const signatures = data.signatures;
      setSignerBoxes(signatures);
    });
  }, []);

  /**
   * Delete content
   * @param id
   */
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
    console.log('onbuildforSigning');
    postAPI(`contents/${cId}/generate_signature`, {})
      .then(() => {
        // setIsBuilding(false);

        toast.success('Build done successfully', {
          duration: 500,
          position: 'top-right',
        });
      })
      .catch(() => {
        // setIsBuilding(false);
        toast.error('Build Failed');
      });
  };

  return (
    <>
      <DropdownMenu.Provider>
        <DropdownMenu.Trigger>
          <DotsThreeVertical weight="bold" size={18} className="main-icon" />
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
                {' '}
                Edit
              </DropdownMenu.Item>
            )}
          {/* {hasPermission('document', 'delete') && ( */}
          <DropdownMenu.Item onClick={() => setIsDelete(true)}>
            Delete
          </DropdownMenu.Item>
          {/* )} */}
          {/* {hasPermission('document', 'manage') && ( */}
          <DropdownMenu.Item onClick={() => setMailPopupOpen(true)}>
            Send Mail
          </DropdownMenu.Item>
          {/* )} */}
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

      <Modal ariaLabel="Confirm Block" open={isMailPopupOpen}>
        <>
          {isMailPopupOpen && (
            <EmailComposer id={id} setOpen={setMailPopupOpen} />
          )}
        </>
      </Modal>
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
  return (
    <Flex justify="space-between" px="md" py="sm">
      <Box>
        <Text fontSize="sm" color="text-secondary">
          {contentType?.layout?.name} / {contentType?.name}
        </Text>
        <Flex gap="sm">
          <Text as="h4">
            {content?.content?.instance_id || contentType?.prefix}
          </Text>
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
      <Flex
        //  ml: 'auto',
        align="center"
        //  gap: 1,
      >
        {currentActiveIndex > 0 &&
          userType === 'default' &&
          editorMode !== 'new' && <InviteCollaborators />}

        <EditMenus id={content?.content?.id} nextState={nextState} />
      </Flex>
    </Flex>
  );
};
