import { PencilSimpleIcon, TableIcon } from "@phosphor-icons/react";
import { Box, Flex, Text, Button } from "@wraft/ui";

interface SmartTableViewProps {
  tableName: string;
  onEdit?: () => void;
  isReadonly?: boolean;
}

export default function SmartTableView({
  tableName,
  onEdit,
  isReadonly = false,
}: SmartTableViewProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      py="xs"
      px="sm"
      mt="md"
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
      {!isReadonly && onEdit && (
        <Button onClick={onEdit} size="xs" variant="secondary">
          <PencilSimpleIcon size={14} />
          Edit
        </Button>
      )}
    </Box>
  );
}
