import { useState } from "react";
import type { ReactNodeViewProps } from "prosekit/react";
import { Box, Flex, Button, Text } from "@wraft/ui";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import type { ConditionalBlockAttrs } from "../extensions/conditional-block/conditional-block-spec";
import ConditionalBlockModal from "./conditional-block-modal";
import { useEditorConfig } from "./editor-config";

export default function ConditionalBlockView(props: ReactNodeViewProps) {
  const { node, contentRef, setAttrs, view } = props;
  const attrs = node.attrs as ConditionalBlockAttrs;
  const { tokens } = useEditorConfig();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const conditions = attrs.conditions || [];
  const isReadonly = !view.editable;

  const fields = tokens || [];

  const handleEdit = () => {
    setIsModalOpen(true);
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
            >
              <Button onClick={handleEdit} size="xs" variant="secondary">
                <PencilSimpleIcon size={12} />
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
