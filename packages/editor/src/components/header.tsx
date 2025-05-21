import type { FC } from "react";
import {
  ArrowsHorizontal,
  ArrowsOutSimple,
  CaretDown,
  ClockCounterClockwise,
} from "@phosphor-icons/react";
import { Box, Button, Flex, Text } from "@wraft/ui";
import EditModeSwitch from "./mode-switch";
import Toolbar from "./toolbar"; // Assuming Toolbar is a local component

interface EditorHeaderProps {
  isReadonly: boolean;
  currentDate?: string;
  onSwitchView?: (mode: string) => void;
  onExpand?: () => void;
}

const EditorHeader: FC<EditorHeaderProps> = ({
  isReadonly,
  currentDate = "Versions",
  onSwitchView,
  onExpand,
}) => (
  <Box
    bg="gray.100"
    color="gray.1100"
    // py="xs"
    pb="0"
  >
    {isReadonly && (
      <Flex
        py="0"
        alignItems="center"
        // px="md"
        border="solid 1px"
        borderColor="gray.400"
        borderBottom="0"
        borderRadius="md2 md2 0 0"
      >
        <Box pl="md">
          <Text
            fontSize="sm2"
            color="gray.1000"
            display="flex"
            gap="sm"
            // py="sm"
            alignItems="center"
          >
            {currentDate}
            <CaretDown />
          </Text>
        </Box>
        <Flex ml="auto">
          <Button
            variant="ghost"
            color="gray.900"
            // @ts-expect-error
            m="xs"
            py="md"
            size="xs"
            onClick={onExpand}
          >
            <ArrowsOutSimple size={20} weight="bold" />
          </Button>

          <Flex
            alignItems="center"
            gap="sm"
            py="sm"
            px="sm"
            borderLeft="solid 1px"
            borderColor="gray.400"
          >
            {onSwitchView && (
              <EditModeSwitch
                isReadonly={isReadonly}
                onSwitchView={onSwitchView}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    )}
    {!isReadonly && (
      <Box className="toolbar">
        <Toolbar isReadonly={isReadonly} onSwitchView={onSwitchView} />
      </Box>
    )}
  </Box>
);

export default EditorHeader;
