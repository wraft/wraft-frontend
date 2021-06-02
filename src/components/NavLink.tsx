import React, { ReactElement } from 'react';
import { Box } from 'theme-ui';
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
          <Box sx={{ pt: 1}}>{icon}</Box>
        }
        {children}
      </Link>
    </NextLink>
  );
};

export default NavLink