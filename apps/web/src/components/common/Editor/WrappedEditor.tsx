import { Editor } from '@wraft/editor';

export default function WrappedEditor({ editorRef, ...props }: any) {
  return <Editor {...props} ref={editorRef} />;
}
