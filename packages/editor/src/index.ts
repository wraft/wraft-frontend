export type { NodeJSON } from "prosekit/core";
export { Editor, type EditorRef } from "./components/editor";
export { LiveEditor } from "./components/live-editor";
export { ProseKitDiffViewer } from "./components/editor-diff";
export { migrateDocJSON } from "./helpers/migrate";
export {
  EditorConfigProvider,
  useEditorConfig,
} from "./components/editor-config";
