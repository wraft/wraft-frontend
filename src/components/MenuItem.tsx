import { Flex } from 'rebass';
import Link from 'next/link';

export interface IMenuItem {
  children: any;
  href: string;
  path?: string;
}

const MenuItem = (props: IMenuItem) => {
  return (
    <Flex pl={3} pt={2} pb={3}>
      <Link href={props.href} as={props.path}>{props.children}</Link>
    </Flex>
  );
};

export default MenuItem;
