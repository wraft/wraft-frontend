import { useCallback, useEffect, useState } from 'react';

import {
  ReactExtensions,
  useRemirror,
  UseRemirrorReturn,
  useRemirrorContext,
} from '@remirror/react';
import {
  AnyExtension,
  RemirrorEventListener,
  RemirrorEventListenerProps,
} from 'remirror';
import { RemirrorContentType } from "remirror";

import remirrorExtensions from './extensions.js';

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
  onInserted: Function,
  getContext: any,
  
}

export function useContentEditor(
  value: string | any,
  doUpdate: any,
  onInserted: Function,
  args?: {
    placeholder?: string;
  },  
): UseContentEditorReturnType {
  const extensions = remirrorExtensions(args?.placeholder);

  // console.log('[useContentEditor][value]', value);
  
  const editor = useRemirror({
    extensions,
    stringHandler: 'markdown',
    content: value || emptyDoc,
    selection: 'start',
  });


  const { onChange, manager, getContext } = editor;

  // @ts-ignore
  const text = getContext()?.helpers.getText();

  const [content, setMarkdownContent] = useState(text);

  const onEditorChange = useCallback(
    (
      parameter: RemirrorEventListenerProps<
        ReactExtensions<ReturnType<typeof extensions>[number]>
      >,
    ) => {
      // @ts-ignore
      const markdownContent = parameter.helpers.getMarkdown(parameter.state);
      setMarkdownContent(markdownContent);
      onChange(parameter);

      // @ts-ignore
      const json = getContext()?.helpers.getJSON();
      console.log('onEditorChange', json);
      const contentObject = {
        json: json,
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
          selection: 'end',
          stringHandler: 'markdown',
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
        // @ts-ignore
        const state = manager.getState();

        const { selection, schema } = state;
        const { insertBlock } = manager.store.commands
        const newNode = schema?.nodeFromJSON(value);
        insertBlock(newNode, selection);
        onInserted;
    },
    [manager]
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
