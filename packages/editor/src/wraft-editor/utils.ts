import { produce } from "immer";
import type { RemirrorJSON } from "remirror";

/**
 *  Sample Doc
 */

export const SAMPLE_DOC = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Loaded content" }],
    },
  ],
};

/**
 * Dummy Tokens
 */

export const tokensList = [
  {
    named: "",
    name: "place",
    mentionTag: "holder",
    id: "938fe356-e4d4-4c14-b9de-76383205db81",
    label: "place",
  },
  {
    named: "",
    name: "name",
    mentionTag: "holder",
    id: "aaadd7d4-9a1a-46dd-a59e-81a0ee7d77c3",
    label: "name",
  },
];

/**
 * Dummy data
 */
export const dummyContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Hello " },
        {
          type: "holder",
          attrs: {
            named: "Muneef",
            name: "name",
            mentionTag: "holder",
            id: "aaadd7d4-9a1a-46dd-a59e-81a0ee7d77c3",
            label: "name",
          },
        },
        { type: "text", text: " " },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "We as residents of Town X, would like to officially declare you, from ",
        },
        {
          type: "holder",
          attrs: {
            named: "Thiruthiyad",
            name: "hometown",
            mentionTag: "holder",
            id: "938fe356-e4d4-4c14-b9de-76383205db81",
            label: "hometown",
          },
        },
        { type: "text", text: " , our neighour!" },
      ],
    },
    { type: "paragraph", content: [{ type: "text", text: "Regards" }] },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "President " },
        { type: "hardBreak", marks: [{ type: "bold" }] },
        {
          type: "text",
          marks: [{ type: "bold" }],
          text: "Residents Association of Sri Cat Atre",
        },
      ],
    },
    { type: "paragraph" },
  ],
};

/**
 * Sample Test data
 */

export const fieldsSample = [
  {
    name: "name",
    value: "Omar Reza",
  },
  {
    name: "hometown",
    value: "Bangalore",
  },
];

/**
 * Update holder mark Node with values provided through fields object
 * @param data
 * @param fields
 * @todo - Limited to 2 level deep arrays
 */
export const updateVars = (
  data: RemirrorJSON,
  fields: any,
  nodeType = "holder",
) => {
  // cut it short if it map has no values
  if (fields?.[0]?.value) {
    const result = produce(data, (draft) => {
      data.content?.forEach((para: any, pindex: any) => {
        if (para?.content && para.content.length > 0) {
          para.content.forEach((blok: any, bindex: any) => {
            if (blok.type === nodeType) {
              const {
                attrs: { name },
              } = blok;
              const foundField = fields.find((e: any) => e.name === name);
              // @ts-expect-error: Object is possibly 'null'.
              draft.content[pindex].content[bindex].attrs.named =
                foundField?.value;
            }
          });
        }
      });
    });
    return result;
  }
  return data;
};
