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

// export interface MenuItem {
//   name: string;
//   icon?: any;
//   path: string;
//   permissions?: string[];
// }

// export interface MenuSection {
//   section: string;
//   menus: MenuItem[];
// }

const defaultIcon = 18;

export const Menulist = [
  {
    section: 'content',
    menus: [
      {
        name: 'Dashboard',
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
        permissions: ['data_template.show', 'data_template.manage'],
      },
    ],
  },
  {
    section: 'structure',
    menus: [
      {
        name: 'Variants',
        icon: <Blueprint size={defaultIcon} />,
        path: '/variants',
        permissions: ['content_type.show', 'content_type.manage'],
      },
      {
        name: 'Forms',
        icon: <Table size={defaultIcon} />,
        path: '/forms',
        permissions: ['form.show', 'form.manage'],
      },
      {
        name: 'Blocks',
        icon: <TextColumns size={defaultIcon} />,
        path: '/blocks',
        permissions: ['block_template.show', 'block_template.manage'],
      },
      {
        name: 'Manage',
        icon: <UserFocus size={defaultIcon} />,
        path: '/manage',
      },
    ],
  },
];
