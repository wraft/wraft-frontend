import Link from 'next/link';
import { useRouter } from 'next/router';
import { Flex } from '@wraft/ui';

export interface IMenuItem {
  children: any;
  href: string;
  path?: string;
  variant?: string;
}

const MenuItem = (props: IMenuItem) => {
  const router = useRouter();
  const isActive =
    router.pathname === props.href ||
    (router.pathname.startsWith(props.href) && props.href !== '/');

  return (
    <Flex variant={props?.variant}>
      <Link
        href={props.href}
        as={props.path}
        className={isActive ? 'active' : ''}>
        {props.children}
      </Link>
    </Flex>
  );
};

export default MenuItem;
