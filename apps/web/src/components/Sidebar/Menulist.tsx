import {
  ThumbsUp,
  Files,
  HouseSimple,
  Table,
  GitBranch,
  TextColumns,
  UserFocus,
  Article,
  Blueprint,
  Wrench,
  FileText,
  House,
  Lego,
} from '@phosphor-icons/react';

const defaultIcon = 18;

const Menulist = [
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
        path: '/contents',
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
      },
      {
        name: 'Templates',
        icon: <Article size={defaultIcon} />,
        path: '/templates',
      },
    ],
  },
  {
    section: 'structure',
    menus: [
      {
        name: 'Variants',
        icon: <Blueprint size={defaultIcon} />,
        path: '/content-types',
      },
      {
        name: 'Forms',
        icon: <Table size={defaultIcon} />,
        path: '/forms',
      },
      {
        name: 'Blocks',
        icon: <TextColumns size={defaultIcon} />,
        path: '/blocks',
      },
      {
        name: 'Manage',
        icon: <UserFocus size={defaultIcon} />,
        path: '/manage',
      },
    ],
  },
];

export default Menulist;
