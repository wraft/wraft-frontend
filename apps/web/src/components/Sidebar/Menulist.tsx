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
  IntersectSquareIcon,
  GearSixIcon,
} from '@phosphor-icons/react';

const defaultIcon = 16;
const defaultWeight = 'regular';

export interface MenuChild {
  name: string;
  icon: React.ReactElement;
  path: string;
  permissions?: string[];
  tourId?: string;
}

export interface MenuItem {
  name: string;
  icon: React.ReactElement;
  path: string;
  permissions?: string[];
  tourId?: string;
  children?: MenuChild[];
}

export interface MenuSection {
  section: string;
  menus: MenuItem[];
}

export const Menulist: MenuSection[] = [
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
        tourId: 'documents',
      },
      {
        name: 'Approvals',
        icon: <ThumbsUpIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/approvals',
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
        tourId: 'templates',
      },
    ],
  },
  {
    section: 'manage',
    menus: [
      {
        name: 'Manage',
        icon: <UserFocusIcon size={defaultIcon} weight={defaultWeight} />,
        path: '/manage',
        tourId: 'manage',
        children: [
          {
            name: 'Flows',
            icon: (
              <IntersectSquareIcon size={defaultIcon} weight={defaultWeight} />
            ),
            path: '/manage/flows',
            permissions: ['flow.show', 'flow.manage'],
          },
          {
            name: 'Variants',
            icon: <BlueprintIcon size={defaultIcon} weight={defaultWeight} />,
            path: '/variants',
            permissions: ['variant.show', 'variant.manage'],
            tourId: 'variants',
          },
          {
            name: 'Forms',
            icon: <LayoutIcon size={defaultIcon} weight={defaultWeight} />,
            path: '/forms',
            permissions: ['layout.show', 'layout.manage'],
          },
          {
            name: 'Layouts',
            icon: <LayoutIcon size={defaultIcon} weight={defaultWeight} />,
            path: '/manage/layouts',
            permissions: ['layout.show', 'layout.manage'],
          },
          {
            name: 'Settings',
            icon: <GearSixIcon size={defaultIcon} weight={defaultWeight} />,
            path: '/manage/workspace',
          },
        ],
      },
    ],
  },
];
