import React, { ReactElement } from 'react';
import { Box } from 'theme-ui';
import NextLink from 'next/link';
import styled from '@emotion/styled';

export const NextLinkWrapper = styled(NextLink)`
  color: '#111';
  text-decoration: none;
`;

interface Props {
  children: React.ReactNode;
  href: string;
  icon?: ReactElement;
  variant?: string;
  path?: string;
}

const NavLink: React.FC<Props> = ({ href, children, icon, path }) => {
  return (
    <NextLinkWrapper href={href} as={path || ''}>
      {icon && <Box sx={{ pt: 1 }}>{icon}</Box>}
      {children}
    </NextLinkWrapper>
  );
};

export default NavLink;
