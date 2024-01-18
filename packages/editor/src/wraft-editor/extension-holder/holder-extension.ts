import {
  ApplySchemaAttributes,
  extension,
  ExtensionTag,
  isElementDomNode,
  Static,
  command,
  pick,
} from '@remirror/core';
import { Node } from '@remirror/pm/model';
// import type { CreateEventHandlers } from '@remirror/extension-events';
import {
  DEFAULT_SUGGESTER,
  MatchValue,
  RangeWithCursor,
  SuggestChangeHandlerProps,
  Suggester,
} from '@remirror/pm/suggest';
import { ExtensionMentionAtomTheme as Theme } from '@remirror/theme';
import {
  CommandFunction,
  ErrorConstant,
  getTextSelection,
  Handler,
  invariant,
  isString,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  NodeWithPosition,
  omitExtraAttributes,
  PrimitiveSelection,
  ProsemirrorAttributes,
  replaceText,
} from 'remirror';

/**
 * The default matcher to use when none is provided in options
 */
const DEFAULT_MATCHER = {
  ...pick(DEFAULT_SUGGESTER, [
    'startOfLine',
    'supportedCharacters',
    'validPrefixCharacters',
    'invalidPrefixCharacters',
  ]),
  appendText: '',
  matchOffset: 1,
  suggestClassName: Theme.SUGGEST_ATOM,
  mentionClassName: Theme.MENTION_ATOM,
};

export interface OptionalHolderAtomExtensionProps {
  /**
   * The text to append to the replacement.
   *
   * @default ''
   */
  appendText?: string;

  /**
   * The type of replacement to use. By default the command will only replace text up the the cursor position.
   *
   * To force replacement of the whole match regardless of where in the match the cursor is placed set this to
   * `full`.
   *
   * @default 'full'
   */
  replacementType?: keyof MatchValue;
}

export interface CreateHolderAtom {
  /**
   * The name of the matcher used to create this mention.
   */
  name: string;

  /**
   * The range of the current selection
   */
  range: RangeWithCursor;
}

/**
 * The attrs that will be added to the node.
 * ID and label are plucked and used while attributes like href and role can be assigned as desired.
 */
export type HolderAtomNodeAttributes = ProsemirrorAttributes<
  OptionalHolderAtomExtensionProps & {
    /**
     * A unique identifier for the suggesters node
     */
    id: string;

    /**
     * The text to be placed within the suggesters node
     */
    label: string;
  }
>;

export type NamedHolderAtomNodeAttributes = HolderAtomNodeAttributes & {
  /**
   * The name of the matcher used to create this holder.
   */
  name: string;
};

/**
 * This change handler is called whenever there is an update in the matching
 * suggester. The second parameter `command` is available to automatically
 * create the holder with the required attributes.
 */
export type HolderAtomChangeHandler = (
  handlerState: SuggestChangeHandlerProps,
  command: (attrs: HolderAtomNodeAttributes) => void,
) => void;

/**
 * The options for the matchers which can be created by this extension.
 */
export interface HolderAtomExtensionMatcher
  extends Pick<
    Suggester,
    | 'char'
    | 'name'
    | 'startOfLine'
    | 'supportedCharacters'
    | 'validPrefixCharacters'
    | 'invalidPrefixCharacters'
    | 'suggestClassName'
  > {
  /**
   * See [[``Suggester.matchOffset`]] for more details.
   *
   * @default 1
   */
  matchOffset?: number;

  /**
   * Provide customs class names for the completed holder.
   */
  holderClassName?: string;

  /**
   * An override for the default holder tag. This allows different holders to
   * use different tags.
   */
  holderTag?: string;

  /**
   * Text to append after the holder has been added.
   *
   * **NOTE**: If it seems that your editor is swallowing  up empty whitespace,
   * make sure you've imported the core css from the `@remirror/styles` library.
   *
   * @default ' '
   */
  appendText?: string;
}

/**
 * Options available to the [[`HolderAtomExtension`]].
 */
export interface HolderAtomOptions
  extends Pick<
    Suggester,
    | 'invalidNodes'
    | 'validNodes'
    | 'invalidMarks'
    | 'validMarks'
    | 'isValidPosition'
  > {
  /**
   * When `true` the atom node which wraps the holder will be selectable.
   *
   * @default true
   */
  selectable?: Static<boolean>;

  /**
   * Whether holders should be draggable.
   *
   * @default false
   */
  draggable?: Static<boolean>;

  /**
   * Whether holders should be draggable.
   *
   * @default ""
   */
  // named?: Static<string>;
  // name: Static<string>;

  /**
   * Provide a custom tag for the holder
   */
  holderTag?: Static<string>;

  /**
   * Provide the custom matchers that will be used to match holder text in the
   * editor.
   *
   * TODO - add customized tags here.
   */
  matchers: Static<HolderAtomExtensionMatcher[]>;

  /**
   * Text to append after the holder has been added.
   *
   * **NOTE**: If it seems that your editor is swallowing  up empty whitespace,
   * make sure you've imported the core css from the `@remirror/styles` library.
   *
   * @default ' '
   */
  appendText?: string;

  /**
   * Tag for the prosemirror decoration which wraps an active match.
   *
   * @default 'span'
   */
  suggestTag?: string;

  /**
   * When true, decorations are not created when this holder is being edited.
   */
  disableDecorations?: boolean;

  /**
   * Called whenever a suggestion becomes active or changes in any way.
   *
   * @remarks
   *
   * It receives a parameters object with the `reason` for the change for more
   * granular control.
   */
  onChange?: Handler<HolderAtomChangeHandler>;

  /**
   * Listen for click events to the holder atom extension.
   */
  onClick?: Handler<
    (
      event: MouseEvent,
      nodeWithPosition: NodeWithPosition,
    ) => boolean | undefined | void
  >;
}

/**
 * This is the atom version of the `MentionExtension`
 * `@remirror/extension-holder`.
 *
 * It provides holders as atom nodes which don't support editing once being
 * inserted into the document.
 */
@extension<HolderAtomOptions>({
  defaultOptions: {
    selectable: true,
    draggable: false,
    holderTag: 'span' as const,
    matchers: [],
    appendText: ' ',
    suggestTag: 'span' as const,
    disableDecorations: false,
    invalidMarks: [],
    invalidNodes: [],
    isValidPosition: () => true,
    validMarks: null,
    validNodes: null,
    // named: '',
    // name: '',
  },
  handlerKeyOptions: { onClick: { earlyReturnValue: true } },
  handlerKeys: ['onChange', 'onClick'],
  staticKeys: ['selectable', 'draggable', 'holderTag', 'matchers'],
})
export class HolderAtomExtension extends NodeExtension<HolderAtomOptions> {
  get name() {
    return 'holder' as const;
  }

  createTags() {
    return [ExtensionTag.InlineNode, ExtensionTag.Behavior];
  }

  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride,
  ): NodeExtensionSpec {
    const dataAttributeId = 'data-holder-atom-id';
    const dataAttributeName = 'data-holder-atom-name';

    return {
      inline: true,
      selectable: this.options.selectable,
      draggable: this.options.draggable,
      atom: true,
      ...override,
      attrs: {
        ...extra.defaults(),
        id: {},
        label: {},
        name: {},
      },
      parseDOM: [
        ...this.options.matchers.map((matcher) => ({
          tag: `${
            matcher.holderTag ?? this.options.holderTag
          }[${dataAttributeId}]`,
          getAttrs: (node: string | Node) => {
            if (!isElementDomNode(node)) {
              return false;
            }

            const id = node.getAttribute(dataAttributeId);
            const name = node.getAttribute(dataAttributeName);
            const label = node.textContent;
            return { ...extra.parse(node), id, label, name };
          },
        })),
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => {
        const { id, name } = omitExtraAttributes(
          node.attrs,
          extra,
        ) as NamedHolderAtomNodeAttributes;
        const matcher = this.options.matchers.find(
          (matcher) => matcher.name === name,
        );

        // const holderClassName = matcher
        //   ? matcher.holderClassName ?? DEFAULT_MATCHER.holderClassName
        //   : DEFAULT_MATCHER.holderClassName;

        const { named } = node.attrs;

        const attrs = {
          ...extra.dom(node),
          class: named?.length > 0 ? 'holder' : 'no-holder',
          [dataAttributeId]: id,
          [dataAttributeName]: name,
        };

        // const kclass = node.attrs.named ? "holder" : "no-holder";
        // const extras = { class: kclass, ...node.attrs };
        const value = node.attrs.named ? node.attrs.named : node.attrs.name;
        // return ["em", extras, value];
        return [matcher?.holderTag ?? this.options.holderTag, attrs, value];
      },
    };
  }

  /**
   * Inserts a Node at the  the provided range.
   *
   * This helps in inserting blocks externally
   *
   * @param content - A remirror valid Node
   */

  @command()
  insertBlock(content: Node, selection?: PrimitiveSelection): CommandFunction {
    return ({ tr, dispatch }) => {
      const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);

      tr.insertText('\n', from, to);
      tr.replaceRangeWith(from, from, content);
      dispatch?.(tr);
      return true;
    };
  }

  /**
   * Creates a mention atom at the  the provided range.
   *
   * A variant of this method is provided to the `onChange` handler for this
   * extension.
   *
   * @param details - the range and name of the mention to be created.
   * @param attrs - the attributes that should be passed through. Required
   * values are `id` and `label`.
   */
  @command()
  createHolderAtom(
    details: CreateHolderAtom,
    attrs: HolderAtomNodeAttributes,
  ): CommandFunction {
    const { name, range } = details;
    const validNameExists = this.options.matchers.some(
      (matcher) => name === matcher.name,
    );

    // Check that the name is valid.
    invariant(validNameExists, {
      code: ErrorConstant.EXTENSION,
      message: `Invalid name '${name}' provided when creating a mention. Please ensure you only use names that were configured on the matchers when creating the \`MentionAtomExtension\`.`,
    });

    const { appendText, replacementType, ...rest } = attrs;

    const { from, to } = {
      from: range.from,
      to: replacementType === 'partial' ? range.cursor : range.to,
    };

    return replaceText({
      type: this.type,
      appendText: getAppendText(appendText, this.options.appendText),
      attrs: { name, ...rest },
      selection: { from, to },
    });
  }

  createSuggesters(): Suggester[] {
    const options = pick(this.options, [
      'invalidMarks',
      'invalidNodes',
      'isValidPosition',
      'validMarks',
      'validNodes',
      'suggestTag',
      'disableDecorations',
      'appendText',
    ]);

    return this.options.matchers.map<Suggester>((matcher) => ({
      ...DEFAULT_MATCHER,
      ...options,
      ...matcher,
      onChange: (props) => {
        const { name, range } = props;
        const { createHolderAtom } = this.store.commands;

        function command(attrs: HolderAtomNodeAttributes) {
          createHolderAtom({ name, range }, attrs);
        }

        this.options.onChange(props, command);
      },
    }));
  }
}

/**
 * Get the append text value which needs to be handled carefully since it can
 * also be an empty string.
 */
function getAppendText(
  preferred: string | undefined,
  fallback: string | undefined,
) {
  if (isString(preferred)) {
    return preferred;
  }

  if (isString(fallback)) {
    return fallback;
  }

  return DEFAULT_MATCHER.appendText;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Remirror {
    interface AllExtensions {
      holder: HolderAtomExtension;
    }
  }
}
