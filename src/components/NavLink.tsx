import React, { ReactElement } from 'react';
import { Box } from 'rebass';
import { Link } from 'theme-ui'
import NextLink from 'next/link';

interface Props {
  children: React.ReactNode;
  href: string,
  icon?: ReactElement,
  variant?: string,
  path?:string,
}

const NavLink: React.FC<Props> = ({ href, children, icon, variant, path }) => {
  return (
    <NextLink href={href} as={path || ""}>
      <Link variant={variant || "primary"}>
        { icon &&
          <Box>{icon}</Box>
        }
        {children}
      </Link>
    </NextLink>
  );
};

// export default Link;

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const Link = (props: { href: string, children: ReactElement }) => {
//   return(
//   <RebassLink as={NextLink} href={props.href}>
//     {props.children}
//   </RebassLink>
// )}

export default NavLink