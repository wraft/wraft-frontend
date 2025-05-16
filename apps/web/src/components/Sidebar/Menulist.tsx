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

const defaultIcon = 18;

export const Menulist = [
  {
    section: 'content',
    menus: [
      {
        name: 'Overview',
        icon: <House size={defaultIcon} />,
        path: '/',
      },
      {
        name: 'Documents',
        icon: <FileText size={defaultIcon} />,
        path: '/documents',
      },
      {
        name: 'Approvals',
        icon: <ThumbsUp size={defaultIcon} />,
        path: '/approvals',
      },
    ],
  },
  {
    section: 'structure',
    menus: [
      {
        name: 'Pipelines',
        icon: <GitBranch size={defaultIcon} />,
        path: '/pipelines',
        permissions: ['pipeline.show', 'pipeline.manage'],
      },
      {
        name: 'Templates',
        icon: <Article size={defaultIcon} />,
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
        icon: <Blueprint size={defaultIcon} />,
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
        icon: <UserFocus size={defaultIcon} />,
        path: '/manage',
      },
    ],
  },
];
