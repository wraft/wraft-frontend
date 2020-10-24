import { Flex } from 'theme-ui';
import Link from 'next/link';

export interface IMenuItem {
  children: any;
  href: string;
  path?: string;
  variant?: string;
}

const MenuItem = (props: IMenuItem) => {
  return (
    <Flex pl={3} pt={2} pb={3} variant={props?.variant || "button"}>
      <Link href={props.href} as={props.path}>{props.children}</Link>
    </Flex>
  );
};

export default MenuItem;
