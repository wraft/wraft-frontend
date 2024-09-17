import { useCallback, useEffect, useState } from "react";
import type { ReactExtensions, UseRemirrorReturn } from "@remirror/react";
import { useRemirror } from "@remirror/react";
import type {
  AnyExtension,
  RemirrorEventListener,
  RemirrorEventListenerProps,
  RemirrorContentType,
} from "remirror";
import remirrorExtensions from "./extensions.js";

const emptyDoc: RemirrorContentType = {
  type: "doc",
  content: [],
};

export default emptyDoc;

export interface UseContentEditorReturnType {
  editor: UseRemirrorReturn<ReactExtensions<AnyExtension>>;
  onChange: RemirrorEventListener<AnyExtension>;
  content: string;
  setContent: (content: string) => void;
  insertNow: (content: any) => void;
  onInserted: (value: any) => void;
  getContext: any;
}

export function useContentEditor(
  value: string,
  doUpdate: any,
  onInserted: (value: any) => void,
  args?: {
    placeholder?: string;
  },
): UseContentEditorReturnType {
  const extensions = remirrorExtensions(args?.placeholder);

  const editor = useRemirror({
    extensions,
    stringHandler: "markdown",
    content: value || emptyDoc,
    selection: "start",
  });

  const { onChange, manager, getContext } = editor;

  const text = getContext()?.helpers.getText();

  const [content, setMarkdownContent] = useState(text);

  const onEditorChange = useCallback(
    (
      parameter: RemirrorEventListenerProps<
        ReactExtensions<ReturnType<typeof extensions>[number]>
      >,
    ) => {
      const markdownContent = parameter.helpers.getMarkdown(parameter.state);
      setMarkdownContent(markdownContent);
      onChange(parameter);

      const json = getContext()?.helpers.getJSON();
      const contentObject = {
        json,
        md: markdownContent,
      };
      doUpdate(contentObject);
    },
    [onChange],
  );

  const setContent = useCallback(
    (value: string) => {
      manager.view.updateState(
        manager.createState({
          content: value,
          selection: "end",
          stringHandler: "markdown",
        }),
      );
      setMarkdownContent(value);
    },
    [manager],
  );

  /**
   * Insert inline
   */
  const insertNow = useCallback(
    (value: string) => {
      // @ts-expect-error
      const state = manager.getState();

      const { selection, schema } = state;
      const { insertBlock } = manager.store.commands;
      const newNode = schema?.nodeFromJSON(value);
      insertBlock(newNode, selection);
      onInserted;
    },
    [manager],
  );

  // when default value is provided
  useEffect(() => {
    if (value) {
      setContent(value);
    }
  }, [value]);

  return {
    editor,
    onChange: onEditorChange,
    setContent,
    content,
    insertNow,
    onInserted,
    getContext,
  };
}
