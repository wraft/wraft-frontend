import React, { useState } from "react";
import {
  ListBullets,
  ListNumbers,
  Quotes,
  Table,
  TextBolder,
  TextHOne,
  TextHTwo,
  TextHThree,
  TextItalic,
  ArrowsOutSimple,
  ArrowsInSimple,
  Image,
} from "@phosphor-icons/react";
import { CommandButton, useActive, useCommands } from "@remirror/react";
import { Box, Flex } from "theme-ui";
// import { Counter } from "./extensions/counter";

// import { Flex } from 'theme-ui';

const ThemedCommandButton = (props: any) => (
  <Box
    as={CommandButton}
    sx={{
      margin: "0 4px",
      padding: "4px",
      border: 0,
      borderRadius: "6px",
      "&.selected": {
        backgroundColor: "lightblue !important",
      },
      backgroundColor: props.active ? "lightblue" : "transparent",
      "&:hover": {
        backgroundColor: props.active ? "lightblue" : "#f0f0f0",
      },
      "&:last-child": {
        ml: "auto",
      },
    }}
    {...props}
  />
);

interface ToolbarProps {
  onWidthToggle: (isFullWidth: boolean) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onWidthToggle }) => {
  const commands = useCommands();
  const active = useActive(true);
  const [isFullWidth, setIsFullWidth] = useState(false);

  const toggleWidth = () => {
    const newIsFullWidth = !isFullWidth;
    setIsFullWidth(newIsFullWidth);
    onWidthToggle(newIsFullWidth);
  };

  return (
    <Flex sx={{ px: 3, py: 2, borderBottom: `solid 1px`, borderColor: "#eee" }}>
      {/* <HeadingLevelButtonGroup showAll /> */}
      {/* <ToggleBlockquoteButton /> */}

      <ThemedCommandButton
        icon={<TextBolder size={18} />}
        commandName="toggleBold"
        onSelect={() => commands.toggleBold()}
        enabled={true}
        active={active.bold()}
      />

      <ThemedCommandButton
        commandName="toggleItalic"
        icon={<TextItalic size={18} />}
        onSelect={() => commands.toggleItalic()}
        enabled={true}
        active={active.italic()}
      />
      <ThemedCommandButton
        commandName="toggleBlockquote"
        icon={<Quotes size={18} />}
        onSelect={() => commands.toggleBlockquote()}
        enabled={true}
        active={active.blockquote()}
      />
      <Box sx={{ width: "1px", backgroundColor: "#eee", mx: 2 }} />
      <ThemedCommandButton
        commandName="toggleHeading"
        icon={<TextHOne size={18} />}
        onSelect={() => commands.toggleHeading({ level: 1 })}
        enabled={true}
        active={active.heading({ level: 1 })}
      />
      <ThemedCommandButton
        commandName="toggleHeading"
        icon={<TextHTwo size={18} />}
        onSelect={() => commands.toggleHeading({ level: 2 })}
        enabled={true}
        active={active.heading({ level: 2 })}
      />

      <ThemedCommandButton
        commandName="toggleHeading"
        icon={<TextHThree size={18} />}
        onSelect={() => commands.toggleHeading({ level: 3 })}
        enabled={true}
        active={active.heading({ level: 3 })}
      />

      <ThemedCommandButton
        icon={<ListBullets size={18} />}
        commandName="toggleBulletList"
        active={active.bulletList()}
        onSelect={() => commands.toggleBulletList()}
        enabled={true}
      />
      <ThemedCommandButton
        icon={<ListNumbers size={18} />}
        commandName="toggleOrderedList"
        active={active.orderedList()}
        onSelect={() => commands.toggleOrderedList()}
        enabled={true}
      />

      <Box sx={{ width: "1px", backgroundColor: "#eee", mx: 2 }} />
      <ThemedCommandButton
        icon={<Image size={18} />}
        commandName={"uploadImage"}
        // onSelect={() => commands.uploadImage()}
        enabled={true}
      />
      {/* <InsertHorizontalRuleButton /> */}
      <ThemedCommandButton
        icon={<Table size={18} />}
        commandName={"addTable"}
        onSelect={() =>
          commands.createTable({
            rowsCount: 4,
            columnsCount: 3,
            withHeaderRow: true,
          })
        }
        enabled={true}
      />

      {/* <ThemedCommandButton
        icon={<FrameCorners size={18} weight="bold" />}
        commandName={'addCodeBlock'}
        // onSelect={() => commands.createCodeBlock()}
        enabled={true}
      /> */}

      <Flex sx={{ alignItems: "center", ml: "auto" }}>
        <Flex>{/* <Counter /> */}</Flex>
        <ThemedCommandButton
          icon={
            isFullWidth ? (
              <ArrowsInSimple size={18} weight="bold" />
            ) : (
              <ArrowsOutSimple size={18} weight="bold" />
            )
          }
          commandName="toggleWidth"
          onSelect={toggleWidth}
          enabled={true}
          active={false}
        />
      </Flex>
    </Flex>
  );
};

// Function to adjust editor padding (implement this in your editor component)
// const adjustEditorPadding = (isFullWidth: boolean) => {
//   // Implement the logic to adjust the editor padding based on isFullWidth
//   // This might involve updating a state in a parent component or using a context
// };
