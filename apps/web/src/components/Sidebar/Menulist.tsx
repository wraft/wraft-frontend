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
  Folder,
} from '@phosphor-icons/react';

const defaultIcon = 16;
const defaultWeight = 'duotone';

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
      {
        name: 'Repository',
        icon: <Folder size={defaultIcon} weight={defaultWeight} />,
        path: '/repository',
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
        name: 'Variants',
        icon: <Blueprint size={defaultIcon} weight={defaultWeight} />,
        path: '/variants',
        permissions: ['variant.show', 'variant.manage'],
      },
      {
        name: 'Manage',
        icon: <UserFocus size={defaultIcon} weight={defaultWeight} />,
        path: '/manage',
      },
    ],
  },
];
