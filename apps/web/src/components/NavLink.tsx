/* eslint-disable react/display-name */
import React, { ReactElement, memo } from 'react';

import NextLink from 'next/link';
import { Box, Link } from 'theme-ui';

interface AnchorType {
  href: string;
  locale?: string;
  target?: string;
  path?: string;
  variant?: string;
  icon?: ReactElement;
}

export const NextLinkText: React.FC<React.PropsWithChildren<AnchorType>> = memo(
  ({ children, href, locale = 'en', path, icon }) => {
    if (!href) return <>{children}</>;
    return (
      <NextLink
        href={href}
        as={path || ''}
        locale={locale}
        passHref
        legacyBehavior>
        <Link sx={{ color: 'gray.900', cursor: 'pointer' }}>
          {icon && <Box sx={{ pt: 1 }}>{icon}</Box>}
          {children}
        </Link>
      </NextLink>
    );
  },
);

export default NextLinkText;
