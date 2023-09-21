/* eslint-disable react/display-name */
import React, { ReactElement, memo } from 'react';
import { Box, Link } from 'theme-ui';
import NextLink from 'next/link';
// import styled from '@emotion/styled';

// import theme from '../utils/theme';

// interface Props {
//   children: React.ReactNode;
//   href: string;
//   icon?: ReactElement;
//   variant?: string;
//   path?: string;

// }

interface AnchorType {
  href: string;
  locale?: string;
  target?: string;
  path?: string;
  variant?: string;
  icon?: ReactElement;
}

// const StyledLink = styled.a`
//   text-decoration: none;
//   color: ${theme.colors.white};
// `;

// const NavLink: React.FC<Props> = ({ href, children, icon, path }) => {
//   return (
//     <NextLink href={href} as={path || ''} passHref>
//       {icon && <Box sx={{ pt: 1 }}>{icon}</Box>}
//       {children}
//     </NextLink>
//   );
// };

export const NextLinkText: React.FC<React.PropsWithChildren<AnchorType>> = memo(
  ({
    children,
    href,
    locale = 'en',
    target,
    path,
    icon,
    variant = 'btnNavLink',
  }) => {
    if (!href) return <>{children}</>;
    return (
      <NextLink
        href={href}
        as={path || ''}
        locale={locale}
        passHref
        legacyBehavior>
        <Link href="" target={target} variant={variant}>
          {icon && <Box sx={{ pt: 1 }}>{icon}</Box>}
          {children}
        </Link>
      </NextLink>
    );
  },
);

export default NextLinkText;
