import { union, type Union } from "@prosekit/core";
import {
  defineSignatureCommands,
  type SignatureCommandsExtension,
} from "./signature-commands";
import {
  defineSignatureSpec,
  type SignatureSpecExtension,
} from "./signature-spec";

/**
 * @internal
 */
export type SignatureExtension = Union<
  [SignatureSpecExtension, SignatureCommandsExtension]
>;

/**
 * @public
 */
export function defineSignature(): SignatureExtension {
  return union(defineSignatureSpec(), defineSignatureCommands());
}
