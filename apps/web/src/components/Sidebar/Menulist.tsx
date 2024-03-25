import {
  ApprovalsIcon,
  HomeIcon,
  DocumentIcon,
  VariantIcon,
  TemplateIcon,
  TextIcon,
  ManageIcon,
  SettingIcon,
  DoxIcon,
} from '@wraft/icon';

const Menulist = [
  {
    section: 'content',
    menus: [
      {
        name: 'Dashboard',
        icon: <HomeIcon width={20} color="#2C3641" />,
        path: '/',
      },
      {
        name: 'Documents',
        icon: <DocumentIcon width={20} color="#2C3641" />,
        path: '/contents',
      },
      {
        name: 'Approvals',
        icon: <ApprovalsIcon width={20} color="#2C3641" />,
        path: '/approvals',
      },
    ],
  },
  {
    section: 'structure',
    menus: [
      {
        name: 'Templates',
        icon: <TemplateIcon width={20} color="#2C3641" />,
        path: '/templates',
      },
      {
        name: 'Variants',
        icon: <VariantIcon width={20} color="#2C3641" />,
        path: '/content-types',
      },
      {
        name: 'Forms',
        icon: <DoxIcon width={20} />,
        path: '/forms',
      },
      {
        name: 'Blocks',
        icon: <TextIcon width={20} />,
        path: '/blocks',
      },
      {
        name: 'Manage',
        icon: <ManageIcon width={20} />,
        path: '/manage',
      },
      {
        name: 'Settings',
        icon: <SettingIcon width={20} />,
        path: '/account',
      },
    ],
  },
];

export default Menulist;
