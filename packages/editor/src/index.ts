export type { NodeJSON } from "prosekit/core";
export { Editor, type EditorRef } from "./components/editor";
export { LiveEditor } from "./components/live-editor";
export { ProseKitDiffViewer } from "./components/editor-diff";
export { migrateDocJSON } from "./helpers/migrate";
export {
  EditorConfigProvider,
  useEditorConfig,
} from "./components/editor-config";

export {
  smartTableDataToJSON,
  validateSmartTableData,
  parseAndValidateJSON,
  generateEmptySmartTableData,
  type SmartTableData,
  type SmartTableJSON,
} from "./helpers/smart-table";
export { default as SmartTableModal } from "./components/smart-table-modal";
export { SmartTableWrapperView } from "./components/smart-table-wrapper-view";
export {
  extractTableDataFromNode,
  extractTableData,
} from "./helpers/extract-table-data";
