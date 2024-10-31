'use client';

import { FC } from 'react';
import { Editor } from '@wraft/editor-v3';

const data = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Dear ',
        },
        {
          type: 'holder',
          attrs: {
            named: 'Nihal',
            name: 'name',
            mentionTag: 'holder',
            id: 'bec01d2f-21c9-4fa6-8fc0-4e856af55d97',
            label: 'name',
          },
        },
        {
          type: 'text',
          text: ',',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Happy Birthday!',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'On behalf of everyone at [Company Name], I want to extend our warmest wishes to you on your special day. Birthdays are a time for celebration, reflection, and looking forward to the year ahead, and we hope this year brings you all the success, joy, and fulfillment you deserve.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'We greatly appreciate the hard work, dedication, and positive energy you bring to the team every day. Your contributions play a crucial role in our continued success, and we are grateful to have you as part of our work family.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'As you celebrate your birthday, we hope you take some time to relax, enjoy, and do something that makes you truly happy. We look forward to celebrating many more birthdays with you and continuing to achieve great things together.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "Once again, happy birthday, [Employee's Name]! May this year be filled with new opportunities, personal growth, and wonderful memories.",
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Warm regards,',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '[Your Name]',
        },
      ],
    },
  ],
};

const Index: FC = () => {
  return (
    <>
      <Editor
        defaultContent={data}
        // defaultContent={{
        //   type: 'doc',
        //   content: [
        //     {
        //       type: 'fancyparagraph',
        //       // attrs: { class: 'fancy-paragraph' },
        //       content: [
        //         {
        //           type: 'text',
        //           text: 'This is a fancy paragraph!',
        //         },
        //       ],
        //     },
        //   ],
        // }}
      />
    </>
  );
};

export default Index;
