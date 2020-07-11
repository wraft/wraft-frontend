import React, { ReactElement } from 'react';
import { Box } from 'rebass';
import { Link as RebassLink } from 'theme-ui'
import NextLink from 'next/link';

interface Props {
  children: React.ReactNode;
  href: string,
  icon?: ReactElement,
  variant?: string,
  path?:string,
}

const Link: React.FC<Props> = ({ href, children, icon, variant, path }) => {
  return (
    <NextLink href={href} as={path || ""}>
      <RebassLink variant={variant || "primary"}>
        { icon &&
          <Box pl={2} pr={2} mb={0} pb={1}>{icon}</Box>
        }
        {children}
      </RebassLink>
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

export default Link