import {
  ThumbsUp,
  Files,
  HouseSimple,
  Table,
  Gear,
  TextColumns,
  UserFocus,
  Article,
  Blueprint,
} from '@phosphor-icons/react';

const Menulist = [
  {
    section: 'content',
    menus: [
      {
        name: 'Dashboard',
        icon: <HouseSimple size={20} />,
        path: '/',
      },
      {
        name: 'Documents',
        icon: <Files size={20} />,
        path: '/contents',
      },
      {
        name: 'Approvals',
        icon: <ThumbsUp size={20} />,
        path: '/approvals',
      },
    ],
  },
  {
    section: 'structure',
    menus: [
      {
        name: 'Templates',
        icon: <Article size={20} />,
        path: '/templates',
      },
      {
        name: 'Variants',
        icon: <Blueprint size={20} />,
        path: '/content-types',
      },
      {
        name: 'Forms',
        icon: <Table size={20} />,
        path: '/forms',
      },
      {
        name: 'Blocks',
        icon: <TextColumns size={20} />,
        path: '/blocks',
      },
      {
        name: 'Manage',
        icon: <UserFocus size={20} />,
        path: '/manage',
      },
    ],
  },
];

export default Menulist;
