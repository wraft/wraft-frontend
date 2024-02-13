import { ApprovalsIcon, HomeIcon } from '@wraft/icon';

import {
  Note,
  Cabinet as BookOpen,
  Carousel,
  Cog,
  Wrench,
  TextIcon,
} from '../../../src/components/Icons';

const Menulist = [
  {
    section: 'content',
    menus: [
      {
        name: 'Dashboard',
        icon: <HomeIcon width={20} />,
        path: '/',
      },
      {
        name: 'Documents',
        icon: <Note width={20} />,
        path: '/contents',
      },
      {
        name: 'Approvals',
        icon: <ApprovalsIcon width={20} />,
        path: '/approvals',
      },
    ],
  },
  {
    section: 'structure',
    menus: [
      {
        name: 'Templates',
        icon: <Carousel width={20} />,
        path: '/templates',
      },
      {
        name: 'Variants',
        icon: <BookOpen width={20} />,
        path: '/content-types',
      },
      {
        name: 'Blocks',
        icon: <TextIcon width={20} />,
        path: '/blocks',
      },
      {
        name: 'Manage',
        icon: <Wrench width={20} />,
        path: '/manage',
      },
      {
        name: 'Settings',
        icon: <Cog width={20} />,
        path: '/account',
      },
    ],
  },
];

export default Menulist;
