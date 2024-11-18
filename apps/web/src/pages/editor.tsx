'use client';

import { FC, Suspense } from 'react';
import { Editor } from '@wraft/editor-v3';
import '@wraft/editor-v3/style.css';

// import dynamic from 'next/dynamic';

// const Editor = dynamic(
//   () => import('@wraft/editor-v3').then((mod) => mod.Editor),
//   {
//     ssr: false,
//   },
// );

const data = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hi JEDDAH SEASON',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'I am delighted to work with JEDDAH SEASON ',
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'holder',
          attrs: {
            named: 'AR Rahman dsa dsadsa',
            name: 'name',
            mentionTag: 'holder',
            id: '4fe88167-db21-43cb-ac6a-cea805df806d',
            label: 'name',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'text',
          text: ' Folio for your upcoming anniversary September-October issue',
        },
        {
          type: 'text',
          text: '. I would like to extend my gratitude to ASON on ',
        },
        {
          type: 'text',
          text: 'Musici',
        },
        {
          type: 'holder',
          attrs: {
            named: 'AR Rahman dsa dsadsa',
            name: 'name',
            mentionTag: 'holder',
            id: 'ed43a0e7-58e5-4c0d-931c-54b286a62226',
            label: 'name',
          },
        },
        {
          type: 'text',
          text: ' for their unwavering support throughout this journey.',
        },
      ],
    },
    {
      type: 'paragraph',
    },
    {
      type: 'paragraph',
    },
    {
      type: 'table',
      attrs: {
        isControllersInjected: true,
        insertButtonAttrs: null,
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
            },
            {
              type: 'tableHeaderCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Table 1',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeaderCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Table 2',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeaderCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Table 3',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'one',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'two',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'three',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'four',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'five',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'six',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'holder',
                      attrs: {
                        named: 'AR Rahman dsa dsadsa',
                        name: 'name',
                        mentionTag: 'holder',
                        id: '4fe88167-db21-43cb-ac6a-cea805df806d',
                        label: 'name',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'holder',
                      attrs: {
                        named: 'AR Rahman dsa dsadsa',
                        name: 'name',
                        mentionTag: 'holder',
                        id: '4fe88167-db21-43cb-ac6a-cea805df806d',
                        label: 'name',
                      },
                    },
                    {
                      type: 'text',
                      text: ' ',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                background: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'ddd',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'As requested, please find below the detailed itinerary:',
        },
      ],
    },
    // {
    //   type: 'bulletList',
    //   content: [
    //     {
    //       type: 'listItem',
    //       attrs: {
    //         closed: false,
    //         nested: false,
    //       },
    //       content: [
    //         {
    //           type: 'paragraph',
    //           content: [
    //             {
    //               type: 'text',
    //               marks: [
    //                 {
    //                   type: 'bold',
    //                 },
    //               ],
    //               text: 'Travel Date and Time',
    //             },
    //           ],
    //         },
    //         {
    //           type: 'bulletList',
    //           content: [
    //             {
    //               type: 'listItem',
    //               attrs: {
    //                 closed: false,
    //                 nested: false,
    //               },
    //               content: [
    //                 {
    //                   type: 'paragraph',
    //                   content: [
    //                     {
    //                       type: 'text',
    //                       marks: [
    //                         {
    //                           type: 'bold',
    //                         },
    //                       ],
    //                       text: 'Date:',
    //                     },
    //                     {
    //                       type: 'text',
    //                       text: ' 8th  July',
    //                     },
    //                   ],
    //                 },
    //               ],
    //             },
    //             {
    //               type: 'listItem',
    //               attrs: {
    //                 closed: false,
    //                 nested: false,
    //               },
    //               content: [
    //                 {
    //                   type: 'paragraph',
    //                   content: [
    //                     {
    //                       type: 'text',
    //                       marks: [
    //                         {
    //                           type: 'bold',
    //                         },
    //                       ],
    //                       text: 'Time:',
    //                     },
    //                     {
    //                       type: 'text',
    //                       text: ' Late Night',
    //                     },
    //                   ],
    //                 },
    //               ],
    //             },
    //             {
    //               type: 'listItem',
    //               attrs: {
    //                 closed: false,
    //                 nested: false,
    //               },
    //               content: [
    //                 {
    //                   type: 'paragraph',
    //                   content: [
    //                     {
    //                       type: 'text',
    //                       marks: [
    //                         {
    //                           type: 'bold',
    //                         },
    //                       ],
    //                       text: 'Route:',
    //                     },
    //                     {
    //                       type: 'text',
    //                       text: ' Kochi to Mumbai',
    //                     },
    //                   ],
    //                 },
    //               ],
    //             },
    //             {
    //               type: 'listItem',
    //               attrs: {
    //                 closed: false,
    //                 nested: false,
    //               },
    //               content: [
    //                 {
    //                   type: 'paragraph',
    //                   content: [
    //                     {
    //                       type: 'text',
    //                       marks: [
    //                         {
    //                           type: 'bold',
    //                         },
    //                       ],
    //                       text: 'Return ticket:',
    //                     },
    //                     {
    //                       type: 'text',
    //                       text: '  as per your schedule',
    //                     },
    //                   ],
    //                 },
    //               ],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       type: 'listItem',
    //       attrs: {
    //         closed: false,
    //         nested: false,
    //       },
    //       content: [
    //         {
    //           type: 'paragraph',
    //           content: [
    //             {
    //               type: 'text',
    //               marks: [
    //                 {
    //                   type: 'bold',
    //                 },
    //               ],
    //               text: 'Accommodation and Travel Arrangements on 8th July night',
    //             },
    //           ],
    //         },
    //         {
    //           type: 'paragraph',
    //           content: [
    //             {
    //               type: 'text',
    //               text: 'Please note the other team members accompanying me:',
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       type: 'listItem',
    //       attrs: {
    //         closed: false,
    //         nested: false,
    //       },
    //       content: [
    //         {
    //           type: 'paragraph',
    //           content: [
    //             {
    //               type: 'text',
    //               marks: [
    //                 {
    //                   type: 'bold',
    //                 },
    //               ],
    //               text: 'Yasir C',
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       type: 'listItem',
    //       attrs: {
    //         closed: false,
    //         nested: false,
    //       },
    //       content: [
    //         {
    //           type: 'paragraph',
    //           content: [
    //             {
    //               type: 'text',
    //               marks: [
    //                 {
    //                   type: 'bold',
    //                 },
    //               ],
    //               text: 'Naufal',
    //             },
    //             {
    //               type: 'text',
    //               text: ' ',
    //             },
    //             {
    //               type: 'text',
    //               marks: [
    //                 {
    //                   type: 'bold',
    //                 },
    //               ],
    //               text: 'babu',
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "All passengers' identification documents are attached for your reference.",
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Thank you once again for your support.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Best regards,',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'Dabzee',
        },
      ],
    },
  ],
};

const Index: FC = () => {
  return (
    <>
      <Suspense fallback={<div>Loading editor...</div>}>
        <Editor defaultContent={data} />
      </Suspense>
    </>
  );
};

export default Index;
