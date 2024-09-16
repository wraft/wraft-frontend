import React, { useState } from 'react';
import Router from 'next/router';
import {
  Focusable,
  Menu,
  MenuButton,
  MenuItem,
  MenuProvider,
} from '@ariakit/react';
import toast from 'react-hot-toast';
import { Text, Box, Flex, Button } from 'theme-ui';
import { Check, DotsThreeVertical, Circle } from '@phosphor-icons/react';

import { BackArrowIcon } from 'components/Icons';
import EmailComposer from 'components/EmailComposer';
import Modal from 'common/Modal';
import ConfirmDelete from 'common/ConfirmDelete';
import { deleteAPI } from 'utils/models';
import { FlowStateBlockProps, ContentInstance } from 'utils/types/content';

/**
 * Atom Component to show Flow State
 * @TODO move to atoms or ui
 * @param param0
 * @returns
 */
export const FlowStateBlock = ({
  state,
  id,
  num,
  nextState,
  currentActiveIndex,
}: FlowStateBlockProps) => {
  const checked = currentActiveIndex >= num;
  const activeState = nextState && id === nextState?.id;

  // const bgC = activeState &&
  // Color logic
  const getBgColor = () => {
    if (activeState) {
      return checked ? 'green.100' : 'orange.100';
    }

    if (!checked && !activeState) {
      return 'gray.200';
    }
    return 'green.400';
  }; // {!checked && !activeState

  return (
    <Flex
      as={Focusable}
      sx={{
        alignItems: 'center',
        ':last-child': {
          '.arrowicon': {
            display: 'none',
          },
          minWidth: 'fit-content',
        },
      }}>
      <Box
        sx={{
          fontSize: 'xxs',
          width: '18px',
          height: '18px',
          borderRadius: '9rem',
          bg: getBgColor(),
          border: '1px solid',
          borderColor: activeState ? 'gray.300' : 'gray.500',
          color: activeState
            ? checked
              ? 'green.1200'
              : 'green.400'
            : 'green.1200',
          textAlign: 'center',
          mr: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          '.circlced': {
            color: 'orange.300',
          },
          p: 1,
        }}>
        {/* {nextState?.order} */}
        {!checked && !activeState && <>{num}</>}
        {activeState && <Circle size={16} weight="fill" className="circlced" />}
        {checked && <Check size={16} weight="bold" />}
      </Box>
      <Text
        sx={{ fontSize: '13px', textTransform: 'capitalize', fontWeight: 500 }}>
        {state}
      </Text>
      <Box
        sx={{
          paddingLeft: 1,
          paddingRight: 0,
        }}>
        <BackArrowIcon className="arrowicon" width={20} size={20} stroke={1} />
      </Box>
    </Flex>
  );
};

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
      Router.push('/contents');
    });
  };
  return (
    <>
      <MenuProvider>
        <MenuButton
          as={Button}
          variant="btnIcon"
          sx={{ display: 'flex', p: 2 }}>
          <DotsThreeVertical weight="bold" size={16} />
        </MenuButton>
        <Menu
          as={Box}
          aria-label="Manage Content"
          sx={{
            border: 'solid 1px',
            borderColor: 'border',
            borderRadius: 4,
            bg: 'gray.100',
            color: 'gray.900',
          }}>
          {nextState && nextState.is_user_eligible && (
            <MenuItem
              as={Box}
              onClick={() => Router.push(`/content/edit/${id}`)}
              sx={{ px: 3, py: 2, cursor: 'pointer' }}>
              Edit
            </MenuItem>
          )}
          <MenuItem
            as={Box}
            onClick={() => setIsDelete(true)}
            sx={{ px: 3, py: 2, cursor: 'pointer', color: 'red.700' }}>
            Delete
          </MenuItem>

          <MenuItem
            as={Box}
            onClick={() => setMailPopupOpen(true)}
            sx={{ px: 3, py: 2, cursor: 'pointer' }}>
            Send Mail
          </MenuItem>
        </Menu>
        <Modal isOpen={isDelete} onClose={() => setIsDelete(false)}>
          <ConfirmDelete
            onConfirmDelete={() => deleteContent(id)}
            setOpen={setIsDelete}
            title="Delete Document"
            text={`Are you sure you want to delete this document ?`}
          />
        </Modal>
      </MenuProvider>

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
interface ContentSidebarProps {
  content: ContentInstance;
  nextState?: any;
}

export const ContentSidebar = ({ content, nextState }: ContentSidebarProps) => (
  <Flex sx={{ px: 3, py: 1 }}>
    <Flex>
      <Box sx={{ mr: 3 }}>
        <Text
          as="h6"
          sx={{ color: 'gray.900', fontSize: 'xs', fontWeight: 400 }}>
          {content.content_type?.layout?.name} / {content.content_type?.name}
        </Text>
        <Flex>
          <Text
            as="h3"
            sx={{
              fontWeight: 'heading',
              fontSize: 'sm',
              lineHeight: '24px',
            }}>
            {content.content?.instance_id}
          </Text>
          <Box>
            <Text
              as="span"
              sx={{
                display: 'inline-flex',
                fontWeight: 500,
                bg: 'gray.500',
                ml: 2,
                color: 'text',
                px: 1,
                py: 0,
                borderRadius: '3px',
                letterSpacing: '0.2px',
                textTransform: 'uppercase',
                fontSize: 'xxs',
              }}>
              {content?.state?.state}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
    <Flex
      sx={{
        ml: 'auto',
        alignItems: 'baseline',
        gap: 1,
      }}>
      <EditMenus id={content?.content?.id} nextState={nextState} />
    </Flex>
  </Flex>
);
