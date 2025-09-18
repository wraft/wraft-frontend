import {
  ThumbsUpIcon,
  GitBranchIcon,
  UserFocusIcon,
  ArticleIcon,
  BlueprintIcon,
  FileTextIcon,
  HouseIcon,
  // FolderIcon,
  LayoutIcon,
} from '@phosphor-icons/react';

const defaultIcon = 16;
const defaultWeight = 'regular';

export const Menulist = [
  {
    section: 'content',
    menus: [
      {
        name: 'Overview',
        icon: <HouseIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/',
      },
      {
        name: 'Documents',
        icon: <FileTextIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/documents',
      },
      {
        name: 'Approvals',
        icon: <ThumbsUpIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/approvals',
      },
      // {
      //   name: 'Repository',
      //   icon: <FolderIcon size={defaultIcon} weight={defaultWeight} />,
      //   permissions: ['repository.show', 'repository.manage'],
      //   path: '/repository',
      // },
    ],
  },
  {
    section: 'structure',
    menus: [
      {
        name: 'Pipelines',
        icon: <GitBranchIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/pipelines',
        permissions: ['pipeline.show', 'pipeline.manage'],
      },
      {
        name: 'Templates',
        icon: <ArticleIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/templates',
        permissions: ['template.show', 'template.manage'],
      },
    ],
  },
  {
    section: 'manage',
    menus: [
      {
        name: 'Variants',
        icon: <BlueprintIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/variants',
        permissions: ['variant.show', 'variant.manage'],
      },
      {
        name: 'Forms',
        icon: <LayoutIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/forms',
        permissions: ['layout.show', 'layout.manage'],
      },
      {
        name: 'Manage',
        icon: <UserFocusIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/manage',
      },
    ],
  },
];
