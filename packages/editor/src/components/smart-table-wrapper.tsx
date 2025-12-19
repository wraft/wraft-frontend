import { useState } from "react";
import { TableIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { Box, Flex, Text, Button } from "@wraft/ui";
import type { SmartTableData } from "../helpers/smart-table";
import SmartTableModal from "./smart-table-modal";
import { useEditorConfig } from "./editor-config";

interface SmartTableWrapperProps {
  tableName?: string;
  isSmartTable?: boolean;
  children: React.ReactNode;
}

export default function SmartTableWrapper({
  tableName,
  isSmartTable,
  children,
}: SmartTableWrapperProps) {
  const { tokens } = useEditorConfig();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [_tableData, _setTableData] = useState<SmartTableData | null>(null);
  const fields = tokens || [];

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    setIsEditModalOpen(false);
  };

  if (!isSmartTable || !tableName) {
    return <>{children}</>;
  }

  return (
    <Box my="md">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        py="xs"
        px="sm"
        backgroundColor="#f9fafb"
        border="1px solid"
        borderColor="#e5e7eb"
        borderBottom="none"
        borderRadius="sm"
        className="smart-table-header"
        style={{
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Flex align="center" gap="xs" fontWeight="medium">
          <TableIcon size={16} weight="bold" />
          <Text fontSize="sm" color="#374151">
            {tableName}
          </Text>
          <Box
            as="span"
            backgroundColor="#dbeafe"
            py="xxs"
            px="xs"
            borderRadius="full"
            display="inline-flex"
            alignItems="center"
          >
            <Text fontSize="xs" fontWeight="medium" color="#1e40af" m={0}>
              Smart Table
            </Text>
          </Box>
        </Flex>
        <Button onClick={handleEdit} size="xs" variant="secondary">
          <PencilSimpleIcon size={14} />
          Edit
        </Button>
      </Box>
      <Box>{children}</Box>

      {isEditModalOpen && (
        <SmartTableModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdate}
          existingData={
            _tableData
              ? {
                  name: tableName,
                  data: _tableData,
                }
              : undefined
          }
          fields={fields}
        />
      )}
    </Box>
  );
}
