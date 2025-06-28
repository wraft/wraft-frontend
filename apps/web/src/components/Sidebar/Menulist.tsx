import {
  ThumbsUpIcon,
  GitBranchIcon,
  UserFocusIcon,
  ArticleIcon,
  BlueprintIcon,
  FileTextIcon,
  HouseIcon,
  TextboxIcon,
  FolderIcon,
} from '@phosphor-icons/react';

const defaultIcon = 16;
const defaultWeight = 'duotone';

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
      {
        name: 'Repository',
        icon: <FolderIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/repository',
      },
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
    section: 'structure',
    menus: [
      {
        name: 'Variants',
        icon: <BlueprintIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/variants',
        permissions: ['variant.show', 'variant.manage'],
      },
      {
        name: 'Forms',
        icon: <TextboxIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/forms',
        permissions: ['forms.show', 'forms.manage'],
      },
      {
        name: 'Manage',
        icon: <UserFocusIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/manage',
      },
    ],
  },
];
