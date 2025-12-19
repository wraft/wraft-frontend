import { useEffect, useState } from "react";
import type { ReactNodeViewComponent } from "prosekit/react";
import { Button, Box, Modal, Flex, Text } from "@wraft/ui";
import { CloseIcon } from "@wraft/icon";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import { extractTableDataFromNode } from "../helpers/extract-table-data";
import type { SmartTableData } from "../helpers/smart-table";
import SmartTableModal from "./smart-table-modal";
import { useEditorConfig } from "./editor-config";

/**
 * React Node View for Smart Table Wrapper
 * Renders an edit button above the table
 */
export const SmartTableWrapperView: ReactNodeViewComponent = ({
  node,
  view,
  getPos,
  contentRef,
}) => {
  const { tokens } = useEditorConfig();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [existingData, setExistingData] = useState<SmartTableData | null>(null);
  const [tableName, setTableName] = useState<string>("");

  const isReadonly = !view.editable;
  const fields = tokens || [];

  useEffect(() => {
    if (node.attrs.tableName) {
      setTableName(node.attrs.tableName);
    }

    const data = extractTableDataFromNode(node);
    if (data) {
      setExistingData(data);
    }
  }, [node]);

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

  const handleUpdate = (
    tableJSON: any,
    newTableName: string,
    _machineName?: string | null,
  ) => {
    const pos = getPos();
    if (pos === undefined) return;

    const { state } = view;
    const { schema } = state;

    try {
      const newNode = schema.nodeFromJSON(tableJSON);
      const tr = state.tr.replaceWith(pos, pos + node.nodeSize, newNode);
      view.dispatch(tr);

      setTableName(newTableName);
      const extractedData = extractTableDataFromNode(newNode);
      if (extractedData) {
        setExistingData(extractedData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating smart table:", error);
    }
  };

  return (
    <Box
      data-smart-table-wrapper="true"
      data-table-name={node.attrs.tableName || ""}
      data-machine-name={node.attrs.machineName || ""}
      className="smart-table-wrapper"
      style={{ position: "relative" }}
    >
      {!isReadonly && (
        <Box
          contentEditable={false}
          position="absolute"
          top="0.5rem"
          right="0.5rem"
          zIndex={10}
          display="flex"
          gap="0.5rem"
        >
          <Button onClick={handleEdit} size="xs" variant="secondary">
            <PencilSimpleIcon size={8} />
          </Button>
          <Button onClick={handleDelete} size="xs" variant="secondary" danger>
            <TrashIcon size={8} />
          </Button>
        </Box>
      )}

      <Box ref={contentRef} />

      {isModalOpen && existingData && (
        <SmartTableModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleUpdate}
          existingData={{
            name: tableName,
            data: existingData,
          }}
          fields={fields}
        />
      )}

      <Modal
        open={isDeleteModalOpen}
        ariaLabel="Delete Table Confirmation"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Box>
          <Flex justify="space-between">
            <Modal.Header>Delete Table</Modal.Header>
            <Box onClick={() => setIsDeleteModalOpen(false)} cursor="pointer">
              <CloseIcon color="#2C3641" />
            </Box>
          </Flex>
          <Box minWidth="342px" maxWidth="560px" py="lg">
            <Text lineHeight="1.6">
              Are you sure you want to delete the table "{tableName}"? This
              action cannot be undone.
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
    </Box>
  );
};
