import Link from 'next/link';
import { Flex } from 'theme-ui';

export interface IMenuItem {
  children: any;
  href: string;
  path?: string;
  variant?: string;
}

const MenuItem = (props: IMenuItem) => {
  return (
    <Flex
      variant={props?.variant || 'button'}
      sx={{ a: { textDecoration: 'none', color: 'text', width: '100%' } }}>
      <Link href={props.href} as={props.path}>
        {props.children}
      </Link>
    </Flex>
  );
};

export default MenuItem;
