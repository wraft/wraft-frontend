import Link from 'next/link';
import { useRouter } from 'next/router';
import { Flex } from '@wraft/ui';

export interface IMenuItem {
  children: any;
  href: string;
  path?: string;
  variant?: string;
  [key: string]: any;
}

const MenuItem = ({ children, href, path, variant, ...rest }: IMenuItem) => {
  const router = useRouter();
  const isActive =
    router.pathname === href ||
    (router.pathname.startsWith(href) && href !== '/');

  return (
    <Flex variant={variant} {...rest}>
      <Link href={href} as={path} className={isActive ? 'active' : ''}>
        {children}
      </Link>
    </Flex>
  );
};

export default MenuItem;
