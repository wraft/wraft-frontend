import { createEditor } from "prosekit/core";
import { ProseKit } from "prosekit/react";
import "prosekit/basic/style.css";
import "prosekit/extensions/commit/style.css";
import { useMemo } from "react";
import { defineEditorDiffExtension } from "./extension";
import * as S from "./styles";

interface ProseKitDiffViewerProps {
  commit: any;
  tokens?: any;
}

export const ProseKitDiffViewer: React.FC<ProseKitDiffViewerProps> = ({
  commit,
  tokens: _tokens,
}) => {
  const editor = useMemo(() => {
    const extension = defineEditorDiffExtension({ doc: commit });
    return createEditor({ extension });
  }, [commit]);

  return (
    <>
      <ProseKit editor={editor}>
        <S.EditorContainer type="editerdiffview">
          <S.EditorContent>
            <S.EditorContentInput ref={editor.mount} />
          </S.EditorContent>
        </S.EditorContainer>
      </ProseKit>
    </>
  );
};
