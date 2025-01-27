import { defineCommands, insertNode, type Extension } from "@prosekit/core";
import type { SignatureAttrs } from "./signature-spec";

/**
 * @internal
 */
export type SignatureCommandsExtension = Extension<{
  Commands: {
    insertSignature: [attrs?: SignatureAttrs];
  };
}>;

/**
 * @internal
 */
export function defineSignatureCommands(): SignatureCommandsExtension {
  return defineCommands({
    insertSignature: (attrs?: SignatureAttrs) => {
      return insertNode({ type: "signature", attrs });
    },
  });
}
