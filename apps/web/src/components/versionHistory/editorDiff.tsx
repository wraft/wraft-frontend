// components/editor-diff.tsx
import { useMemo } from 'react';
import { defineBasicExtension } from 'prosekit/basic';
import { createEditor, union } from 'prosekit/core';
import { defineCommitViewer, type Commit } from 'prosekit/extensions/commit';
import { defineReadonly } from 'prosekit/extensions/readonly';
import { ProseKit } from 'prosekit/react';
import { Box } from '@wraft/ui';
import 'prosekit/basic/style.css';
import 'prosekit/extensions/commit/style.css';

interface ProseKitDiffViewerProps {
  commit: Commit;
}

export const ProseKitDiffViewer: React.FC<ProseKitDiffViewerProps> = ({
  commit,
}) => {
  const editor = useMemo(() => {
    const extension = union(
      defineBasicExtension(),
      defineReadonly(),
      defineCommitViewer(commit),
    );
    return createEditor({ extension });
  }, [commit]);

  return (
    <ProseKit editor={editor}>
      <Box
        bg="white"
        h="100%"
        w="100%"
        display="flex"
        flexDirection="column"
        overflow="hidden">
        <Box flex="1" overflowY="auto" position="relative">
          <Box
            ref={editor.mount}
            className="ProseMirror"
            minH="100%"
            px="md"
            py="md"
            outline="none"
          />
        </Box>
      </Box>
    </ProseKit>
  );
};
