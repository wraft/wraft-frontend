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
  currentDate = "Jan 20, 2024",
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
        px="md"
        border="solid 1px"
        borderColor="gray.400"
        borderBottom="0"
      >
        <Text
          fontSize="sm"
          color="gray.1000"
          display="flex"
          gap="sm"
          // py="sm"
          alignItems="center"
        >
          <ClockCounterClockwise size={15} />
          {/* <Text as="span" opacity="0.7" color="gray.500">
            \
          </Text>{" "} */}
          {currentDate}
          <CaretDown />
        </Text>
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
