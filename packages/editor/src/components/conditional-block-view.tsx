import { useState } from "react";
import type { ReactNodeViewProps } from "prosekit/react";
import { Box, Flex, Button, Text, Modal } from "@wraft/ui";
import { CloseIcon } from "@wraft/icon";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import type { ConditionalBlockAttrs } from "../extensions/conditional-block/conditional-block-spec";
import ConditionalBlockModal from "./conditional-block-modal";
import { useEditorConfig } from "./editor-config";

export default function ConditionalBlockView(props: ReactNodeViewProps) {
  const { node, contentRef, setAttrs, view, getPos } = props;
  const attrs = node.attrs as ConditionalBlockAttrs;
  const { tokens } = useEditorConfig();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const conditions = attrs.conditions || [];
  const isReadonly = !view.editable;

  const fields = tokens || [];

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const pos = getPos();
    if (pos === undefined) return;

    const { state } = view;
    const tr = state.tr.delete(pos, pos + node.nodeSize);
    view.dispatch(tr);
    setIsDeleteModalOpen(false);
  };

  const handleUpdate = (updatedAttrs: ConditionalBlockAttrs) => {
    setAttrs(updatedAttrs);
    setIsModalOpen(false);
  };

  return (
    <>
      <Box
        as="div"
        data-conditional-block="true"
        boxSizing="border-box"
        border="1px solid"
        borderColor="border"
        display="block"
        borderRadius="md"
        backgroundColor="gray.100"
        maxW="100%"
        my="sm"
        position="relative"
        w="100%"
      >
        <Flex backgroundColor="background-secondary" borderRadius="md" p="md">
          {!isReadonly && (
            <Box
              position="absolute"
              top="0.5rem"
              right="0.5rem"
              zIndex={10}
              contentEditable={false}
              display="flex"
              gap="xs"
            >
              <Button onClick={handleEdit} size="xs" variant="secondary">
                <PencilSimpleIcon size={12} />
              </Button>
              <Button onClick={handleDelete} size="xs" variant="secondary">
                <TrashIcon size={12} />
              </Button>
            </Box>
          )}

          {conditions.length > 0 && (
            <Box
              fontSize="xs"
              color="text-secondary"
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              gap="sm"
            >
              <Text fontWeight="bold" fontSize="sm">
                WHEN
              </Text>
              {conditions.map((cond, idx: number) => {
                if (idx === 0) {
                  return (
                    <Text key={idx} fontSize="sm" color="text-secondary">
                      {cond.placeholder} {getOperationSymbol(cond.operation)}{" "}
                      {cond.value}
                    </Text>
                  );
                }
                return (
                  <Text
                    key={idx}
                    fontSize="sm"
                    color="text-secondary"
                    display="flex"
                    alignItems="center"
                    gap="xs"
                  >
                    {cond.logic && (
                      <Text fontSize="sm" fontWeight="bold">
                        {cond.logic.toUpperCase()}
                      </Text>
                    )}
                    <Text fontSize="sm" color="text-secondary">
                      {cond.placeholder} {getOperationSymbol(cond.operation)}{" "}
                      {cond.value}
                    </Text>
                  </Text>
                );
              })}
            </Box>
          )}
        </Flex>
        <Box
          borderTop="1px solid"
          borderColor="border"
          p="md"
          ref={contentRef}
        />
      </Box>

      {isModalOpen && (
        <ConditionalBlockModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onInsert={handleUpdate}
          fields={fields}
          existingAttrs={attrs}
        />
      )}

      <Modal
        open={isDeleteModalOpen}
        ariaLabel="Delete Conditional Block Confirmation"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Box>
          <Flex justify="space-between">
            <Modal.Header>Delete Conditional Block</Modal.Header>
            <Box onClick={() => setIsDeleteModalOpen(false)} cursor="pointer">
              <CloseIcon color="#2C3641" />
            </Box>
          </Flex>
          <Box minWidth="342px" maxWidth="560px" py="lg">
            <Text lineHeight="1.6">
              Are you sure you want to delete this conditional block?
            </Text>
          </Box>
          <Flex gap="sm" py="sm" justify="flex-end">
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              variant="tertiary"
            >
              Cancel
            </Button>
            <Button danger onClick={handleConfirmDelete}>
              Confirm
            </Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
}

function getOperationSymbol(operation: string): string {
  const symbols: Record<string, string> = {
    equal: "=",
    not_equal: "≠",
    like: "~",
    not_like: "!~",
    greater_than: ">",
    greater_than_or_equal: "≥",
    less_than: "<",
    less_than_or_equal: "≤",
  };
  return symbols[operation] || operation;
}
