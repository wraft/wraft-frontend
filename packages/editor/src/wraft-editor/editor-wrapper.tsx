import { useEffect } from 'react';
import { ContentEditor } from './editor.js';
import { useContentEditor } from './useContentEditor.js';

interface EditorProps {
  defaultValue?: any;
  editable: boolean;
  onUpdate: any;
  tokens: any;
  onInserted: Function;
  insertAtPointer?: any;
  insertable?: any;
}
const EditorWrapper = ({
  defaultValue,
  editable,
  onUpdate,
  tokens,
  insertable,
  onInserted,
}: EditorProps) => {
  const { editor, onChange, insertNow } = useContentEditor(
    defaultValue,
    onUpdate,
    onInserted
  );

  useEffect(() => {
    if (insertable) {
      insertNow(insertable);
    }
  }, [insertable]);

  return (
    <>
      <ContentEditor
        editor={editor}
        onChange={onChange}
        editable={editable}
        tokens={tokens}
      />
    </>
  );
};

export default EditorWrapper;
