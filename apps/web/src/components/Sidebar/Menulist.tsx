import {
  ThumbsUp,
  Table,
  GitBranch,
  TextColumns,
  UserFocus,
  Article,
  Blueprint,
  FileText,
  House,
} from '@phosphor-icons/react';

const defaultIcon = 16;
const defaultWeight = 'regular';

export const Menulist = [
  {
    section: 'content',
    menus: [
      {
        name: 'Overview',
        icon: <House size={defaultIcon} weight={defaultWeight} />,
        path: '/',
      },
      {
        name: 'Documents',
        icon: <FileText size={defaultIcon} weight={defaultWeight} />,
        path: '/documents',
      },
      {
        name: 'Approvals',
        icon: <ThumbsUp size={defaultIcon} weight={defaultWeight} />,
        path: '/approvals',
      },
    ],
  },
  {
    section: 'structure',
    menus: [
      {
        name: 'Pipelines',
        icon: <GitBranch size={defaultIcon} weight={defaultWeight} />,
        path: '/pipelines',
        permissions: ['pipeline.show', 'pipeline.manage'],
      },
      {
        name: 'Templates',
        icon: <Article size={defaultIcon} weight={defaultWeight} />,
        path: '/templates',
        permissions: ['template.show', 'template.manage'],
      },
    ],
  },
  {
    section: 'structure',
    menus: [
      {
        name: 'Artifacts',
        icon: <Blueprint size={defaultIcon} weight={defaultWeight} />,
        path: '/variants',
        permissions: ['variant.show', 'variant.manage'],
      },
      // {
      //   name: 'Forms',
      //   icon: <Table size={defaultIcon} />,
      //   path: '/forms',
      //   permissions: ['form.show', 'form.manage'],
      // },
      // {
      //   name: 'Blocks',
      //   icon: <TextColumns size={defaultIcon} />,
      //   path: '/blocks',
      //   permissions: ['block_template.show', 'block_template.manage'],
      // },
      {
        name: 'Manage',
        icon: <UserFocus size={defaultIcon} weight={defaultWeight} />,
        path: '/manage',
      },
    ],
  },
];
