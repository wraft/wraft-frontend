import type { FC } from "react";
import { useState } from "react";
import { Box, Flex, Text, DropdownMenu } from "@wraft/ui"; // Assuming you're using Chakra UI
import {
  Eye,
  PencilCircle,
  Highlighter,
  PencilSimpleLine,
} from "@phosphor-icons/react"; // Assuming you're using phosphor icons

type EditMode = "view" | "suggest" | "edit";

interface EditModeSwitchProps {
  isReadonly?: boolean;
  currentDate?: string;
  onSwitchView?: (mode: EditMode) => void;
  onExpand?: () => void;
  defaultMode?: EditMode;
}

const EditModeSwitch: FC<EditModeSwitchProps> = ({
  onSwitchView,
  defaultMode = "view",
}) => {
  const [activeMode, setActiveMode] = useState<EditMode>(defaultMode);

  const handleModeChange = (mode: EditMode) => {
    // console.log("Mode changed to:", mode, onSwitchView);
    setActiveMode(mode);
    if (onSwitchView) {
      //   console.log("Mode changed > :", mode);
      onSwitchView(mode);
      //   console.log("Mode changed >| :", mode);
    }
  };

  return (
    <Box
      bg="gray.100"
      color="gray.1100"
      // py="xs"
      pb="0"
    >
      <DropdownMenu.Provider>
        <DropdownMenu.Trigger>
          <Flex align="center" pl="0" pr="sm">
            {activeMode === "view" && <Eye size={13} />}
            {activeMode === "suggest" && <Highlighter size={13} />}
            {activeMode === "edit" && <PencilCircle size={13} />}
            <Text ml="xs" fontSize="sm2" fontWeight="medium" color="gray.1100">
              {activeMode === "view"
                ? "Viewing"
                : activeMode === "suggest"
                  ? "Suggesting"
                  : "Editing"}
            </Text>
          </Flex>
        </DropdownMenu.Trigger>
        <DropdownMenu aria-label="Editor Option">
          <DropdownMenu.Item
            onClick={() => handleModeChange("view")}
            bg={activeMode === "view" ? "green.100" : undefined}
          >
            <Flex align="center" gap="sm">
              <Eye size={13} />
              <Text
                fontSize="base"
                fontWeight="medium"
                color={activeMode === "view" ? "green.500" : "gray.1100"}
              >
                Viewing
              </Text>
            </Flex>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => handleModeChange("suggest")}
            bg={activeMode === "suggest" ? "green.100" : undefined}
          >
            <Flex align="center" gap="sm">
              <Highlighter size={13} />
              <Text
                fontSize="sm2"
                fontWeight="medium"
                color={activeMode === "suggest" ? "green.500" : "gray.1200"}
              >
                Suggesting
              </Text>
            </Flex>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => handleModeChange("edit")}
            bg={activeMode === "edit" ? "green.100" : undefined}
          >
            <Flex align="center" gap="sm">
              <PencilSimpleLine size={16} />
              <Text
                fontSize="sm2"
                fontWeight="medium"
                color={activeMode === "edit" ? "green.500" : "gray.1100"}
              >
                Editing
              </Text>
            </Flex>
          </DropdownMenu.Item>
        </DropdownMenu>
      </DropdownMenu.Provider>
    </Box>
  );
};

export default EditModeSwitch;
