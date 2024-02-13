import React, { memo } from 'react';

import { Link } from '@wraft/ui';
import NextLink from 'next/link';

interface AnchorType {
  href: string;
  locale?: string;
  target?: string;
  path?: string;
  variant?: any;
  type?: any;
  icon?: React.ElementType;
}

// eslint-disable-next-line react/display-name
export const NextLinkText: React.FC<React.PropsWithChildren<AnchorType>> = memo(
  ({
    children,
    href,
    locale = 'en',
    path,
    icon,
    variant = 'default',
    type,
  }) => {
    if (!href) return <>{children}</>;
    return (
      <NextLink
        href={href}
        as={path || ''}
        locale={locale}
        passHref
        legacyBehavior>
        <Link variant={variant} Icon={icon} type={type}>
          {children}
        </Link>
      </NextLink>
    );
  },
);

export default NextLinkText;
