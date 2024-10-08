import { useEditorState, useExtension } from "@remirror/react";
import { CountExtension } from "@remirror/extension-count";
import { Box } from "theme-ui";
import { useDebouncedMemo } from "./utils";

export const Counter = () => {
  const extension = useExtension(CountExtension);
  const state = useEditorState();

  const wordCount = useDebouncedMemo(
    300,
    () => {
      return extension.getWordCount(state);
    },
    [state],
  );

  const characterCount = useDebouncedMemo(
    300,
    () => {
      return extension.getCharacterCount(state);
    },
    [state],
  );

  return (
    <Box sx={{ ml: "auto", mr: 2 }}>
      Words: <strong>{wordCount}</strong>
    </Box>
  );
};
