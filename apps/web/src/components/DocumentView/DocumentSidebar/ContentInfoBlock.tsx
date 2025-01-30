import React, { useState } from 'react';
import Router from 'next/router';
import toast from 'react-hot-toast';
import { Text, Box, Flex, DropdownMenu } from '@wraft/ui';
import { DotsThreeVertical } from '@phosphor-icons/react';

import Modal from 'common/Modal';
import ConfirmDelete from 'common/ConfirmDelete';
import { deleteAPI } from 'utils/models';
import { ContentInstance } from 'utils/types/content';

import EmailComposer from '../EmailComposer';

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
  return (
    <>
      <DropdownMenu.Provider>
        <DropdownMenu.Trigger>
          <DotsThreeVertical weight="bold" size={18} />
        </DropdownMenu.Trigger>

        <DropdownMenu aria-label="Editor Option">
          {nextState && nextState.is_user_eligible && (
            <DropdownMenu.Item
              onClick={() => Router.push(`/documents/edit/${id}`)}>
              {' '}
              Edit
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item onClick={() => setIsDelete(true)}>
            Delete
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => setMailPopupOpen(true)}>
            Send Mail
          </DropdownMenu.Item>
        </DropdownMenu>
      </DropdownMenu.Provider>

      <Modal isOpen={isDelete} onClose={() => setIsDelete(false)}>
        <ConfirmDelete
          onConfirmDelete={() => deleteContent(id)}
          setOpen={setIsDelete}
          title="Delete Document"
          text={`Are you sure you want to delete this document ?`}
        />
      </Modal>

      <Modal isOpen={isMailPopupOpen}>
        <EmailComposer id={id} setOpen={setMailPopupOpen} />
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
}: ContentInfoBlockProps) => (
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
    //  alignItems: 'baseline',
    //  gap: 1,
    >
      <EditMenus id={content?.content?.id} nextState={nextState} />
    </Flex>
  </Flex>
);
